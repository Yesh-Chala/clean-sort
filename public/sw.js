// Import Firebase SDK for FCM in service worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
const firebaseConfig = {
  apiKey: "AIzaSyCP9KYOR5AR21k7RWJOUddnSnrjQLMT1gY",
  authDomain: "clean-sort.firebaseapp.com",
  projectId: "clean-sort",
  storageBucket: "clean-sort.firebasestorage.app",
  messagingSenderId: "17454415157",
  appId: "1:17454415157:web:7c895b21c5a0164672607c"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

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

// Service Worker Debug - Check capabilities
console.log('[sw.js] Service worker loaded - Checking capabilities...');
console.log('[sw.js] Registration available:', !!self.registration);
console.log('[sw.js] showNotification available:', !!(self.registration && self.registration.showNotification));

// FCM Background Message Handler (for when app is closed/minimized)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] ========== FCM MESSAGE RECEIVED ==========');
  console.log('[sw.js] Full payload:', JSON.stringify(payload, null, 2));
  
  const notificationTitle = payload.notification?.title || 'CleanSort Reminder';
  const notificationBody = payload.notification?.body || payload.data?.itemName || 'Time to dispose of an item!';
  
  console.log('[sw.js] Notification title:', notificationTitle);
  console.log('[sw.js] Notification body:', notificationBody);
  console.log('[sw.js] Registration exists:', !!self.registration);
  console.log('[sw.js] showNotification method exists:', !!(self.registration?.showNotification));
  
  if (!self.registration) {
    console.error('[sw.js] ❌ CRITICAL: self.registration is null!');
    return Promise.reject(new Error('Service worker registration not available'));
  }
  
  if (!self.registration.showNotification) {
    console.error('[sw.js] ❌ CRITICAL: showNotification method not available!');
    return Promise.reject(new Error('showNotification method not available'));
  }
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/icon-512.jpg',
    badge: '/icon-512.jpg',
    vibrate: [100, 50, 100],
    data: {
      ...payload.data,
      reminderId: payload.data?.reminderId || payload.data?.id,
      itemId: payload.data?.itemId,
      itemName: payload.data?.itemName,
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
    requireInteraction: false,
    silent: false,
    tag: payload.data?.reminderId || 'reminder',
  };

  console.log('[sw.js] Calling showNotification with:', {
    title: notificationTitle,
    options: JSON.stringify(notificationOptions, null, 2)
  });
  
  const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);
  
  console.log('[sw.js] showNotification returned promise:', notificationPromise);
  
  notificationPromise.then(() => {
    console.log('[sw.js] ========== ✅ NOTIFICATION SHOWN SUCCESSFULLY ==========');
    console.log('[sw.js] Promise resolved - notification should be visible');
  }).catch((error) => {
    console.error('[sw.js] ========== ❌ NOTIFICATION FAILED ==========');
    console.error('[sw.js] Error:', error);
    console.error('[sw.js] Error name:', error.name);
    console.error('[sw.js] Error message:', error.message);
    console.error('[sw.js] Error stack:', error.stack);
    console.error('[sw.js] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
  });
  
  return notificationPromise;
});

// Push event handler (fallback for non-FCM pushes)
self.addEventListener("push", (event) => {
  console.log('[sw.js] Push event received:', event);
  
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
      console.log('[sw.js] FCM payload:', payload);
      
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
      console.error('[sw.js] Error parsing FCM payload:', error);
      // Fallback: try to get text if JSON parsing fails
      try {
        const text = event.data.text();
        if (text) {
          notificationData.body = text;
        }
      } catch (textError) {
        console.error('[sw.js] Error reading push data as text:', textError);
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData).then(() => {
      console.log('[sw.js] ✅ Push notification shown');
    }).catch((error) => {
      console.error('[sw.js] ❌ Push notification error:', error);
    })
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
