/* ==========================================================
   firebase-feed.js
   Endpoint: /.netlify/functions/firebase-feed
   Project Firebase terhubung: echonotefeed

   Status: SKELETON. Struktur data feed (urutan tampil,
   algoritma rekomendasi, dsb) belum dirancang detail —
   ini baru kerangka endpoint yang siap diisi.

   Environment Variable yang perlu diisi di Netlify:
   - FIREBASE_SERVICE_ACCOUNT_FEED (JSON service account
     project echonotefeed)
   ========================================================== */

const admin = require("firebase-admin");

if (!admin.apps.some(a => a && a.name === "feed-backend")) {

    admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_FEED)
        )
    }, "feed-backend");

}

const feedApp = admin.app("feed-backend");
const db = feedApp.firestore();

exports.handler = async (event) => {

    if (event.httpMethod === "GET") {

        /* TODO: ganti query di bawah sesuai struktur final
           koleksi "posts" (urutan waktu dulu untuk MVP,
           bisa dikembangkan jadi algoritma nanti). */

        const params = event.queryStringParameters || {};
        const limit = Math.min(parseInt(params.limit) || 20, 50);

        const snap = await db.collection("posts")
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();

        const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            statusCode: 200,
            body: JSON.stringify({ posts })
        };

    }

    if (event.httpMethod === "POST") {

        /* TODO: validasi input, cek auth token pengirim
           sebelum simpan post baru. */

        return {
            statusCode: 501,
            body: JSON.stringify({ error: "Belum diimplementasikan." })
        };

    }

    return { statusCode: 405, body: "Method Not Allowed" };

};
