/* ==========================================================
   firebase-auth.js
   Endpoint: POST /.netlify/functions/firebase-auth

   Tugas file ini:
   - Terima ID Token dari project "auth" (echonoteauth)
   - Verifikasi token itu benar & belum expired
   - Mint CUSTOM TOKEN untuk project "feed" (echonotefeed)
     dan "chat" (echonotechat) dengan UID YANG SAMA
   - Client lalu pakai custom token ini buat login otomatis
     ke 2 project lain (lihat assets/cross-auth.js)

   Kenapa perlu 3 Admin SDK terpisah? Karena masing-masing
   project Firebase punya service account sendiri-sendiri,
   gak bisa saling pinjam.

   Environment Variables yang WAJIB diisi di Netlify:
   - FIREBASE_SERVICE_ACCOUNT_AUTH  (project echonoteauth)
   - FIREBASE_SERVICE_ACCOUNT_FEED  (project echonotefeed)
   - FIREBASE_SERVICE_ACCOUNT_CHAT  (project echonotechat)
   Isinya JSON service account (Project Settings > Service
   Accounts > Generate new private key) dari MASING-MASING
   project, di-paste sebagai string JSON.
   ========================================================== */

const admin = require("firebase-admin");

/* Inisialisasi 3 Admin App terpisah, masing-masing dengan
   nama unik supaya gak bentrok satu sama lain. */

function getAdminApp(name, envVarName){

    const existing = admin.apps.find(a => a && a.name === name);

    if (existing) return existing;

    const serviceAccount = JSON.parse(process.env[envVarName]);

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    }, name);

}

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {

        return { statusCode: 405, body: "Method Not Allowed" };

    }

    try {

        const body = JSON.parse(event.body);

        if (body.action !== "sync-tokens") {

            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Action tidak dikenali." })
            };

        }

        const { idToken } = body;

        if (!idToken) {

            return {
                statusCode: 400,
                body: JSON.stringify({ error: "idToken wajib diisi." })
            };

        }

        /* 1. Verifikasi token dari project AUTH */

        const authApp = getAdminApp("admin-auth", "FIREBASE_SERVICE_ACCOUNT_AUTH");

        const decoded = await authApp.auth().verifyIdToken(idToken);

        const uid = decoded.uid;

        /* 2. Mint custom token untuk project FEED & CHAT,
              pakai UID yang SAMA supaya data user konsisten
              di ketiga project. */

        const feedApp = getAdminApp("admin-feed", "FIREBASE_SERVICE_ACCOUNT_FEED");
        const chatApp = getAdminApp("admin-chat", "FIREBASE_SERVICE_ACCOUNT_CHAT");

        const [feedToken, chatToken] = await Promise.all([

            feedApp.auth().createCustomToken(uid),
            chatApp.auth().createCustomToken(uid)

        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ feedToken, chatToken })
        };

    } catch (err) {

        console.error("firebase-auth sync-tokens failed:", err.message);

        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Token tidak valid atau sinkronisasi gagal." })
        };

    }

};
