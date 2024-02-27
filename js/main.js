const products = [
    { 
        id: 1, 
        name: 'Сердечко кохання', 
        img: 'images/product-1.jpg', 
        price: '10$',
    },
    { 
        id: 2, 
        name: 'Вихір кохання', 
        img: 'images/product-2.jpg', 
        price: '20$',
    },
    { 
        id: 3, 
        name: 'Веселка', 
        img: 'images/product-3.jpg', 
        price: '10$',
    },
    { 
        id: 4, 
        name: 'Жіноча чарівність', 
        img: 'images/product-4.jpg', 
        price: '10$',
    },
];

const menuBtn = document.querySelector('.menu__btn');
const menuMobile = document.querySelector('.header__menu-list');
const cartIcon = document.getElementById('cartIcon');
const buyButtons = document.querySelectorAll('.buy-btn');

const overlay = document.getElementById('overlay');
const cartPopup = document.getElementById('cartPopup');
const cartItemList = document.getElementById('cartItemList');
const closeBtn = document.querySelector('.close-btn');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartItems = 0;

menuBtn.addEventListener('click', () => {
    menuMobile.classList.toggle('menu--open')
});

function updateCartIcon() {
    if (cartItems > 0) {
        cartIcon.innerHTML = `<i class="fa-solid fa-basket-shopping"></i> <span>${cartItems}</span>`;
    } else {
        cartIcon.innerHTML = `<i class="fa-solid fa-basket-shopping"></i>`;
    }
}

cartIcon.addEventListener('click', () => {
    overlay.style.display = 'block';
    cartPopup.style.display = 'block';

    updateCartPopup();
});

closeBtn.addEventListener('click', closeCartPopup);

function closeCartPopup() {
    overlay.style.display = 'none';
    cartPopup.style.display = 'none';

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartPopup() {
    cartItemList.innerHTML = '';

    for (const item of cart) {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 'decrease')"><i class="fa-solid fa-plus"></button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 'increase')"><i class="fa-solid fa-minus"></button>
                </div>
                <p class="cart-item-price">${item.price}</p>
            </div>
        `;

        cartItemList.appendChild(listItem);
    }
}

function changeQuantity(productId, action) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        if (action === 'increase') {
            cart[productIndex].quantity++;
        } else if (action === 'decrease' && cart[productIndex].quantity > 1) {
            cart[productIndex].quantity--;
        }

        updateCartPopup();
        updateCartIcon();
    }
}

buyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.dataset.productId;
        const selectedProduct = products.find(product => product.id === parseInt(productId));
        const existingItem = cart.find(item => item.id === selectedProduct.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                img: selectedProduct.img,
                price: selectedProduct.price,
                quantity: 1,
            });
        }

        cartItems++;
        updateCartIcon();

        localStorage.setItem('cart', JSON.stringify(cart));
    });
});


