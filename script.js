// FIREBASE
const auth = firebase.auth();
const db = firebase.firestore();

// Mesaj autentificare
function msg(text){
    document.getElementById("auth-msg").innerText = text;
}

// REGISTER
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => msg("Cont creat ✔"))
        .catch(e => msg(e.message));
}

// LOGIN
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => msg("Logat ✔"))
        .catch(e => msg(e.message));
}

// USER LOGAT
auth.onAuthStateChanged(user => {
    if(user){
        document.getElementById("addBtn").style.display = "block";
        loadProducts();
    }
});

// ADAUGĂ PRODUS
function addProduct() {
    const title = prompt("Titlu produs:");
    const price = prompt("Preț:");
    const image = prompt("URL imagine:");

    const user = auth.currentUser;
    if(!user) return alert("Nu ești logat");

    db.collection("products").add({
        title,
        price,
        image,
        userId: user.uid
    }).then(() => alert("Anunț adăugat ✔"));
}

// ÎNCARCĂ TOATE PRODUSELE
function loadProducts() {
    db.collection("products").onSnapshot(snapshot => {
        const div = document.getElementById("products");
        div.innerHTML = "";
        snapshot.forEach(doc => {
            const p = doc.data();
            div.innerHTML += `
                <div class="product-card">
                    <img src="${p.image}">
                    <h3>${p.title}</h3>
                    <p>${p.price} RON</p>
                </div>
            `;
        });
    });
            }
