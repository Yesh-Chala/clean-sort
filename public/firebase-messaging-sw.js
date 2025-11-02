// Firebase Cloud Messaging Service Worker
// This file MUST exist for FCM to work on web
// It handles background push notifications when the app is closed/minimized

// Import script from Firebase SDK (v9 modular style)
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Firebase configuration - MUST match your firebase-client.ts
// Using hardcoded values here since service workers can't access import.meta.env
const firebaseConfig = {
  apiKey: "AIzaSyCP9KYOR5AR21k7RWJOUddnSnrjQLMT1gY",
  authDomain: "clean-sort.firebaseapp.com",
  projectId: "clean-sort",
  storageBucket: "clean-sort.firebasestorage.app",
  messagingSenderId: "17454415157",
  appId: "1:17454415157:web:7c895b21c5a0164672607c"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages (when app is closed/minimized)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'CleanSort Reminder';
  const notificationBody = payload.notification?.body || payload.data?.itemName || 'Time to dispose of an item!';
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

  console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle, notificationBody);
  console.log('[firebase-messaging-sw.js] Service worker registration:', !!self.registration);
  console.log('[firebase-messaging-sw.js] Notification options:', JSON.stringify(notificationOptions, null, 2));
  
  if (!self.registration || !self.registration.showNotification) {
    console.error('[firebase-messaging-sw.js] ❌ Service worker registration not available!');
    return Promise.reject(new Error('Service worker registration not available'));
  }
  
  try {
    const promise = self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[firebase-messaging-sw.js] showNotification called, promise:', promise);
    
    promise.then(() => {
      console.log('[firebase-messaging-sw.js] ✅ Notification shown successfully');
    }).catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Error showing notification:', error);
      console.error('[firebase-messaging-sw.js] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
      });
    });
    
    return promise;
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Exception showing notification:', error);
    console.error('[firebase-messaging-sw.js] Exception details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return Promise.reject(error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  event.notification.close();

  const data = event.notification.data || {};
  const reminderId = data.reminderId || data.id;

  if (event.action === "done") {
    event.waitUntil(
      clients.openWindow(`/reminders?action=done&id=${reminderId}`)
    );
  } else if (event.action === "snooze") {
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
        // Otherwise open new window/tab
        if (clients.openWindow) {
          const url = reminderId ? `/reminders?id=${reminderId}` : '/reminders';
          return clients.openWindow(url);
        }
      })
    );
  }
});
