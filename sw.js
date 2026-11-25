/* Al Hasana Foundation - PWA Service Worker + FCM Push - Step 2 */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// ===== FCM - Background Push =====
try {
  firebase.initializeApp({
    apiKey: "AIzaSyDyywiqI_6WHN7JrfkXv0Y4v2zg-K8Wr3M",
    authDomain: "al-hasana-foundation.firebaseapp.com",
    projectId: "al-hasana-foundation",
    storageBucket: "al-hasana-foundation.firebasestorage.app",
    messagingSenderId: "85822434048",
    appId: "1:85822434048:web:a00f603b44313c04a9a1e5",
    measurementId: "G-BGWQZHVBXS"
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(function(payload) {
    var n = (payload && payload.notification) || {};
    var d = (payload && payload.data) || {};
    return self.registration.showNotification(n.title || d.title || 'আল হাসানা ফাউন্ডেশন', {
      body: n.body || d.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: '/#' + (d.url || 'home') }
    });
  });
} catch(e) { console.log('FCM SW fail', e); }

// Notification e click korle site khulbe
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ===== PWA Cache - ager motoi =====
const CACHE = 'alhasana-v6';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase / Google / onno site - cache korbo na, direct network
  if (url.origin !== self.location.origin) return;

  // Page navigation - age network, na paile cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Icon / manifest / static - age cache, na thakle network
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
