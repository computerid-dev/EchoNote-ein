/* ==========================================================
   edit-profile.js
   ========================================================== */

const db = () => firebase.app("auth").firestore();

(async function prefill(){

    const user = firebase.app("auth").auth().currentUser
        || await new Promise((resolve) => {
            firebase.app("auth").auth().onAuthStateChanged(resolve);
        });

    if (!user) {
        window.location.replace("/login/index.html");
        return;
    }

    const doc = await db().collection("users").doc(user.uid).get();

    if (doc.exists) {

        const data = doc.data();
        document.getElementById("editUsername").value = data.username || "";
        document.getElementById("editBio").value = data.bio || "";
        document.getElementById("editLink").value = data.link || "";

    }

})();

document.getElementById("saveEditBtn").addEventListener("click", async () => {

    const btn = document.getElementById("saveEditBtn");
    btn.disabled = true;
    btn.textContent = "Menyimpan...";

    try {

        const user = firebase.app("auth").auth().currentUser;

        await db().collection("users").doc(user.uid).update({

            username: document.getElementById("editUsername").value.trim() || "Tanpa nama",
            bio: document.getElementById("editBio").value.trim(),
            link: document.getElementById("editLink").value.trim() || null

        });

        window.location.replace("index.html");

    } catch (err) {

        alert("Gagal menyimpan perubahan, coba lagi.");
        console.error(err.message);

    } finally {

        btn.disabled = false;
        btn.textContent = "Simpan Perubahan";

    }

});
