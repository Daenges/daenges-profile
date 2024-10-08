const clockDiv = document.getElementById("clock");

// Sets the clock to the current time wiht AM/PM parsing
function updateTime() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    const postfix = hours > 12 ? "PM" : "AM";
    hours = hours > 12 ? hours - 12 : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    clockDiv.innerText = `${hours}:${minutes} ${postfix}`
}

registerCallOnLoad(() => {
    updateTime();
    setInterval(updateTime, 1000);
});
