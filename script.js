// ========================
// FIREBASE INIT
// ========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

// Afișare produse în timp real cu animație fade-in
onSnapshot(q, snapshot => {
    productsDiv.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="badge-new">NOU</span>
            <img src="${data.image}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p class="product-desc">${data.description || ''}</p>
            <p class="price">${data.price} RON</p>
            <button onclick="addToCart('${data.title}', ${data.price})">Adaugă în coș</button>
            <button onclick="contactSeller('${data.title}')">Contactează vânzătorul</button>
        `;
        card.style.opacity = 0;
        productsDiv.appendChild(card);
        // Fade-in animat
        setTimeout(() => { card.style.opacity = 1; card.style.transition = 'opacity 0.6s ease, transform 0.3s ease'; }, 50);
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
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    } catch(e) { alert(e.message); }
}

window.loginUser = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Te-ai logat cu succes!');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
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
    } else { 
        alert('Completează toate câmpurile!'); 
    }
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
    cartTotal.textContent = (parseFloat(cartTotal.textContent) + price).toFixed(2);

    // Animație adăugare produs în coș
    item.style.transform = 'translateX(100px)';
    item.style.opacity = 0;
    setTimeout(() => {
        item.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        item.style.transform = 'translateX(0)';
        item.style.opacity = 1;
    }, 50);
}

// Coș show/hide cu tranziție
const cartContainer = document.getElementById('cart-container');
document.getElementById('view-cart-btn').onclick = function(){
    cartContainer.classList.add('show');
    cartContainer.classList.remove('hide');
}
document.getElementById('close-cart').onclick = function(){
    cartContainer.classList.remove('show');
    cartContainer.classList.add('hide');
}

// ========================
// CONTACT VÂNZĂTOR
// ========================
function contactSeller(productName) {
    const message = prompt(`Trimite mesaj vânzătorului pentru produsul: ${productName}`);
    if(message) {
        alert(`Mesajul tău a fost trimis: "${message}"\n(Vânzătorul va fi notificat)`);
    }
}
window.contactSeller = contactSeller;

// ========================
// DARK MODE (opțional)
// ========================
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    }


// ========================
// CONTACT VÂNZĂTOR
// ========================
function contactSeller(productName) {
    const message = prompt(`Trimite mesaj vânzătorului pentru produsul: ${productName}`);
    if(message) {
        alert(`Mesajul tău a fost trimis: "${message}"\n(Vânzătorul va fi notificat)`);
    }
}
window.contactSeller = contactSeller;

// ========================
// PRODUSE DEMO
// ========================
const demoProducts = [
  {title: "Telefon Galaxy S23", description: "Telefon performant cu cameră excelentă", price: 4500, image: "https://source.unsplash.com/400x300/?smartphone"},
  {title: "Laptop MacBook Air", description: "Laptop ușor și rapid", price: 7500, image: "https://source.unsplash.com/400x300/?laptop"},
  {title: "Căști Sony WH-1000XM5", description: "Căști wireless cu anulare zgomot", price: 1200, image: "https://source.unsplash.com/400x300/?headphones"},
  {title: "Televizor Samsung 55\"", description: "TV 4K Smart, ecran mare", price: 3800, image: "https://source.unsplash.com/400x300/?tv"},
  {title: "Tabletă iPad Air", description: "Tabletă compactă cu ecran Retina", price: 3200, image: "https://source.unsplash.com/400x300/?tablet"},
  {title: "Telefon iPhone 14", description: "Telefon pentru gaming și fotografie", price: 6800, image: "https://source.unsplash.com/400x300/?iphone"},
  {title: "Laptop Dell XPS 13", description: "Laptop performant pentru muncă", price: 6000, image: "https://source.unsplash.com/400x300/?dell-laptop"},
  {title: "Căști Bose QuietComfort", description: "Căști cu bass puternic și confortabile", price: 1300, image: "https://source.unsplash.com/400x300/?bose-headphones"},
  {title: "Televizor LG OLED", description: "TV Smart cu culori vii", price: 4900, image: "https://source.unsplash.com/400x300/?oled-tv"},
  {title: "Tabletă Samsung Galaxy Tab", description: "Tabletă pentru divertisment și muncă", price: 2800, image: "https://source.unsplash.com/400x300/?samsung-tablet"}
];

demoProducts.forEach(p => {
    const card = `
    <div class="product-card">
        <span class="badge-new">NOU</span>
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <p class="price">${p.price} RON</p>
        <button onclick="addToCart('${p.title}', ${p.price})">Adaugă în coș</button>
        <button onclick="contactSeller('${p.title}')">Contactează vânzătorul</button>
    </div>`;
    productsDiv.innerHTML += card;
});
