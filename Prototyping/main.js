//
//  main.js
//  WaterSafety Prototyping
//

window.addEventListener('load', (event) => {
    console.debug("main.js: document laoded");
    document.querySelectorAll('table#conditions td.value').forEach((td) => {
        td.innerHTML = "<i>loading…</i>";
    });
});
console.debug("main.js: loaded and executed");
