"use strict";

/**
 * Library Bridge: This ensures BareMux is defined from the CDN
 */
const BareMux = window.BareMux || window['@extended-lib/bare-mux'];

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

// Check if BareMux loaded before trying to use it
if (!BareMux) {
    console.error("BareMux is not defined. Check your script tags in index.html.");
}

// Ensure we use the BareMux namespace
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

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