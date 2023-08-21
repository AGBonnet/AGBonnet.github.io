const imageContainers = document.querySelectorAll('.image-container');
const overlay = document.querySelector('.overlay');
const gallery = document.querySelector('.gallery');
const zoomedImage = document.querySelector('.zoomed-image');
const portfolioTitle = document.querySelector('.portfolio-title-clickable');
const portfolioInfobox = document.querySelector('.portfolio-infobox');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const imageSources = [];
let currentImageIndex = 0;

// Enable zooming mode
function openOverlay(imageIndex) {
    overlay.classList.add('active');
    zoomedImage.src = imageSources[imageIndex];
    overlay.style.cursor = 'cursor';
    currentImageIndex = imageIndex;
}

// Disable zooming mode
function closeOverlay() {
    overlay.classList.remove('active');
    overlay.style.cursor = 'default';
}

document.addEventListener("DOMContentLoaded", function () {

    // Reveal excerpt
    if (portfolioTitle && portfolioInfobox) {
        portfolioTitle.addEventListener('click', () => {
            portfolioInfobox.classList.toggle('open');
        });
    }
    
    // Zooming mode
    imageContainers.forEach(container => {
        const images = container.querySelectorAll('img');

        // Populate the imageSources array with image URLs
        images.forEach(image => {
            imageSources.push(image.getAttribute('src'));
        });

        // Handle image click to open overlay
        container.addEventListener('click', event => {
            const clickedImage = event.target.closest('img');
            if (clickedImage) {
                const clickedImageIndex = imageSources.indexOf(clickedImage.getAttribute('src'));
                openOverlay(clickedImageIndex);
            }
        });
    });

    // Zooming mode: switching between images
    leftArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        zoomedImage.src = imageSources[currentImageIndex];
    });
    rightArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        zoomedImage.src = imageSources[currentImageIndex];
    });

    // Zooming mode: switching with keyboard arrows
    document.addEventListener('keydown', event => {
        if (overlay.classList.contains('active')) {
            /* Down arrow moves to the next image in the gallery, up arrow moves to the previous image */
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                currentImageIndex = (currentImageIndex + 1) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            }
        }
    });

    // Exit zooming mode
    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });
});
