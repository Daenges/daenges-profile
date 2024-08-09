const startupCallList = []

function registerCallOnLoad(func) {
    startupCallList.push(func);
}

// Modular way to call startup() on different pages when site finished loading
document.addEventListener("readystatechange", () => {
    if(document.readyState == "complete") {
        startupCallList.forEach(f => f());
    }
});