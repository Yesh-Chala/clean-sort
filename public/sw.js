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

// Push notification handling
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Time to dispose of an item!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "done",
        title: "Mark as Done",
        icon: "/icon-192.png",
      },
      {
        action: "snooze",
        title: "Snooze 1 hour",
        icon: "/icon-192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("CleanSort Reminder", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "done") {
    // Handle mark as done
    event.waitUntil(clients.openWindow("/reminders?action=done&id=" + event.notification.data.primaryKey))
  } else if (event.action === "snooze") {
    // Handle snooze
    event.waitUntil(clients.openWindow("/reminders?action=snooze&id=" + event.notification.data.primaryKey))
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"))
  }
})
