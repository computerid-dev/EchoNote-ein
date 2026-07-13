/* ==========================================================
   login/script.js
   ========================================================== */

const form = document.getElementById("loginForm");
const submitBtn = document.getElementById("loginSubmit");
const errIdentifier = document.getElementById("errIdentifier");
const errPassword = document.getElementById("errPassword");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    errIdentifier.textContent = "";
    errPassword.textContent = "";

    const identifier = document.getElementById("loginIdentifier").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!identifier) {
        errIdentifier.textContent = "Wajib diisi.";
        return;
    }

    if (!password) {
        errPassword.textContent = "Wajib diisi.";
        return;
    }

    /* Login pakai nomor telepon butuh alur berbeda (OTP) di
       Firebase Auth. Untuk sekarang form ini asumsikan
       identifier berupa email; kalau mau dukung nomor
       telepon juga, tambahkan pengecekan format di sini
       dan arahkan ke flow signInWithPhoneNumber. */

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {

        const cred = await firebase.app("auth").auth()
            .signInWithEmailAndPassword(identifier, password);

        EchoSession.setLoggedIn(cred.user.uid);

        /* Sinkronkan login ke project "feed" & "chat" juga,
           supaya user gak perlu login manual 3x. */
        await EchoCrossAuth_syncAllProjects();

        window.location.replace("/EchoNote/feed/Home/home.html");

    } catch (err) {

        errPassword.textContent = mapAuthError(err.code);

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Masuk";

    }

});

function mapAuthError(code){

    const map = {
        "auth/user-not-found": "Akun tidak ditemukan.",
        "auth/wrong-password": "Kata sandi salah.",
        "auth/invalid-email": "Format email tidak valid.",
        "auth/too-many-requests": "Terlalu banyak percobaan, coba lagi nanti."
    };

    return map[code] || "Gagal masuk, coba lagi.";

}
