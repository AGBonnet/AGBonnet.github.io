const overlay = document.querySelector('.overlay');
const gallery = document.querySelector('.gallery-1') || document.querySelector('.gallery-2') || document.querySelector('.gallery-3');
const zoomedImage = document.querySelector('.zoomed-image');
const portfolioTitle = document.querySelector('.portfolio-title-clickable');
const portfolioInfobox = document.querySelector('.portfolio-infobox');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const menu = document.querySelector('.header-menu');
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const imageSources = [];
let currentImageIndex = 0;
const imageContainers = document.querySelectorAll('.image-container');
let touchStartX = 0;
let touchEndX = 0;

/* Sort the image containers so that the links are at the beginning of the array */
if (isMobileDevice) {
    const imageContainerLinks = document.querySelectorAll('.image-container-link');
    const imageContainerLinksArray = Array.from(imageContainerLinks);
    const imageContainersArray = Array.from(imageContainers);
    const sortedImageContainers = imageContainerLinksArray.concat(imageContainersArray);
    sortedImageContainers.forEach(container => {
        gallery.appendChild(container);
    });
}


// Enable zooming mode
function openOverlay(imageIndex) {
    overlay.classList.add('active');
    menu.classList.add('hidden')
    zoomedImage.src = imageSources[imageIndex];
    overlay.style.cursor = 'cursor';
    currentImageIndex = imageIndex;
}

// Disable zooming mode
function closeOverlay() {
    overlay.classList.remove('active');
    menu.classList.remove('hidden')
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

    /* For mobile devices, allow to switch between images during zooming mode by swiping */
    if (isMobileDevice) {
        overlay.addEventListener('touchstart', event => {
            touchStartX = event.changedTouches[0].screenX;
        });
        overlay.addEventListener('touchend', event => {
            touchEndX = event.changedTouches[0].screenX;
            if (touchEndX < touchStartX) {
                currentImageIndex = (currentImageIndex + 1) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            } else if (touchEndX > touchStartX) {
                currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            }
        });
    }

    // Exit zooming mode
    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });
});
