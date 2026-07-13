/* ==========================================================
   firebase-chat.js
   Endpoint: /.netlify/functions/firebase-chat
   Project Firebase terhubung: echonotechat

   Status: SKELETON. Struktur pesan/percakapan realtime
   belum dirancang detail — ini kerangka endpoint dasar.
   Untuk chat realtime, pertimbangkan client langsung
   dengar (listen) ke Firestore lewat SDK client di
   firebase.app("chat"), bukan lewat function ini —
   function ini lebih cocok untuk aksi sekali jalan
   (kirim pesan, buat percakapan baru, dst).

   Environment Variable yang perlu diisi di Netlify:
   - FIREBASE_SERVICE_ACCOUNT_CHAT (JSON service account
     project echonotechat)
   ========================================================== */

const admin = require("firebase-admin");

if (!admin.apps.some(a => a && a.name === "chat-backend")) {

    admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CHAT)
        )
    }, "chat-backend");

}

const chatApp = admin.app("chat-backend");
const db = chatApp.firestore();

exports.handler = async (event) => {

    if (event.httpMethod === "POST") {

        const body = JSON.parse(event.body || "{}");

        if (body.action === "send-message") {

            /* TODO: validasi sender, cek keduanya saling follow
               atau tidak (relevan buat proteksi DM ke akun
               minor yang sudah kita sepakati sebelumnya). */

            const { conversationId, senderUid, text } = body;

            if (!conversationId || !senderUid || !text) {

                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Data tidak lengkap." })
                };

            }

            await db.collection("conversations")
                .doc(conversationId)
                .collection("messages")
                .add({
                    senderUid,
                    text,
                    createdAt: admin.firestore.Timestamp.now()
                });

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };

        }

        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Action tidak dikenali." })
        };

    }

    return { statusCode: 405, body: "Method Not Allowed" };

};
