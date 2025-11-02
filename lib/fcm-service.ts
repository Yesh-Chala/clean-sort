import { messaging } from './firebase-client';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;

export interface NotificationPermission {
  permission: NotificationPermissionState;
  canRequest: boolean;
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return { permission: 'denied', canRequest: false };
  }

  const permission = Notification.permission;
  const canRequest = permission === 'default';

  return { permission, canRequest };
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser');
  }

  if (!VAPID_KEY) {
    throw new Error('VAPID key is not configured');
  }

  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  return permission;
}

/**
 * Get FCM token for this device
 * This token needs to be sent to your backend to receive push notifications
 */
export async function getFCMToken(): Promise<string | null> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (!messaging) {
    console.warn('Firebase messaging not initialized');
    return null;
  }

  if (!VAPID_KEY) {
    throw new Error('VAPID key is not configured');
  }

  try {
    // Check permission first
    const { permission } = getNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    // Get the token
    // Use the already-registered service worker (sw.js)
    // Firebase will use sw.js since firebase-messaging-sw.js doesn't exist
    const registration = await navigator.serviceWorker.ready;
    
    console.log('Using service worker:', registration.active?.scriptURL);
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('FCM Token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
}

/**
 * Set up listener for foreground messages (when app is open)
 * Returns cleanup function
 */
export function onForegroundMessage(
  callback: (payload: any) => void
): () => void {
  if (!messaging) {
    console.warn('Firebase messaging not initialized');
    return () => {};
  }

  try {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🔔 Foreground message received:', payload);
      
      // Show browser notification even when app is in foreground
      if ('Notification' in window && Notification.permission === 'granted') {
        const notificationTitle = payload.notification?.title || 'CleanSort Reminder';
        const notificationOptions = {
          body: payload.notification?.body || payload.data?.itemName || 'Time to dispose of an item!',
          icon: '/icon-512.jpg',
          badge: '/icon-512.jpg',
          tag: payload.data?.reminderId || 'reminder',
          requireInteraction: false,
          silent: false,
          data: payload.data,
        };
        
        console.log('📢 Showing foreground notification:', notificationTitle, notificationOptions);
        const notification = new Notification(notificationTitle, notificationOptions);
        
        // Handle notification click
        notification.onclick = function(event) {
          event.preventDefault();
          window.focus();
          const reminderId = payload.data?.reminderId || payload.data?.id;
          if (reminderId) {
            window.location.href = `/reminders?id=${reminderId}`;
          } else {
            window.location.href = '/reminders';
          }
          notification.close();
        };
      } else {
        console.warn('⚠️ Cannot show notification - permission:', Notification.permission);
      }
      
      callback(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
    return () => {};
  }
}

/**
 * Initialize FCM: Request permission and get token
 * Returns the token if successful, null otherwise
 */
export async function initializeFCM(): Promise<string | null> {
  try {
    // Check if already granted
    const { permission } = getNotificationPermission();
    
    if (permission === 'denied') {
      console.warn('Notification permission was denied');
      return null;
    }

    // Request permission if needed
    if (permission === 'default') {
      const newPermission = await requestNotificationPermission();
      if (newPermission !== 'granted') {
        return null;
      }
    }

    // Get token
    const token = await getFCMToken();
    return token;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
}

