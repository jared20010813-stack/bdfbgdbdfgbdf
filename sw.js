// Service Worker for jared20010813-stack.github.io/bdfbgdbdfgbdf/
// This script handles the 'header stripping' required to load external games in an iframe.

const PROXY_PREFIX = '/service/';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // We only want to intercept requests that are being proxied or are external games
    if (url.includes('martiantech.github.io') || url.includes(PROXY_PREFIX)) {
        event.respondWith(
            fetch(event.request).then((response) => {
                // Create a new set of headers so we can modify them
                const newHeaders = new Headers(response.headers);

                // STRIP SECURITY HEADERS: This is what allows the game to load in your iframe
                newHeaders.delete('X-Frame-Options');
                newHeaders.delete('Content-Security-Policy');
                newHeaders.delete('Content-Security-Policy-Report-Only');

                // Return the modified response to the browser
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            }).catch((err) => {
                console.error('SW Fetch Error:', err);
                return fetch(event.request);
            })
        );
    }
});
