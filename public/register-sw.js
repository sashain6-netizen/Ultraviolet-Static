"use strict";

const stockSW = "/uv/uv.sw.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
  if (!navigator.serviceWorker) {
    if (location.protocol !== "https:" && !swAllowedHostnames.includes(location.hostname))
      throw new Error("Service workers cannot be registered without https.");
    throw new Error("Your browser doesn't support service workers.");
  }

  // 1. Register the worker with the correct scope
  const registration = await navigator.serviceWorker.register(stockSW, {
    scope: __uv$config.prefix // This ensures it covers /uv/service/
  });

  // 2. Wait for the worker to be fully ready
  return new Promise((resolve, reject) => {
    // If already controlling the page, we are good to go
    if (navigator.serviceWorker.controller) return resolve();

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      resolve();
    }, { once: true });

    // If it's stuck in "waiting", tell it to skip waiting
    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}