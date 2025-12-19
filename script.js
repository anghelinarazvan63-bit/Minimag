// Firebase config
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Elemente DOM
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');
const upgradeBtn = document.getElementById('upgrade-btn');
const productsDiv = document.getElementById('products');
const addProductContainer = document.getElementById('add-product-container');

// LOGIN
loginBtn?.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => alert('Autentificat!'))
        .catch(err => alert(err.message));
});

// SIGNUP
signupBtn?.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const uid = userCredential.user.uid;
            db.collection('users').doc(uid).set({
                isPremium: false,
                freeProducts: 5
            });
            alert('Cont creat!');
        })
        .catch(err => alert(err.message));
});

// LOGOUT
logoutBtn?.addEventListener('click', () => {
    auth.signOut();
});

// Observare stare autentificare
auth.onAuthStateChanged(user => {
    if(user){
        addProductContainer.style.display = 'block';
        logoutBtn.style.display = 'inline';
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
    } else {
        addProductContainer.style.display = 'none';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline';
        signupBtn.style.display = 'inline';
    }
});

// Încarcă produsele live
db.collection('products').orderBy('timestamp','desc').onSnapshot(snapshot => {
    productsDiv.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = `
        <div class="product-card" data-category="${data.category || ''}" data-price="${data.price}">
            <img src="${data.image}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p class="product-desc">${data.description || ''}</p>
            <p class="price">${data.price} RON</p>
        </div>`;
        productsDiv.innerHTML += card;
    });
});

// Adaugă produs cu imagine upload
addProductBtn?.addEventListener('click', async () => {
    const title = document.getElementById('prod-title').value;
    const description = document.getElementById('prod-desc').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category')?.value || 'Altele';
    const fileInput = document.getElementById('prod-file');
    const file = fileInput?.files[0];
    const user = auth.currentUser;

    if(!user) return alert('Trebuie să fii logat!');
    if(!file) return alert('Selectează o imagine!');

    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    if(!userData.isPremium && userData.freeProducts <= 0){
        return alert('Ai atins limita produselor gratuite. Devii premium pentru mai multe.');
    }

    // Upload imagine
    const storageRef = storage.ref(`products/${user.uid}/${file.name}`);
    const snapshot = await storageRef.put(file);
    const imageURL = await snapshot.ref.getDownloadURL();

    // Salvează produsul
    await db.collection('products').add({
        title, description, price, category, image: imageURL,
        sellerId: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    if(!userData.isPremium){
        db.collection('users').doc(user.uid).update({
            freeProducts: userData.freeProducts - 1
        });
    }

    alert('Produs adăugat cu succes!');
    fileInput.value = '';
});

// Upgrade la premium
upgradeBtn?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if(!user) return alert('Trebuie să fii logat!');

    const confirmPayment = confirm("Plata pentru premium (simulat)?");
    if(confirmPayment){
        await db.collection('users').doc(user.uid).update({
            isPremium: true
        });
        alert('Acum ești premium! Poți adăuga câte produse vrei.');
    }
});
