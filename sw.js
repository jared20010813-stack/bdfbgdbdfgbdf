self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting()); // Force the new version to install immediately
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim()); // Take control of the page immediately
});

self.addEventListener('fetch', (event) => {
    // Only intercept game-related requests
    if (event.request.url.includes('martiantech.github.io')) {
        event.respondWith(
            fetch(event.request).then((response) => {
                const newHeaders = new Headers(response.headers);
                // Strip the blocks that make the screen stay blank
                newHeaders.delete('X-Frame-Options');
                newHeaders.delete('Content-Security-Policy');
                
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            })
        );
    }
});
