// Масив продуктів
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

// Селектори DOM-елементів
const menuBtn = document.querySelector('.menu__btn');
const menuMobile = document.querySelector('.header__menu-list');
const cartIcon = document.querySelector('.cart-btn');
const buyButtons = document.querySelectorAll('.buy-btn');
const feedbackBuyButtons = document.querySelectorAll('.feedback__item-btn');
const overlay = document.querySelector('.overlay');
const cartPopup = document.querySelector('.cart-popup');
const cartItemList = document.querySelector('.cart-item-list');
const closeBtn = document.querySelector('.close-btn');

// Зчитування корзини з локального сховища або створення нової
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartItems = 0;

// Переключення меню на мобільних пристроях
menuBtn.addEventListener('click', () => {
    menuMobile.classList.toggle('menu--open')
});

// Оновлення іконки корзини
function updateCartIcon() {
    if (cartItems > 0) {
        cartIcon.innerHTML = `<i class="fa-solid fa-basket-shopping"></i> <span>${cartItems}</span>`;
    } else {
        cartIcon.innerHTML = `<i class="fa-solid fa-basket-shopping"></i>`;
    }
}

// Оновлення кількості товарів в корзині
function updateCartItemsCount() {
    cartItems = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartIcon();
}

// Показ вікна корзини при кліку на іконку
cartIcon.addEventListener('click', () => {
    overlay.style.display = 'block';
    cartPopup.style.display = 'block';

    updateCartPopup();
});

// Оновлення вікна корзини
function updateCartPopup() {
    cartItemList.innerHTML = '';
    let totalAmount = 0; 

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

        const decreaseBtn = listItem.querySelector('.decrease-btn');
        const increaseBtn = listItem.querySelector('.increase-btn');

        decreaseBtn.addEventListener('click', () => {
            handleQuantityChange(item.id, -1);
        });

        increaseBtn.addEventListener('click', () => {
            handleQuantityChange(item.id, 1);
        });

        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleDeletePopup(deleteBtn);
        });

        
        const deletePopup = listItem.querySelector('.delete-popup');
        deletePopup.addEventListener('click', (event) => {
            event.stopPropagation(); 
            removeItemFromCart(item.id);
            closeDeletePopups(deleteBtn);
        });

        totalAmount += item.totalPrice; 
    }

    const totalAmountElement = document.querySelector('.total-amount');
    totalAmountElement.textContent = `${totalAmount}$`;

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

// Переключення відображення/приховання 'видалення товару' при кліку на іконку
function toggleDeletePopup(deleteBtn) {
    const deletePopup = deleteBtn.querySelector('.delete-popup');
    const ellipsisIcon = deleteBtn.querySelector('.fa-ellipsis-v');

    if (deletePopup.style.display === 'block') {
        deletePopup.style.display = 'none';
        ellipsisIcon.style.display = 'block';
    } else {
        closeDeletePopups(deleteBtn);
        deletePopup.style.display = 'block';
    }
}

// Закриття 'видалення товару' товару
document.body.addEventListener('click', () => {
    closeDeletePopups();
});

// Закриття 'видалення товару' товару (з виключенням конкретної кнопки)
function closeDeletePopups(excludeBtn) {
    const deletePopups = document.querySelectorAll('.delete-popup');
    deletePopups.forEach(deletePopup => {
        if (excludeBtn && deletePopup.parentElement === excludeBtn) {
            return; 
        }
        deletePopup.style.display = 'none';
    });
}

// Зміна кількості товарів
function handleQuantityChange(itemId, change) {
    const item = cart.find(item => item.id === itemId);

    if (item) {
        item.quantity += change;

        if (item.quantity < 1) {
            item.quantity = 1;
        }

        item.totalPrice = item.quantity * item.price;

        const quantityElement = document.getElementById(`item-quantity-${itemId}`);
        const priceElement = document.getElementById(`item-price-${itemId}`);
        const decreaseBtn = document.querySelector(`.decrease-btn[data-item-id="${itemId}"]`);

        quantityElement.textContent = item.quantity;
        priceElement.textContent = `${item.totalPrice}$`;

        updateCartPopup();
        localStorage.setItem('cart', JSON.stringify(cart));

        if (item.quantity === 1) {
            decreaseBtn.disabled = true;
            decreaseBtn.style.color = 'gray';
        }

        updateCartItemsCount();
    }
}

// Додаємо подію click для кожної кнопки "Купити"
buyButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Функція для додавання товару в корзину
function addToCart(event) {
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
            totalPrice: selectedProduct.price,
        });
    }
    
    updateCartIcon();
    updateCartItemsCount();
    updateCartPopup();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Додаємо подію click для кожної кнопки "Купити цей товар" відгуків
feedbackBuyButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// видалення товара з корзини
function removeItemFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cart.splice(index, 1);

        updateCartPopup();
        updateCartItemsCount(); 
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartItemsCount();
    }
}

// закриття вікна корзини
closeBtn.addEventListener('click', closeCartPopup);

function closeCartPopup() {
    overlay.style.display = 'none';
    cartPopup.style.display = 'none';

    localStorage.setItem('cart', JSON.stringify(cart));
}


// слайдер
const swiperOne = new Swiper('.feedback__slider', {
    loop: true,

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


const swiperTwo = new Swiper('.certificates__slider', {
    loop: true,

    slidesPerView: "3",
    spaceBetween: 20,

    pagination: {
        el: '.swiper-pagination',
    },
    breakpoints: {
        640: {
            slidesPerView: "3",
        },
        480: {
            slidesPerView: "2",
        },
        360: {
            slidesPerView: "1",
        }
    }
}); 

// акордіон

document.addEventListener('DOMContentLoaded', function () {
    const accordeonItems = document.querySelectorAll('.accordeon__item');
  
    accordeonItems.forEach(function (item) {
      const title = item.querySelector('.accordeon__title');
      const text = item.querySelector('.accordeon__text');
  
      title.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
  
        accordeonItems.forEach(function (otherItem) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.accordeon__text').style.maxHeight = '0';
        });
  
        if (!isOpen) {
          item.classList.add('open');
          text.style.maxHeight = text.scrollHeight + 'px';
        }
      });
    });
  });


// форма

fetch('http://localhost:3000/formData')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    })
    .catch(error => console.error('Помилка отримання даних:', error));

function submitForm(event) {
    event.preventDefault();

    const name = $('#nameInput').val();
    const email = $('#emailInput').val();

    clearErrorMessages();

    if (!name.trim() || !email.trim()) {
        displayErrorMessage('Будь ласка, заповніть всі поля форми.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayErrorMessage('Будь ласка, введіть коректну адресу електронної пошти.');
        return;
    }

    const formData = {
        name: name,
        email: email
    };

    fetch('http://localhost:3000/formData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Дані форми успішно відправлені:', data);
            $('#nameInput').val('');
            $('#emailInput').val('');
        })
        .catch(error => console.error('Помилка відправки даних форми:', error));
}

function displayErrorMessage(message) {
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message');

    const errorContainer = document.querySelector('.error-container');
    errorContainer.appendChild(errorMessageElement);
}

function clearErrorMessages() {
    const errorContainer = document.querySelector('.error-container');
    errorContainer.innerHTML = '';
}