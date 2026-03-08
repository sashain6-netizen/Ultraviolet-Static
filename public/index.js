"use strict";

let connection;

// 1. Initial Library Check & Waiting Logic
async function initProxy() {
    const BareMux = window.BareMux || 
                    window['BareMux'] || 
                    window['@extended-lib/bare-mux'];

    if (!BareMux) {
        // Still not loaded? Wait and try again.
        setTimeout(initProxy, 50);
        return;
    }

    console.log("BareMux found! Initializing connection...");
    connection = new BareMux.BareMuxConnection("/baremux/worker.js");
}

initProxy();

// 2. Element Selectors
const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");

// 3. Form Submission Logic
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Safety check: if the library is slow, try one last time to find it
    if (!connection) {
        const CurrentBareMux = window.BareMux || window['@extended-lib/bare-mux'];
        if (CurrentBareMux) {
            connection = new CurrentBareMux.BareMuxConnection("/baremux/worker.js");
        }
    }

    if (!connection) {
        error.textContent = "Proxy engine is still loading or failed to load. Please refresh.";
        return;
    }

    try {
        // registerSW must be defined in your register-sw.js file
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);
    let frame = document.getElementById("uv-frame");
    frame.style.display = "block";

    // Wisp/Epoxy Transport Logic
    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    
    try {
        if (await connection.getTransport() !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }
    } catch (transportErr) {
        console.warn("Transport setup failed, but attempting to load anyway:", transportErr);
    }

    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});