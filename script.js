const visualFlowDirectory = 'VisualFlow/';
const numImages = 358; // Adjust the number based on the total number of images in the directory
const maxImages = 20; // Maximum number of images to be added at the same time
const mouseSensitivity = 20; // Adjust the threshold for mouse movement sensitivity
const TimeDelay = 8; // Adjust the delay between each image addition

const artInspiration = document.querySelector('.art-inspirations');
let imageQueue = []; // Array to store the images

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

let mouseMoving = false;
let lastMouseX = 0;
let lastMouseY = 0;

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function getRandomImage() {
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

      const imagePercentage = Math.random() * 20 + 20;
      const imageWidth = Math.floor(screenWidth * (imagePercentage / 100));
      const imageHeight = Math.floor(screenHeight * (imagePercentage / 100));
      const imageRatio = imageWidth / imageHeight;

      const originalImage = new Image();
      originalImage.src = randomImage;

      originalImage.addEventListener('load', () => {
        const originalImageWidth = originalImage.width;
        const originalImageHeight = originalImage.height;
        const originalImageRatio = originalImageWidth / originalImageHeight;

        if (originalImageRatio > imageRatio) {
          newImage.style.width = imageWidth + 'px';
          newImage.style.height = 'auto';
        } else {
          newImage.style.width = 'auto';
          newImage.style.height = imageHeight + 'px';
        }

        const randomCenterX = Math.floor(Math.random() * screenWidth);
        const randomCenterY = Math.floor(Math.random() * screenHeight);

        const left = randomCenterX - newImage.clientWidth / 2;
        const top = randomCenterY - newImage.clientHeight / 2;

        newImage.style.left = left + 'px';
        newImage.style.top = top + 'px';
      });

      imageQueue.push(newImage); // Add the new image to the queue

      if (imageQueue.length > maxImages) {
        const removedImage = imageQueue.shift(); // Remove the oldest image from the queue
        artInspiration.removeChild(removedImage); // Remove the image from the DOM
      }

      artInspiration.appendChild(newImage);
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}

function handleMouseMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (!mouseMoving) {
    mouseMoving = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    getRandomImage();
  } else {
    const distance = calculateDistance(lastMouseX, lastMouseY, mouseX, mouseY);
    if (distance >= mouseSensitivity) { // Adjust the threshold for mouse movement sensitivity
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      getRandomImage();
    }
  }
}

function handleMouseStop() {
  mouseMoving = false;
}

window.addEventListener('mousemove', debounce(handleMouseMove, TimeDelay));
window.addEventListener('mouseout', handleMouseStop);
window.addEventListener('blur', handleMouseStop);

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
