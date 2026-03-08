"use strict";

/**
 * Library Bridge: Finding BareMux from CDN
 * We check the window object for all common names used by the BareMux library.
 */
const BareMux = window.BareMux || 
                window['BareMux'] || 
                window['@extended-lib/bare-mux'] || 
                (window.BareMuxConnection ? { BareMuxConnection: window.BareMuxConnection } : null);

// Check if BareMux loaded before trying to use it
if (!BareMux) {
    console.error("BareMux is not defined. Check your script tags in index.html.");
}

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");

// INITIALIZE CONNECTION ONLY IF BAREMUX EXISTS
let connection;
if (BareMux) {
    connection = new BareMux.BareMuxConnection("/baremux/worker.js");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        // This function must be defined in your register-sw.js
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

    // Load the proxied URL into the iframe
    frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});