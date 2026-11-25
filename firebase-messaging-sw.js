// firebase-messaging-sw.js - Background Push এর জন্য
// এই ফাইলটা index.html এর পাশে, root folder এ রাখতে হবে।
// নিচে FIREBASE_CONFIG এ তোমার আসল config বসাতে হবে (index.html এ যেটা আছে, হুবহু একইটা)

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Config বসানো আছে - আর কিছু বসাতে হবে না
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
  console.log('[firebase-messaging-sw.js] Background message', payload);
  var n = (payload && payload.notification) || {};
  var d = (payload && payload.data) || {};
  var title = n.title || d.title || 'আল হাসানা ফাউন্ডেশন';
  var body = n.body || d.body || '';
  var options = {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: '/#' + (d.url || 'home') }
  };
  return self.registration.showNotification(title, options);
});

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
