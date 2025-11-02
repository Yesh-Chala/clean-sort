// Manual Service Worker Registration
// This ensures we control SW registration and avoid VitePWA conflicts

export async function registerServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers not supported');
    return;
  }

  try {
    // Register the main service worker (caching + FCM push events)
    const swRegistration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('✅ Main service worker registered:', swRegistration.scope);

    // Wait for it to be ready
    await navigator.serviceWorker.ready;
    console.log('✅ Main service worker ready');

    // Note: Firebase will automatically register /firebase-messaging-sw.js when getToken() is called
    // We don't manually register it here to avoid conflicts
    
    return swRegistration;
  } catch (error) {
    console.error('❌ Service worker registration failed:', error);
    throw error;
  }
}

// Auto-register on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    registerServiceWorkers();
  });
}

