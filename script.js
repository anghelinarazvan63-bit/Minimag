// ---------- Firestore & Auth ----------
// Trebuie să ai deja Firebase configurat în index.html
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const productsDiv = document.getElementById('products');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

// ---------- Coș ----------
let cart = [];
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartContainer = document.getElementById('cart-container');

document.getElementById('view-cart-btn').onclick = () => {
    cartContainer.style.display = 'block';
};
document.getElementById('close-cart').onclick = () => {
    cartContainer.style.display = 'none';
};

// ---------- Adaugă în coș ----------
function addToCart(title, price) {
    const existing = cart.find(item => item.title === title);
    if(existing){
        existing.qty += 1;
    } else {
        cart.push({title, price, qty: 1});
    }
    updateCartUI();
}

function updateCartUI(){
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.title} x${item.qty} - ${item.price*item.qty} RON`;
        cartItems.appendChild(li);
        total += item.price * item.qty;
    });
    cartTotal.textContent = total;
    cartCount.textContent = cart.reduce((a,b)=>a+b.qty,0);
}

// ---------- Încarcă produse în timp real ----------
function loadProducts(){
    db.collection('products').onSnapshot(snapshot => {
        let products = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            products.push(data);
        });
        displayProducts(products);
    });
}

// ---------- Filtrare, căutare și sortare ----------
function displayProducts(products){
    // Filtrare categorie
    const category = categoryFilter.value;
    if(category !== "All") products = products.filter(p => p.category === category);

    // Căutare
    const search = searchInput.value.toLowerCase();
    if(search) products = products.filter(p => p.title.toLowerCase().includes(search));

    // Sortare
    const sort = sortFilter.value;
    if(sort === 'asc') products.sort((a,b)=>a.price-b.price);
    if(sort === 'desc') products.sort((a,b)=>b.price-a.price);

    // Afișare
    productsDiv.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p class="product-desc">${p.description || ''}</p>
            <p class="price">${p.price} RON</p>
            <button onclick="addToCart('${p.title}', ${p.price})">Adaugă în coș</button>
        `;
        productsDiv.appendChild(card);
    });
}

// ---------- Input filtre ----------
searchInput.addEventListener('input', loadProducts);
categoryFilter.addEventListener('change', loadProducts);
sortFilter.addEventListener('change', loadProducts);

// ---------- Adaugă produs nou ----------
function addProduct() {
    const title = prompt("Titlu produs:");
    const description = prompt("Descriere produs:");
    const price = parseFloat(prompt("Preț produs:"));
    const category = prompt("Categorie produs:");
    const image = prompt("URL imagine:");

    if(title && description && price && image && category){
        db.collection('products').add({
            title, description, price, category, image
        }).then(() => alert('Produs adăugat cu succes!'))
          .catch(err => alert(err));
    } else {
        alert('Completează toate câmpurile!');
    }
}

// ---------- Inițializare ----------
loadProducts();
