/* ==========================================================
   cross-auth.js
   Menyambungkan login 1x (project "auth") supaya user juga
   otomatis ter-autentikasi di project "feed" dan "chat".

   Alur:
   1. User login/daftar di project "auth" seperti biasa
      (firebase.app("auth").auth())
   2. Client kirim ID Token project "auth" ke Netlify Function
      /netlify/functions/firebase-auth.js
   3. Function itu verifikasi token, lalu mint CUSTOM TOKEN
      untuk project "feed" dan "chat" (pakai Admin SDK
      masing-masing project)
   4. Client pakai custom token itu buat signInWithCustomToken
      di firebase.app("feed") dan firebase.app("chat")

   Dipanggil sekali setelah login/register sukses.
   ========================================================== */

async function EchoCrossAuth_syncAllProjects(){

    const authApp = firebase.app("auth");
    const user = authApp.auth().currentUser;

    if (!user) {

        throw new Error("Belum login di project auth.");

    }

    const idToken = await user.getIdToken();

    const res = await fetch("/.netlify/functions/firebase-auth", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-tokens", idToken })

    });

    if (!res.ok) {

        throw new Error("Gagal sinkronisasi ke project feed/chat.");

    }

    const { feedToken, chatToken } = await res.json();

    await Promise.all([

        firebase.app("feed").auth().signInWithCustomToken(feedToken),
        firebase.app("chat").auth().signInWithCustomToken(chatToken)

    ]);

}
