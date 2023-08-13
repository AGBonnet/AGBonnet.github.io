document.addEventListener("DOMContentLoaded", function () {
    const imageContainers = document.querySelectorAll('.image-container');
    const overlay = document.querySelector('.overlay');
    const zoomedImage = document.querySelector('.zoomed-image');
    const portfolioTitle = document.querySelector('.portfolio-title');
    const portfolioInfobox = document.querySelector('.portfolio-infobox');

    if (portfolioTitle) {
        portfolioTitle.addEventListener('click', () => {
            portfolioInfobox.classList.toggle('open');
        });
    }

    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    leftArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        zoomedImage.src = imageSources[currentImageIndex];
    });

    rightArrow.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        zoomedImage.src = imageSources[currentImageIndex];
    });

    // Create an array to hold the image sources
    const imageSources = [];

    // Attach click event listeners to each image container
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

    // Function to open the overlay and display the clicked image
    function openOverlay(imageIndex) {
        overlay.classList.add('active');
        zoomedImage.src = imageSources[imageIndex];
        overlay.style.cursor = 'cursor';
        currentImageIndex = imageIndex;
    }

    // Function to close the overlay
    function closeOverlay() {
        overlay.classList.remove('active');
        overlay.style.cursor = 'default';
    }

    let currentImageIndex = 0;

    // Handle arrow key events
    document.addEventListener('keydown', event => {
        if (overlay.classList.contains('active')) {
            if (event.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            } else if (event.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % imageSources.length;
                zoomedImage.src = imageSources[currentImageIndex];
            }
        }
    });

    // Close overlay when clicking outside the zoomed image
    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });
});
