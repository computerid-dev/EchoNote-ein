# EchoNote

Progressive Web App sosial media dengan dukungan offline
(termasuk video offline) dan verifikasi akun berlapis.

## Struktur
- `/assets` — file bersama (tema, core.js, config Firebase)
- `/login`, `/sign-in`, `/Create-Account` — alur autentikasi
- `/EchoNote/feed` — aplikasi utama setelah login
- `/netlify/functions` — backend auth & verifikasi
- `/EchoNote/feed/netlify/functions` — backend feed & chat

## Setup sebelum deploy
1. Isi `assets/firebase-config.js` (sudah terisi 3 project)
2. Set Environment Variables di Netlify:
   - `FIREBASE_SERVICE_ACCOUNT_AUTH`
   - `FIREBASE_SERVICE_ACCOUNT_FEED`
   - `FIREBASE_SERVICE_ACCOUNT_CHAT`
   - `FIREBASE_STORAGE_BUCKET_AUTH`
3. Setup Storage Lifecycle Rule — lihat
   `netlify/functions/STORAGE_FAILSAFE_SETUP.md`
