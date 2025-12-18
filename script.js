let cartCount = 0;

function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
}

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
