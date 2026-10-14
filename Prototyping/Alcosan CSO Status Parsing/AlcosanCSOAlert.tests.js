//
//
//

import { AlcosanCSOAlert } from "../AlcosanCSOAlert.js";

const TestMessageTexts = Object.freeze({
    active: "ALCOSAN CSO Advisory  \n \n \n \nOverflows are in effect; Minimize contact with waterways \n\nIn: 10/11/2026 - 03:17 AM \n \n \n\nTo stop receiving future email notifications from this organization unsubscribe here. (https://notifications.everbridge.net/unsubscription/email/64cEt9UaAvSkJw9ZHKGzc9mnEGIfIepule0qfWm5j1A_rQ_9_0za26-pMVVEA60uujy4G86rPN2ba3uA3nSUehCFPmrVwJ9-oYPFfCQR1U5Eiwne7NK0wnbqvjdPUQq-tbkuGo5D7XRYNwTrIn5dYHkBKZoo7ElFTnfHKV8uYQhn7BvuBisueKD5z3djK6U-P_Vudpizqroj7THSNCSkYUGyItzqGZn1fhOyHTRnYgY_f2ikzrG6ISvzQF6yxhOBD7JlqyEasv-gmLwpRhdbe47mVBbDudoaYCTdFjc59nqXAA3h1diXfbJ3JJMn-xdnnLyBldyotP2h_rT5gED79xNeyMV8YGmdA1YHBzLxPyg5CJYWLLniOCJNP5FURTcWkSqS2REqvluQYQ4E_TSn5xWkAL5yuIACCO1hrdXDuUzAWSe9wWlr0wokduBu5Ie-0GAIXaCUaNcXptiQbs-01Vzus28EixunKVM3Jb2Zt4-XURxvsHRiigUxmVO5hkz2GeTGrDiyH9OM4FMGE7Uc5qjiMx1CVNzZaqLsxQ==?language=en-US)",
    dry: "ALCOSAN CSO Advisory  \n \n \n \nSystem is in dry weather operation; No advisories are in effect \n\nIn: 10/11/2026 - 03:17 AM \nOut: 10/11/2026 - 12:31 PM \nDry: 10/13/2026 - 12:31 PM \n \n \n\nTo stop receiving future email notifications from this organization unsubscribe here. (https://notifications.everbridge.net/unsubscription/email/3_RjDGfdbYUF9wY7GTjE5krozHbyB9ZEQm1BKKDCJrD3_mJwpBQfp6SdNW8oDpKCSuhpE093qS5Lk7jfC-HZT26J9NcF26D9CfE7y7OThHOBZk4c94qgqJ0luvjUYiTIb5FU9DDUHKqCQeoQC8bLvynd1TrTgTaIQH0Z1VP4nCbROGZfcLNg4DvnpJkd4ToxV6R4EZBjXTWxXSZDoGERKcivlE6khLW8sUJWrZE6O93UhE0UxxGn8_GoL3oj_7Koe38AQarvBf3eUsEwT99uN2n6a1x04VqpDd_C1nH_3Dp2lnL5cyrJhKGkcUhWXwka-NOOgGibN3UzVb3CxPRowCBx9G9k0Y0JghngbsAbCOG6_eFUQmdBts1N6h-LSHMAozJIrrtaDAve_4OrpA1fOF_NONpDibUM4gtN0zuvm3Se2AEFGW2WbZH1intuyKK0vNUygm8fAaASH2c5WiOWQrVwxTmuPCyfosgoLZkmvVIOptqGUhDg6ucTvRwj27kJwVgSu_DzCNQAMpFHhA9oCqPEa6QhOqY8ddBMrw==?language=en-US)",
    ended: "ALCOSAN CSO Advisory  \n \n \n \nOverflows have ceased; Waterways may still be impaired. \n\nIn: 10/11/2026 - 03:17 AM \nOut: 10/11/2026 - 12:31 PM \n \n \n\nTo stop receiving future email notifications from this organization unsubscribe here. (https://notifications.everbridge.net/unsubscription/email/UhwKtiRT1YsztwVhHd-yLYJ8uRd-DeZurNMLYSqNlRgLJQbRTpEBl895rCf_T1g3coWIxH0ZrSO0Kczx7191Isi6zqEfKI14AeqLDnvsKumZhtM0U0Uyg-Pim4eRqmhSKKld-GJXF4mQ-sWZN89TtEGuHU23-AHTf9EvOnCmo2xU3vzFdl1nCojQ2DQeVVIkWaAwgQWMKC7ilf2cC6JFd70j_34RwsbRYLAUQ9tiCjLaxNBH-dDIr11O_aS94XW_v-_jgyuhIV6GaGs5QRJGiKOWDh2IdHHJzGOGmKqpQ5adbWaK675mFb63SAbv7Rp9KTDFlnXUARyzpVdka7ioDR0vHee_k2WQvZTMPpmiOZKMka31hj-t891kK865Yp9b86NJnQrLOKVm-rDB7Ft6Zj2LheOZr5AKKEeU-Ymeua8y5V2f3yu0_XdkB9Wtb4uOAXojv_MUfaWg97714Ory8YNCmqQqK7ZdbRH_b9-nUWLAHIlymXKwnE1UVBzUDAHFNb5yZVPBXTzPRAF_zxFleeE8S5UiX4h0gdiCMA==?language=en-US)",
    malformed: "ALCOSAN CSO ADVISORY \n \n \n \nMALFORMED INPUT\n \n \n \n \n",
    wrongLength: "ALCOSAN CSO ADVISORY \n \n \nEND"
});

try {

    if (AlcosanCSOAlert.parseMessage(TestMessageTexts.active) != AlcosanCSOAlert.Status.Active) {
        throw new Error("Failed test of active CSO alert message-parsing");
    }

    if (AlcosanCSOAlert.parseMessage(TestMessageTexts.ended) != AlcosanCSOAlert.Status.Ended) {
        throw new Error("Failed test of ended CSO alert message-parsing");
    }

    if (AlcosanCSOAlert.parseMessage(TestMessageTexts.dry) != AlcosanCSOAlert.Status.Dry) {
        throw new Error("Failed test of dry CSO alert message-parsing");
    }

    // This doesn't seem to be working properly...
    async function testMalformedMessageTextThrowsError() {
        let error = await new Promise((resolve, reject) => {
            try {
                // we expect this to throw
                AlcosanCSOAlert.parseMessage(TestMessageTexts.malformed);
                // so if we reach this part, we failed
                reject(null);
            } catch (error) {
                resolve(error);
            }
        });
        return (error["kind"] == AlcosanCSOAlert.ErrorKind.Malformed);
    }

    testMalformedMessageTextThrowsError().then((pass) => {
        if (!pass) {
            throw new Error("Failed test of malformed CSO alert message-parsing");
        }
    })

    async function testWrongLengthMessageTextThrowsError() {
        let error = await new Promise((resolve, reject) => {
            try {
                AlcosanCSOAlert.parseMessage(TestMessageTexts.wrongLength);
                reject(null);
            } catch (error) {
                resolve(error);
            }
        });
        return (error["kind"] == AlcosanCSOAlert.ErrorKind.WrongLength);
    }

    testWrongLengthMessageTextThrowsError().then((pass) => {
        if (!pass) {
            throw new Error("Failed test of truncated CSO alert message-parsing");
        }
    })

} catch(error) {
    console.error(error);
}
