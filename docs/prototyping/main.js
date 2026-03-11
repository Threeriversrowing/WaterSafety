//
//  main.js
//  WaterSafety Prototyping
//


function celsiusToFahrenheit(degC) {
    return 32.0 + (degC * 1.8);
}

function kilometersToMiles(dist) {
    return (dist / 1.609344);
}

// MARK: -

class CompassOrientation {
    constructor(angle, name, label) {
        this.angle = (angle % 360.0);
        this.name = "" + name;
        this.label = "" + label;
        Object.freeze(this);
    }
}

const CardinalDirections = Object.freeze({
    north: new CompassOrientation(0.0 , "North", "N"),
    east: new CompassOrientation(90.0, "East", "E"),
    west: new CompassOrientation(270.0, "West", "W"),
    south: new CompassOrientation(180.0, "South", "S"),
    
    northEast: new CompassOrientation(45.0, "Northeast", "NE"),
    southEast: new CompassOrientation(135.0, "Southeast", "SE"),
    southWest: new CompassOrientation(225.0, "Southwest", "SW"),
    northWest: new CompassOrientation(315.0, "Northwest", "NW")
    // todo: add three-letter orientations
    
});

function closestCardinalDirection(angle) {
    let theta = (angle % 360.0);
    let tolerance = (360.0 / Object.keys(CardinalDirections).length) / 2.0;
    
    var match = null;
    for (const dirKey in CardinalDirections) {
        let putativeDirection = CardinalDirections[dirKey];
        
        var lowerLimit = (putativeDirection.angle - tolerance);
        var upperLimit = (putativeDirection.angle + tolerance);
        
        var shiftAmount = 0;
        if (lowerLimit < 0) {
            shiftAmount = (0 - lowerLimit);
        }
        // console.debug("   " + lowerLimit + "° <= " + theta + "° <= " + upperLimit + "° ?");
        
        if (
            (lowerLimit + shiftAmount) <= (theta + shiftAmount) &&
            (theta+ shiftAmount) <= (upperLimit + shiftAmount)
        ) {
            match = putativeDirection;
            break;
        }
    }
    
    return match;
}

class Measurement {
    comment = "";
    
    constructor(value, units, updated) {
        // todo: type-check inputs
        this.value = value;
        this.units = units;
        this.updated = updated;
    }
    
    formatted() {
        let base_string = ("" + this.value + " " + this.units);
        if (this.comment != "") {
            base_string += (" (" + this.comment + ")");
        }
        return base_string;
    }
    
    writeInto(element) {
        element.innerHTML = this.formatted();
    }
}

async function getJSONFrom(url) {
    return fetch(url).then((response) => {
        if (!response.ok) {
            console.error("Could not retrieve water flow. Response:\n", response);
            return;
        } else {
            return response.json();
        }
    });
}

function formatWindMeasurements(speed, direction, gust) {
    if (speed.value == 0) {
        return speed.formatted();
    } else {
        let heading = closestCardinalDirection(direction.value);
        return (speed.formatted() + " (&rarr;" + direction.formatted() + " " + heading.label + ")");
    }
}

// MARK: -

function getWaterFlow(siteCode) {
    const data_url = "https://api.water.noaa.gov/nwps/v1/gauges/" + siteCode;
    const tableCell = document.querySelector('td.value#water_flow');
    
    getJSONFrom(data_url).then((json) => {
        return new Measurement(
            json.status.observed.secondary,
            json.status.observed.secondaryUnit,
            json.status.observed.validTime
        )
    }).then((measurement) => {
        measurement.writeInto(tableCell);
    });
}

function getWaterTemp(siteCode) {
    const data_url = "https://waterservices.usgs.gov/nwis/iv?format=json&sites=" + siteCode + "&parameterCd=00010&siteStatus=all";
    const tableCell = document.querySelector("td.value#water_temp");
    
    getJSONFrom(data_url).then((json) => {
        const tempF = celsiusToFahrenheit(json.value.timeSeries[0].values[0].value[0].value);
        return new Measurement(
            tempF.toFixed(1),
            "°F",
            json.value.timeSeries[0].values[0].value[0].dateTime
        );
    }).then((measurement) => {
        measurement.writeInto(tableCell);
    });
}

function getSunCycle(location) {
    
    const locationString = ("lat=" + location.latitude + '&lng=' + location.longitude);
    
    const now = new Date();
    
    let dateString = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    // todo: compute tomorrow's dateString and use that as well
    
    const sunrise_cell = document.querySelector('td.value#sunrise');
    const sunset_cell = document.querySelector('td.value#sunset');
    
    const data_url = "https://api.sunrise-sunset.org/json?" + locationString + "&date=" + dateString + "&formatted=0"
    
    getJSONFrom(data_url).then((json) => {
        const sunrise_value = new Date(Date.parse(json.results.sunrise));
        const sunset_value = new Date(Date.parse(json.results.sunset));
        // todo: parse relative to current time and determine daylight state
        sunrise_cell.innerHTML = sunrise_value.toLocaleTimeString();
        sunset_cell.innerHTML = sunset_value.toLocaleTimeString();
    });
}

function getWaterHeight(siteCode) {
    const data_url = "https://api.water.noaa.gov/nwps/v1/gauges/" + siteCode;
    const tableCell = document.querySelector('td.value#water_height');
    
    getJSONFrom(data_url).then((json) => {
        let measurement = new Measurement(
            json.status.observed.primary,
            json.status.observed.primaryUnit,
            json.status.observed.validTime
        )
        
        let category = json.status.observed.floodCategory;
        if (category != "no_flooding") {
            measurement.comment = category;
        }
        
        return measurement;
    }).then((measurement) => {
        measurement.writeInto(tableCell);
    })
}

function getWeatherData(siteCode) {
    const data_url = "https://api.weather.gov/stations/" + siteCode + "/observations/latest";
    
    getJSONFrom(data_url).then((json) => {
        const weather = json.properties;
        
        const airTempF = celsiusToFahrenheit(weather.temperature.value);
        const visibility_mi = kilometersToMiles(weather.visibility.value / 1000.0).toFixed(1);
        
        const windSpeed_kph = kilometersToMiles(weather.windSpeed.value).toFixed(1);
        const windGust_kph = kilometersToMiles(weather.windGust.value).toFixed(1);
        
        return {
            air_temp: new Measurement(airTempF, "°F", weather.timestamp),
            humidity: new Measurement(weather.relativeHumidity.value.toFixed(0), "%", weather.timestamp),
            visibility: new Measurement(visibility_mi, "miles", weather.timestamp),
            wind_direction: new Measurement(weather.windDirection.value, "°", weather.timestamp),
            wind_gust: new Measurement(windGust_kph, "miles/hour", weather.timestamp),
            wind_speed: new Measurement(windSpeed_kph, "miles/hour", weather.timestamp)
        };
    }).then((weatherData) => {
        
        const writeToTableCell = (measurement, cell_id) => { measurement.writeInto(document.querySelector('td.value#' + cell_id)); }
        
        weatherData.visibility.writeInto(document.querySelector('td.value#visibility'));
        weatherData.air_temp.writeInto(document.querySelector('td.value#air_temp'));
        weatherData.humidity.writeInto(document.querySelector('td.value#humidity'));
        
        document.querySelector('td.value#wind').innerHTML = formatWindMeasurements(weatherData.wind_speed, weatherData.wind_direction, weatherData.wind_gust);
    });
}

function getCSOFlagStatus() {
    // Convenience-setter
    const writeCSOFlagStatus = (status) => {
        document.querySelector('td.value#cso_flag').innerHTML = status;
    };
    
    // The CSO flag status is only monitored from 1 April to 31 October
    const month = (new Date()).getMonth() + 1;   // getMonth returns 0 for January
    if (month < 4) {
        writeCSOFlagStatus("Unavailable (CSO alerts begin April 1st).");
        return; // EARLY RETURN
    } else if (month > 10) {
        writeCSOFlagStatus("Unavailable (CSO alerts end after October 31st).");
        return; // EARLY RETURN
    }
    
    /// This gist is updated automatically with the latest CSO alert text,
    /// sent via email from https://member.everbridge.net/337966681555020/new
    /// and processed by an automation on Pipedream (https://pipedream.com/)
    const CSOStatusRetrievalURL = "https://gist.githubusercontent.com/Threeriversrowing/99925116048b5932b75bfa2bbed09c53/raw/";
    
    //  These are derived from historical message texts but may change without warning
    const CSOInEffectRegExpStr = /^(Overflows\ are\ in\ effect;)\ Minimize\ contact\ with\ waterways$\n^In\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)$/m;
    const CSOEndedRegExpStr = /^(Overflows\ have\ ceased)\;\ Waterways\ may\ still\ be\ impaired.$\n^In\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)\<br\>Out\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)$/m;
    const CSODryWeatherRegExpStr = /^(System\ is\ in\ dry\ weather\ operation)\;\ No\ advisories\ are\ in\ effect$\n^In\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)\<br\>Out\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)\<br\>Dry\:\ (\d{2})\/(\d{2})\/(\d{4})\ \-\ (\d{2})\:(\d{2})\ ([AP]M)$/m;

    const inEffectRegExp = (new RegExp()).compile(CSOInEffectRegExpStr);
    const endedRegExp = (new RegExp()).compile(CSOEndedRegExpStr);
    const dryWeatherRegExp = (new RegExp()).compile(CSODryWeatherRegExpStr);

    /// A pseudo-enum for the possible states of the CSO flag
    const CSOStatus = Object.freeze({
        inEffect: "in effect",
        ended: "ended",
        dryWeather: "dry weather"
    });

    /// Converts the gist-text into a pseudo-enum value
    /// If none of the RegExp's above match, returns null
    function parseCSOStatusText(statusText) {
        if (statusText.match(inEffectRegExp)) {
            return CSOStatus.inEffect;
        } else if (statusText.match(endedRegExp)) {
            return CSOStatus.ended;
        } else if (statusText.match(dryWeatherRegExp)) {
            return CSOStatus.dryWeather;
        } else {
            return null;
        }
    }
    
    fetch(CSOStatusRetrievalURL).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: status = ${response.status}`);
        }
        return response.text();
    }).then((statusText) => {
        if (statusText == null) {
            throw new Error("No status text retrieved.");
        }
        writeCSOFlagStatus(statusText);
    });
}

// MARK: -

function main() {
    
    getWaterFlow('ACMP1');
    getWaterTemp('03049640');
    getWaterHeight('PTTP1');
    getSunCycle({
        'latitude': 40.466846,
        'longitude': -79.976543
    });
    getWeatherData('KPIT');
    getCSOFlagStatus();
    
}

window.addEventListener('load', (event) => {
    console.debug("main.js: document laoded");
    document.querySelectorAll('table#conditions td.value').forEach((td) => {
        td.innerHTML = "<i>loading…</i>";
    });
    
    main();
});

console.debug("main.js: loaded and executed");
