// ========================
// FIREBASE INIT
// ========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8IUYlmq4kceZhC3gp6e8Mk9G7eLzrYvM",
  authDomain: "minimag-7ad90.firebaseapp.com",
  projectId: "minimag-7ad90",
  storageBucket: "minimag-7ad90.firebasestorage.app",
  messagingSenderId: "685055029064",
  appId: "1:685055029064:web:8e2fe8f8b689245dd24d7d",
  measurementId: "G-SCMXR51H2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ========================
// PRODUSE DIN FIRESTORE
// ========================
const productsDiv = document.getElementById('products');
const productsCol = collection(db, 'products');
const q = query(productsCol, orderBy('timestamp', 'desc'));

// Afișare produse în timp real
onSnapshot(q, snapshot => {
    productsDiv.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = `
        <div class="product-card">
  <span class="badge-new">NOU</span>
            <img src="${data.image}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p class="product-desc">${data.description || ''}</p>
            <p class="price">${data.price} RON</p>
            <button onclick="addToCart('${data.title}', ${data.price})">Adaugă în coș</button>
            <button onclick="contactSeller('${data.title}')">Contactează vânzătorul</button>
        </div>`;
        productsDiv.innerHTML += card;
    });
});

// ========================
// FUNCȚII AUTENTIFICARE
// ========================
window.signupUser = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Cont creat cu succes!');
    } catch(e) { alert(e.message); }
}

window.loginUser = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Te-ai logat cu succes!');
    } catch(e) { alert(e.message); }
}

window.logoutUser = async function() {
    try {
        await signOut(auth);
        alert('Te-ai delogat!');
    } catch(e) { alert(e.message); }
}

// ========================
// ADĂUGARE PRODUS
// ========================
window.addProduct = async function() {
    const title = prompt("Titlu produs:");
    const description = prompt("Descriere produs:");
    const price = parseFloat(prompt("Preț produs:"));
    const image = prompt("URL imagine:");
    if(title && description && price && image){
        await addDoc(productsCol, {title, description, price, image, timestamp: new Date()});
        alert('Produs adăugat cu succes!');
    } else { alert('Completează toate câmpurile!'); }
}

// ========================
// COȘ (simplificat)
// ========================
window.addToCart = function(title, price){
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const item = document.createElement('li');
    item.textContent = `${title} - ${price} RON`;
    cartItems.appendChild(item);
    cartTotal.textContent = parseFloat(cartTotal.textContent) + price;
}
document.getElementById('view-cart-btn').onclick = function(){
    document.getElementById('cart-container').style.display = 'block';
}
document.getElementById('close-cart').onclick = function(){
    document.getElementById('cart-container').style.display = 'none';
  }
