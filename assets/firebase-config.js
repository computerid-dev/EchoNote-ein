/* ==========================================================
   firebase-config.js
   Inisialisasi CLIENT-SIDE untuk 3 project Firebase EchoNote.

   Kenapa 3 app terpisah dalam 1 file? Firebase JS SDK
   mendukung multi-app lewat parameter kedua initializeApp()
   (nama app). Ini cara resmi menangani multi-project dalam
   1 halaman, BUKAN workaround.

   Login tetap terasa "sekali" buat user -> lihat
   assets/cross-auth.js untuk mekanisme penyambungnya
   (custom token exchange).
   ========================================================== */

const FIREBASE_CONFIG_AUTH = {
    apiKey: "AIzaSyDxmlI6j3rqGEIa1bcKY5E8PS3lMV4Z-18",
    authDomain: "echonoteauth.firebaseapp.com",
    projectId: "echonoteauth",
    storageBucket: "echonoteauth.firebasestorage.app",
    messagingSenderId: "923753058822",
    appId: "1:923753058822:web:b772b81aa7fbd84c522987",
    measurementId: "G-FGD9302377"
};

const FIREBASE_CONFIG_FEED = {
    apiKey: "AIzaSyCujZp2GhLe7lRA8Jkwyy5lfm0cdEVhF3c",
    authDomain: "echonotefeed.firebaseapp.com",
    projectId: "echonotefeed",
    storageBucket: "echonotefeed.firebasestorage.app",
    messagingSenderId: "1050749194895",
    appId: "1:1050749194895:web:9bd71c12b203af13c356fa",
    measurementId: "G-2WVPZ8YW9K"
};

const FIREBASE_CONFIG_CHAT = {
    apiKey: "AIzaSyDSJ4__pTnsxirvrHCnuXzs7NI-Jx-66pQ",
    authDomain: "echonotechat.firebaseapp.com",
    projectId: "echonotechat",
    storageBucket: "echonotechat.firebasestorage.app",
    messagingSenderId: "171030192739",
    appId: "1:171030192739:web:025c3ef04c6838be620e56",
    measurementId: "G-TYCS9B2TPD"
};

/* Inisialisasi 3 app dengan nama berbeda. Dipanggil pakai
   firebase.app("auth"), firebase.app("feed"), firebase.app("chat")
   -- BUKAN firebase.app() default, karena defaultnya ambigu
   kalau ada lebih dari 1 app. */

if (typeof firebase !== "undefined") {

    if (!firebase.apps.some(a => a.name === "auth")) {
        firebase.initializeApp(FIREBASE_CONFIG_AUTH, "auth");
    }

    if (!firebase.apps.some(a => a.name === "feed")) {
        firebase.initializeApp(FIREBASE_CONFIG_FEED, "feed");
    }

    if (!firebase.apps.some(a => a.name === "chat")) {
        firebase.initializeApp(FIREBASE_CONFIG_CHAT, "chat");
    }

}
