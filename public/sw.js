const CACHE_NAME = "cleansort-v1"
const urlsToCache = [
  "/",
  "/add",
  "/scan",
  "/reminders",
  "/guides",
  "/items",
  "/settings",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.jpg",
  "/static/js/bundle.js",
  "/static/css/main.css",
]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Don't intercept API requests to backend server
  // Only handle requests to the same origin (frontend app)
  if (url.origin !== self.location.origin) {
    // For external requests (like API calls), just fetch normally
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response
      }

      // For navigation requests, return index.html to handle client-side routing
      if (event.request.mode === "navigate") {
        return caches.match("/").then((response) => {
          return response || fetch(event.request)
        })
      }

      // For other requests, fetch from network
      return fetch(event.request)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline queue sync when connection is restored
  console.log("Background sync triggered")
}

// Push notification handling (FCM)
self.addEventListener("push", (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: "CleanSort Reminder",
    body: "Time to dispose of an item!",
    icon: "/icon-512.jpg",
    badge: "/icon-512.jpg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "done",
        title: "Mark as Done",
        icon: "/icon-512.jpg",
      },
      {
        action: "snooze",
        title: "Snooze 1 hour",
        icon: "/icon-512.jpg",
      },
    ],
  };

  // If event.data exists (from FCM), use it
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('FCM payload:', payload);
      
      // Extract notification data from FCM payload
      if (payload.notification) {
        notificationData.title = payload.notification.title || notificationData.title;
        notificationData.body = payload.notification.body || notificationData.body;
        notificationData.icon = payload.notification.icon || notificationData.icon;
      }
      
      // Store custom data
      if (payload.data) {
        notificationData.data = {
          ...notificationData.data,
          ...payload.data,
          reminderId: payload.data.reminderId || payload.data.id,
        };
      }
    } catch (error) {
      console.error('Error parsing FCM payload:', error);
      // Fallback: try to get text if JSON parsing fails
      try {
        const text = event.data.text();
        if (text) {
          notificationData.body = text;
        }
      } catch (textError) {
        console.error('Error reading push data as text:', textError);
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  const data = event.notification.data || {};
  const reminderId = data.reminderId || data.primaryKey || data.id;

  if (event.action === "done") {
    // Handle mark as done
    event.waitUntil(
      clients.openWindow(`/reminders?action=done&id=${reminderId}`)
    );
  } else if (event.action === "snooze") {
    // Handle snooze
    event.waitUntil(
      clients.openWindow(`/reminders?action=snooze&id=${reminderId}`)
    );
  } else {
    // Default action - open app or focus if already open
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          const url = reminderId ? `/reminders?id=${reminderId}` : '/reminders';
          return clients.openWindow(url);
        }
      })
    );
  }
});
