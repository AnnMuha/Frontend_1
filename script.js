class DogGallery {
    constructor(galleryId, addButtonId) {
        this.gallery = document.getElementById(galleryId);
        this.addPhotoButton = document.getElementById(addButtonId);
        this.init();
    }

    async fetchDogPhoto() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            return data.message;
        } catch (error) {
            console.error('Error fetching dog photo:', error);
            return null;
        }
    }

    addPhotoToGallery(src) {
        if (!src) return;
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Dog Photo';
        img.classList.add('gallery-photo');
        this.gallery.appendChild(img);
        this.saveGalleryState();
    }

    async handleAddPhoto() {
        const photoUrl = await this.fetchDogPhoto();
        this.addPhotoToGallery(photoUrl);
    }

    saveGalleryState() {
        const imageSources = Array.from(this.gallery.querySelectorAll('img')).map(img => img.src);
        localStorage.setItem('dogGallery', JSON.stringify(imageSources));
    }

    loadGalleryState() {
        const savedImages = JSON.parse(localStorage.getItem('dogGallery')) || [];
        savedImages.forEach(src => this.addPhotoToGallery(src));
    }

    init() {
        this.loadGalleryState();
        this.addPhotoButton.addEventListener('click', () => this.handleAddPhoto());
        window.addEventListener('beforeunload', () => this.saveGalleryState());
    }
}

class FullscreenHandler {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        this.init();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            document.body.style.backgroundColor = '#222';
        } else {
            document.exitFullscreen();
            document.body.style.backgroundColor = '';
        }
    }

    updateButtonText() {
        this.button.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen View';
    }

    init() {
        this.button.addEventListener('click', () => this.toggleFullscreen());
        document.addEventListener('fullscreenchange', () => this.updateButtonText());
    }
}

class Timer {
    constructor(timerDivId) {
        this.timeSpent = 0;
        this.timerDiv = document.getElementById(timerDivId);
        this.timerInterval = null;
        this.init();
    }

    updateTimerDisplay() {
        this.timerDiv.textContent = `Time on page: ${this.timeSpent} seconds`;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeSpent++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    init() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        });
        this.startTimer();
    }
}

class GeolocationHandler {
    constructor(locationDivId) {
        this.locationDiv = document.getElementById(locationDivId);
        this.requestGeolocation();
    }

    updateLocation(latitude, longitude) {
        this.locationDiv.textContent = `Your Location: Lat ${latitude}, Long ${longitude}`;
    }

    requestGeolocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.updateLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error obtaining location:', error);
                    this.locationDiv.textContent = 'Unable to fetch location';
                }
            );
        } else {
            this.locationDiv.textContent = 'Geolocation is not supported by your browser';
        }
    }
}

// Ініціалізація всіх компонентів
document.addEventListener('DOMContentLoaded', () => {
    new DogGallery('gallery', 'addPhoto');
    new FullscreenHandler('fullscreenButton');
    new Timer('timerDiv');
    new GeolocationHandler('locationDiv');
});
