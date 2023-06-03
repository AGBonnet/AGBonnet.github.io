const visualFlowDirectory = 'VisualFlow/';
const numImages = 358; // Adjust the number based on the total number of images in the directory
const maxImages = 20; // Maximum number of images to be added at the same time
const mouseSensitivity = 30; // Adjust the threshold for mouse movement sensitivity
const TimeDelay = 8; // Adjust the delay between each image addition

const artInspiration = document.querySelector('.art-inspirations');
const title = document.getElementById('title');
const subTitle = document.getElementById('subtitle');
const imageContainer = document.getElementById('image-container');
const body = document.body;

let imageQueue = []; // Array to store the images

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let mouseMoving = false;
let lastMouseX = 0;
let lastMouseY = 0;

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function enterZoomMode(imageSrc) {
  const zoomedImage = document.createElement('div');
  zoomedImage.style.backgroundImage = `url('${imageSrc}')`;
  zoomedImage.classList.add('zoomed-image');

  zoomedImage.addEventListener('click', exitZoomMode);

  imageContainer.innerHTML = ''; // Clear the image container
  imageContainer.appendChild(zoomedImage); // Add the zoomed image to the container

  body.classList.add('zoom-mode');
}

function exitZoomMode() {
  imageContainer.innerHTML = ''; // Clear the image container

  body.classList.remove('zoom-mode');

  // Re-add the previous images
  imageQueue.forEach(image => {
    artInspiration.appendChild(image);
  });
}

function getRandomImage() {
  if (!subTitle.classList.contains('clicked')) {
    return; // Return early if the subtitle has not been clicked
  }

  const mouseX = lastMouseX;
  const mouseY = lastMouseY;

  const distance = calculateDistance(lastMouseX, lastMouseY, mouseX, mouseY);

  fetch('images.json')
    .then(response => response.json())
    .then(data => {
      const images = data.images;
      const currentImages = Array.from(artInspiration.querySelectorAll('.added-image')); // Currently displayed images

      const availableImages = images.filter(image => {
        const imageSrc = visualFlowDirectory + image;
        return !currentImages.some(currentImage => currentImage.getAttribute('src') === imageSrc);
      });

      if (availableImages.length === 0) {
        console.warn('No unique images available.');
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const randomImage = visualFlowDirectory + availableImages[randomIndex];

      const newImage = document.createElement('img');
      newImage.src = randomImage;
      newImage.classList.add('added-image');
      newImage.style.objectFit = 'contain';
      newImage.style.position = 'absolute';

      const imagePercentage = Math.random() * 0.2 + 0.2;
      const imageWidth = Math.floor(imagePercentage * screenWidth);
      const imageHeight = Math.floor(imagePercentage * screenHeight);
      const imageRatio = imageWidth / imageHeight;

      const originalImage = new Image();
      originalImage.src = randomImage;

      originalImage.addEventListener('load', () => {
        const originalImageRatio = originalImage.width / originalImage.height;

        if (originalImageRatio > imageRatio) {
          newImage.style.width = imageWidth + 'px';
          newImage.style.height = 'auto';
        } else {
          newImage.style.width = 'auto';
          newImage.style.height = imageHeight + 'px';
        }

        const randomCenterX = Math.random() * (screenWidth - imageWidth / 3) - imageWidth / 6;
        const randomCenterY = Math.random() * (screenHeight - imageHeight / 3) - imageHeight / 6;

        const left = randomCenterX - newImage.clientWidth / 2;
        const top = randomCenterY - newImage.clientHeight / 2;

        newImage.style.left = left + 'px';
        newImage.style.top = top + 'px';

        newImage.addEventListener('click', () => {
          enterZoomMode(newImage.src);
        });

        if (title.classList.contains('faded-out')) {
          artInspiration.appendChild(newImage); // Add the new image to the DOM after the title has faded out
        }
      });

      newImage.addEventListener('error', handleImageError); // Add error event listener

      imageQueue.push(newImage); // Add the new image to the queue

      if (imageQueue.length > maxImages) {
        const removedImage = imageQueue.shift(); // Remove the oldest image from the queue
        artInspiration.removeChild(removedImage); // Remove the image from the DOM
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}

function handleMouseMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const distance = calculateDistance(lastMouseX, lastMouseY, mouseX, mouseY);

  if (distance >= mouseSensitivity && subTitle.classList.contains('clicked')) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (!mouseMoving) {
      mouseMoving = true;
      getRandomImage();
    }
  } else {
    mouseMoving = false;
  }
}

function handleMouseStop() {
  if (!title.classList.contains('fade-in')) {
    mouseMoving = false;
  }
}

function fadeOutTitle() {
  if (subTitle.classList.contains('clicked')) {
    title.classList.remove('fade-in');
    title.classList.add('fade-out');
    // Wait 3 seconds then add faded-out class
    setTimeout(() => {
      title.classList.add('faded-out');
    }, 1000);
  }
}

artInspiration.addEventListener('click', (event) => {
  const clickedImage = event.target.closest('.added-image');
  if (clickedImage) {
    enterZoomMode(clickedImage.src);
  }
});

window.addEventListener('mousemove', debounce(handleMouseMove, TimeDelay));
window.addEventListener('mouseout', handleMouseStop);
window.addEventListener('blur', handleMouseStop);
window.addEventListener('click', (event) => {
  const zoomedContainer = event.target.closest('.zoomed-image');
  if (!zoomedContainer) {
    exitZoomMode();
  }
}); // Add click event listener to the body to exit zoom mode when clicked outside the image

subTitle.addEventListener('click', () => {
  subTitle.classList.add('clicked');
  fadeOutTitle();

  setTimeout(() => {
    subTitle.style.opacity = 1;
    getRandomImage(); // Add the first image after the subtitle is clicked
  }, 1000);
});

function handleImageError(event) {
  const errorImage = event.target;
  if (errorImage.parentNode) {
    errorImage.parentNode.removeChild(errorImage); // Remove the image from the DOM if it fails to load
  }
}

// Debounce function to limit the frequency of event handling
function debounce(callback, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

// Add click event listeners to existing images
function addClickEventListenersToImages() {
  const existingImages = Array.from(artInspiration.querySelectorAll('.added-image'));
  existingImages.forEach(image => {
    image.addEventListener('click', () => {
      enterZoomMode(image.src);
    });
  });
}

addClickEventListenersToImages();
