Al Hasana Foundation - GitHub Upload Guide
==========================================

GitHub e ki ki upload korbo?
----------------------------
1. index.html  -> ager ta replace koro (main / root folder e)
2. firebase-messaging-sw.js -> notun file, index.html er pashe rakho (main / root folder e)

Baki file gulo ager motoi thakbe:
- manifest.json
- sw.js
- icon-192.png
- apple-touch-icon.png

Jodi sw.js thake:
- sw.js er upore sw-fcm-snippet.txt er code ta bosao, nahole background push asbe na.
- Jodi sw.js na thake, tahole firebase-messaging-sw.js e enough.

Firestore Rules:
- Firebase Console > Firestore > Rules e giye firestore-rules.txt er fcmTokens part ta add kore Publish koro.

Test:
- Site khule Bell icon > Notification chalu korun > Allow
- Firestore > fcmTokens e token joma hobe kina dekho

Cloud Function (Step 7):
- functions/ folder er file diye pore deploy korbo, jate app bondho thakleo push jay.
