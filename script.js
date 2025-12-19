let cart = [];

function addToCart(productName, price) {
    cart.push({name: productName, price: price});
    document.getElementById('cart-count').innerText = cart.length;
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `<li>${item.name} - ${item.price} RON 
        <button onclick="removeFromCart(${index})">X</button></li>`;
    });
    document.getElementById('cart-total').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cart-count').innerText = cart.length;
    updateCartDisplay();
}

// Buton Vezi coș
document.getElementById('view-cart-btn').addEventListener('click', () => {
    document.getElementById('cart-container').style.display = 'block';
});

// Buton Închide coș
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-container').style.display = 'none';
});

// Căutare produse
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const title = product.querySelector('h3').innerText.toLowerCase();
        if(title.includes(filter)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
});
// Filtrare pe categorii
const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', function() {
    const category = categoryFilter.value;
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if(category === "All" || product.dataset.category === category) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
});

// Sortare după preț
const sortFilter = document.getElementById('sort-filter');
sortFilter.addEventListener('change', function() {
    const productsContainer = document.getElementById('products');
    const products = Array.from(productsContainer.children);
    const sortType = sortFilter.value;

    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        if(sortType === 'asc') return priceA - priceB;
        if(sortType === 'desc') return priceB - priceA;
        return 0;
    });

    products.forEach(product => productsContainer.appendChild(product));
});
