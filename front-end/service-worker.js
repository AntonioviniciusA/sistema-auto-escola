const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",
  "./index.html",
  "./src/assets/logo.png",
  "./src/App.css", // Added CSS file
  "./src/index.css", // Added index CSS file
  "./src/main.jsx", // Added main JS file
  "./src/reportWebVitals.js", // Added report Web Vitals file
  // Add other assets you want to cache
];

// Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch the cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
