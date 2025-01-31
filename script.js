// Завдання 1: Fetch API - Додавання фото
const gallery = document.getElementById('gallery');
const addPhotoButton = document.getElementById('addPhoto');
// Додаємо обробник події на кнопку
addPhotoButton.addEventListener('click', async function () {
    try {
        // Виконуємо асинхронний запит до API для отримання випадкового фото собаки
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        const img = document.createElement('img');
        img.src = data.message;
        img.alt = 'Dog Photo';
        gallery.appendChild(img);
    } catch (error) {
        console.error('Error fetching dog photo:', error);
    }
});

// Завдання 2: Fullscreen API
const fullscreenButton = document.getElementById('fullscreenButton');// Отримуємо кнопку для включення/виходу з повного екрану
fullscreenButton.addEventListener('click', function () {
    // Перевіряємо, чи ми зараз в повноекранному режимі
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.body.style.backgroundColor = '#222';
    } else {
        document.exitFullscreen();
        document.body.style.backgroundColor = '';
    }
});

document.addEventListener('fullscreenchange', function () {
    fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen View';
});

// Завдання 3: LocalStorage API
// Функція для збереження стану галереї в LocalStorage
function saveGalleryState() {
    // Отримуємо всі зображення з галереї і створюємо масив їх джерел
    const imageSources = Array.from(gallery.querySelectorAll('img')).map(function (img) {
        return img.src;
    });
    // Зберігаємо масив URL зображень в LocalStorage
    localStorage.setItem('dogGallery', JSON.stringify(imageSources));
}

function loadGalleryState() {
    // Читаємо збережені зображення з LocalStorage або порожній масив, якщо нічого не знайдено
    const savedImages = JSON.parse(localStorage.getItem('dogGallery')) || [];
    savedImages.forEach(function (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Dog Photo';
        gallery.appendChild(img);
    });
}

window.addEventListener('beforeunload', saveGalleryState);
window.addEventListener('DOMContentLoaded', loadGalleryState);

// Завдання 4: Visibility API
let timeSpent = 0;
let timerInterval; // Змінна для збереження інтервалу таймера
const timerDiv = document.getElementById('timerDiv');
// Функція для оновлення таймера
function updateTimer() {
    timerDiv.textContent = `Time on page: ${timeSpent} seconds`;
}
// Функція для запуску таймера
function startTimer() {
    timerInterval = setInterval(function () {
        timeSpent++;
        updateTimer();
    }, 1000);
}
// Функція для зупинки таймера
function stopTimer() {
    clearInterval(timerInterval);
}
// Додаємо обробник події на зміну видимості сторінки
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        startTimer();
    } else {
        stopTimer();
    }
});

startTimer();

// Завдання 5: Geolocation API
const locationDiv = document.getElementById('locationDiv');
// Функція для оновлення місцеположення
function updateLocation(latitude, longitude) {
    locationDiv.textContent = `Your Location: Lat ${latitude}, Long ${longitude}`;
}
// Функція для запиту геолокації
function requestGeolocation() {
    if ('geolocation' in navigator) {
        // Якщо геолокація підтримується браузером, запитуємо її
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                updateLocation(latitude, longitude);// Оновлюємо місцеположення на сторінці
            },
            function (error) {
                console.error('Error obtaining location:', error);// Лог помилки, якщо не вдалося отримати місцеположення
                locationDiv.textContent = 'Unable to fetch location';
            }
        );
    } else {
        locationDiv.textContent = 'Geolocation is not supported by your browser';
    }
}

requestGeolocation();