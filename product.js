// Preluăm parametrii din URL
const params = new URLSearchParams(window.location.search);
const title = params.get('title');
const price = params.get('price');
const desc = params.get('desc');
const image = params.get('image');

document.getElementById('product-title').innerText = title;
document.getElementById('product-price').innerText = price + ' RON';
document.getElementById('product-desc').innerText = desc;
document.getElementById('product-image').src = image;

document.getElementById('add-to-cart').onclick = () => {
    addToCart(title, price);
};

document.getElementById('contact-seller').onclick = () => {
    contactSeller(title);
};
