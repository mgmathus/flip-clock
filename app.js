
var spinSeconds = 0;
var spinMinutes = 0;
var spinHours = 0;

var formatToggle = false;
let hour24 = false;

var toggleSeconds = true;
var toggleMinutes = true;
var toggleHours = true;
function getCurrentTime() {
    formatToggle = document.getElementById("hourtype").checked != hour24 ? true : false;
    hour24 = document.getElementById("hourtype").checked;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: tz };
    let optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: tz, hour12: !hour24 };
    let d = new Date();

    document.getElementById("date").innerHTML = d.toLocaleString("en-US", optionsDate);
    let clock = d.toLocaleString("en-US", optionsTime).replaceAll(":", "|").replaceAll(" ", "|");
    let clockParts = clock.split("|");
    //calculate next
    let nsecond = parseInt(clockParts[2]);
    if (spinSeconds === 0) {
        nsecond = clockParts[2];
    } else {
        nsecond = nsecond === 59 ? 0 : nsecond + 1;
        nsecond = String(nsecond);
        nsecond = nsecond.length < 2 ? "0" + nsecond : nsecond;
    }

    if (toggleSeconds || spinSeconds === 0) {
        document.getElementById("seconds_prev").innerHTML = clockParts[2];
        document.getElementById("seconds_post").innerHTML = nsecond;
    } else {
        document.getElementById("seconds_prev").innerHTML = nsecond;
        document.getElementById("seconds_post").innerHTML = clockParts[2];
    }

    toggleSeconds = !toggleSeconds;
    //spins seconds
    spinSeconds = spinSeconds + 180;
    document.getElementById("flip-card-inner-s").style.transform = "rotateX(-" + spinSeconds + "deg)";

    //spin minutes
    let nm = calculateAndSpin(nsecond, clockParts[1], spinMinutes, 59, toggleMinutes, "minutes", "m");
    let nminute = nm[0];
    toggleMinutes = nm[1];
    spinMinutes = nm[2];

    document.getElementById("mer").innerHTML = clockParts[3];
    if (!hour24) {
        document.getElementById("mer").style.display = "block";
    } else {
        document.getElementById("mer").style.display = "none";
    }

    //spin hours
    let nh = calculateAndSpin(nminute, clockParts[0], spinHours, 11, toggleHours, "hours", "h");
    toggleHours = nh[1];
    spinHours = nh[2];

    return true;
}

function calculateAndSpin(npart, currentVal, spinval, valcompare, toggle, component, innerid) {
    let nval = parseInt(currentVal);
    console.log(formatToggle);
    if (npart === "00" || spinval === 0 || formatToggle) {
        if (spinval === 0 || formatToggle) {
            nval = currentVal;
        } else {
            nval = nval === valcompare ? 0 : nval + 1;
            nval = String(nval);
            nval = nval.length < 2 ? "0" + nval : nval;
        }

        if (toggle || spinval === 0) {
            document.getElementById(component + "_prev").innerHTML = currentVal;
            document.getElementById(component + "_post").innerHTML = nval;
        } else {
            document.getElementById(component + "_prev").innerHTML = nval;
            document.getElementById(component + "_post").innerHTML = currentVal;
        }
        toggle = !toggle;
        spinval = spinval + 180;
        document.getElementById("flip-card-inner-" + innerid).style.transform = "rotateX(-" + spinval + "deg)";
    }
    return [nval, toggle, spinval];
}

function openFullscreen() {
    let elem = document.querySelector("html");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function setBackground() {
    document.body.style.backgroundColor = document.getElementById('bg-color').value;
}

function setFontColor() {
    document.getElementById('date').style.color = document.getElementById('fc-color').value;
}

setInterval(getCurrentTime, 1000); //each second