const products = [
    {
        id: 1,
        name: 'Сердечко кохання',
        img: 'images/product-1.jpg',
        price: 10,
    },
    {
        id: 2,
        name: 'Вихір кохання',
        img: 'images/product-2.jpg',
        price: 20,
    },
    {
        id: 3,
        name: 'Веселка',
        img: 'images/product-3.jpg',
        price: 10,
    },
    {
        id: 4,
        name: 'Жіноча чарівність',
        img: 'images/product-4.jpg',
        price: 10,
    },
    {
        id: 5,
        name: 'Основи виготовлення свічок',
        img: 'images/course-1.jpg',
        price: 40,

    },
    {
        id: 6,
        name: 'Мистецтво ароматерапії',
        img: 'images/course-2.jpg',
        price: 40,

    },
];

const menuBtn = document.querySelector('.menu__btn');
const menuMobile = document.querySelector('.header__menu-list');
const cartIcon = document.querySelector('.cart-btn');
const buyButtons = document.querySelectorAll('.buy-btn');

const overlay = document.querySelector('.overlay');
const cartPopup = document.querySelector('.cart-popup');
const cartItemList = document.querySelector('.cart-item-list');
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

function updateCartPopup() {
    cartItemList.innerHTML = '';
    let totalAmount = 0; // Очищуємо totalAmount перед кожним оновленням

    for (const item of cart) {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-item-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                    <span id="item-quantity-${item.id}">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-item-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                </div>
                <p class="cart-item-price" id="item-price-${item.id}">${item.totalPrice}$</p>
                <div class="delete-btn" data-item-id="${item.id}">
                    <i class="fa-solid fa-ellipsis-v"></i>
                    <div class="delete-popup">
                        <i class="fa-solid fa-trash"></i>
                        <p>Видалити</p>
                    </div>
                </div>
            </div>
        `;

        cartItemList.appendChild(listItem);

        // Add event listeners to the decrease and increase buttons
        const decreaseBtn = listItem.querySelector('.decrease-btn');
        const increaseBtn = listItem.querySelector('.increase-btn');

        decreaseBtn.addEventListener('click', () => {
            handleQuantityChange(item.id, -1);
        });

        increaseBtn.addEventListener('click', () => {
            handleQuantityChange(item.id, 1);
        });


        // Add event listener to the delete button
        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the click event from propagating to the body
            toggleDeletePopup(deleteBtn);
        });

        // Add event listener to the delete popup
        const deletePopup = listItem.querySelector('.delete-popup');
        deletePopup.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the click event from propagating to the body
            removeItemFromCart(item.id);
            closeDeletePopups(deleteBtn);
        });

        totalAmount += item.totalPrice; // Оновіть загальну суму
    }

    // Оновіть відображення загальної суми
    const totalAmountElement = document.querySelector('.total-amount');
    totalAmountElement.textContent = `${totalAmount}$`;

    // Додайте код для зміни властивостей кнопок decrease-btn
    const decreaseButtons = document.querySelectorAll('.decrease-btn');
    decreaseButtons.forEach(decreaseBtn => {
        const itemId = decreaseBtn.getAttribute('data-item-id');
        const item = cart.find(item => item.id === parseInt(itemId));

        if (item && item.quantity > 1) {
            decreaseBtn.disabled = false;
            decreaseBtn.style.color = 'blue';
        } else {
            decreaseBtn.disabled = true;
            decreaseBtn.style.color = 'gray';
        }
    });
}

function toggleDeletePopup(deleteBtn) {
    const deletePopup = deleteBtn.querySelector('.delete-popup');
    const ellipsisIcon = deleteBtn.querySelector('.fa-ellipsis-v');

    if (deletePopup.style.display === 'block') {
        deletePopup.style.display = 'none';
        ellipsisIcon.style.display = 'block';
    } else {
        // закрити всі спливаючі вікна видалення, окрім того, яке пов'язано з кнопкою видалення, натиснутою
        closeDeletePopups(deleteBtn);
        deletePopup.style.display = 'block';
    }
}

//Add a global click event listener to close the delete popup when clicking outside of it
document.body.addEventListener('click', () => {
    closeDeletePopups();
});

function closeDeletePopups(excludeBtn) {
    const deletePopups = document.querySelectorAll('.delete-popup');
    deletePopups.forEach(deletePopup => {
        if (excludeBtn && deletePopup.parentElement === excludeBtn) {
            return; // пропустити спливаюче вікно видалення, пов'язане з натиснутою кнопкою 
        }
        deletePopup.style.display = 'none';
    });
}

function handleQuantityChange(itemId, change) {
    const item = cart.find(item => item.id === itemId);

    if (item) {
        item.quantity += change;

        // переконатися, що кількість не опускається нижче 1
        if (item.quantity < 1) {
            item.quantity = 1;
        }

        // Оновіть розрахунок totalPrice
        item.totalPrice = item.quantity * item.price;

        const quantityElement = document.getElementById(`item-quantity-${itemId}`);
        const priceElement = document.getElementById(`item-price-${itemId}`);
        const decreaseBtn = document.querySelector(`.decrease-btn[data-item-id="${itemId}"]`);

        quantityElement.textContent = item.quantity;
        priceElement.textContent = `${item.totalPrice}$`;

        // Оновіть загальну суму
        updateCartPopup();
        localStorage.setItem('cart', JSON.stringify(cart));
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
                totalPrice: selectedProduct.price, // Задайте загальну вартість при додаванні нового товару
            });
        }
        cartItems++;
        updateCartIcon();
        localStorage.setItem('cart', JSON.stringify(cart));
    });
});

function removeItemFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cart.splice(index, 1);

        // Оновіть загальну суму
        updateCartPopup();
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

closeBtn.addEventListener('click', closeCartPopup);

function closeCartPopup() {
    overlay.style.display = 'none';
    cartPopup.style.display = 'none';

    localStorage.setItem('cart', JSON.stringify(cart));
}

