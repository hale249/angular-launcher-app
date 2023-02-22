let lastError;

function checkAndRedirect(url, delay) {
    var xhr = new XMLHttpRequest();
    var retry = function() {
        setTimeout(function() {
            checkAndRedirect(url, delay);
        }, delay);
    }

    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            window.location = url;
            lastError = null;
        } else {
            retry();
            lastError = status;
        }
    };
    xhr.onerror = e => {
        lastError = e;
        retry();
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var url = getParameterByName('url');

checkAndRedirect(url, 1000);

const message = document.getElementById("message");
let connecting_second = 0;

function refreshMessage() {
    if (connecting_second > 60) {
        message.innerHTML = `Already ${connecting_second} seconds. <br> Please check the connection to the server. <br> Still trying...`;
    } else {
        message.innerHTML = `Connecting to the server <br> <i class="timer">${connecting_second} seconds<i>`;
    }
}

/************************************************** */
refreshMessage();
setInterval(_ => {
    connecting_second++;
    refreshMessage();
}, 1000);

function onScreenKeyboard(id) {
    document.getElementById(id).onclick = () => {
        try {
            __QMS.__util.cmd("explorer", ["C:\\Windows\\System32\\osk.exe"]);
        } catch (e) {
            console.log(e);
        }
    }
}

onScreenKeyboard("osk");