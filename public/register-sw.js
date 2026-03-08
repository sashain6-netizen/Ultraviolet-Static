"use strict";

const stockSW = "/uv/uv.sw.js";

async function registerSW() {
    if (!navigator.serviceWorker) {
        throw new Error("Your browser doesn't support service workers.");
  }

  // Register the worker with the correct scope
  const registration = await navigator.serviceWorker.register(stockSW, {
    scope: __uv$config.prefix
  });

  // Wait for the service worker to be ready, but don't hang forever
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise((resolve) => setTimeout(resolve, 2000)) 
  ]);
}