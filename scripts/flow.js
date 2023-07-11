
// ---------------- Variables ---------------- //

const visualFlowDirectory = 'VisualFlow/';
const numImages = 358;        // Adjust the number based on the total number of images in the directory
const maxImages = 20;         // Maximum number of images to be added at the same time
const mouseSensitivity = 20;  // Adjust the threshold for mouse movement sensitivity
const touchSensitivity = 5;   // Adjust the threshold for scrolling sensitivity
const timeDelay = 8;          // Adjust the delay between each image addition
const timeDelayMobile = 4;    // For mobile device
const imageFadeDuration = 100;// Adjust the fade duration as needed (in milliseconds)

const artInspiration = document.querySelector('.art-inspirations');
const title = document.getElementById('title');
const subTitle = document.getElementById('subtitle');
const body = document.body;

// Declare the zoomed container and zoomed image variables
const zoomedContainer = document.getElementById('zoomed-container');
const zoomedSvg = document.getElementById('zoomed-svg');

let imageQueue = []; // Array to store the images
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let zoomedIn = false; // Add a new variable to track zoomed state

let mouseMoving = false;
let lastMouseX = 0;
let lastMouseY = 0;

let touchMoving = false;
let lastTouchX = 0;
let lastTouchY = 0;


const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log('isMobileDevice', isMobileDevice)

// ---------------- Functions ---------------- //

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// -------------- Zooming Functions -------------- //

function enterZoomMode(imageSrc) {
  zoomedIn = true;
  zoomedContainer.style.display = 'flex';
  const image = new Image();
  image.src = imageSrc;
  image.addEventListener('load', () => {

    // Fit image to 80% of the screen, while keeping the aspect ratio
    const imageRatio = image.width / image.height;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenRatio = screenWidth / screenHeight;
    let imageWidth;
    let imageHeight;
    if (imageRatio > screenRatio) {
      imageWidth = screenWidth * 0.8;
      imageHeight = imageWidth / imageRatio;
    }
    else {
      imageHeight = screenHeight * 0.8;
      imageWidth = imageHeight * imageRatio;
    }
    zoomedSvg.setAttribute('width', imageWidth);
    zoomedSvg.setAttribute('height', imageHeight);
    zoomedSvg.setAttribute('viewBox', `0 0 ${image.width} ${image.height}`);
    zoomedSvg.innerHTML = `<image xlink:href="${imageSrc}" width="${image.width}" height="${image.height}" />`;

  });
  body.classList.add('zoom-mode');

  setTimeout(() => {
    zoomedContainer.classList.add('active');
  }, 0);
}

function exitZoomMode() {
  zoomedIn = false;
  body.classList.remove('zoom-mode');
  zoomedContainer.classList.remove('active');
  zoomedContainer.style.display = 'none';
  zoomedSvg.innerHTML = ''; // Clear the SVG content
}


// -------------- Image Functions -------------- //

function fetchAvailableImages() {
  return fetch('images.json')
    .then(response => response.json())
    .then(data => {
      const images = data.images;
      const currentImages = Array.from(artInspiration.querySelectorAll('.added-image'));

      return images.filter(image => {
        const imageSrc = visualFlowDirectory + image;
        return !currentImages.some(currentImage => currentImage.getAttribute('src') === imageSrc);
      });
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}

function addNewImage(randomImage) {

  const newImage = document.createElement('img');
  newImage.src = randomImage;
  newImage.classList.add('added-image');
  newImage.style.objectFit = 'contain';
  newImage.style.position = 'absolute';
  newImage.style.transition = `opacity ${imageFadeDuration / 1000}s ease-in-out`;

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

    if (title.classList.contains('faded-out')) {
      newImage.classList.add('added-image');
      newImage.style.opacity = 0;
      artInspiration.appendChild(newImage);
      setTimeout(() => {
        newImage.style.opacity = 1;
      }, 0);

      newImage.addEventListener('click', () => {
        enterZoomMode(newImage.src);
      });
      
    }
  });
  newImage.addEventListener('error', handleImageError);

  // Add new image to the queue, remove oldest image if queue is full
  imageQueue.push(newImage);
  if (imageQueue.length > maxImages) {
    const removedImage = imageQueue.shift();
    artInspiration.removeChild(removedImage);
  }
}

function handleImageError(event) {
  const errorImage = event.target;
  errorImage.style.opacity = 0;
  setTimeout(() => {
    if (errorImage.parentNode) {
      errorImage.parentNode.removeChild(errorImage);
    }
  }, imageFadeDuration);
}

function getRandomImage() {
  if (!subTitle.classList.contains('clicked')) {return;}

  // Fetch the available images
  fetchAvailableImages().then(availableImages => {
    if (availableImages.length === 0) {
      console.warn('No unique images available.');
      return;
    }

    // Select a random image from the available images
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const randomImage = visualFlowDirectory + availableImages[randomIndex];

    // Add the image to the page
    addNewImage(randomImage);
  });
}

// -------------- Mouse Functions -------------- //

function handleTouchMove(event) {
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  const distance = calculateDistance(lastTouchX, lastTouchY, touchX, touchY);

  if (distance >= touchSensitivity && subTitle.classList.contains('clicked')) {
    lastTouchX = touchX;
    lastTouchY = touchY;

    if (!touchMoving && !zoomedIn) {
      touchMoving = true;
      getRandomImage();
    }
  } else {
    touchMoving = false;
  }
}

function handleTouchStop() {
  if (!title.classList.contains('fade-in')) {
    touchMoving = false;
  }
}

function handleMouseMove(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const distance = calculateDistance(lastMouseX, lastMouseY, mouseX, mouseY);

  if (distance >= mouseSensitivity && subTitle.classList.contains('clicked')) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (!mouseMoving && !zoomedIn) {
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

// -------------- Title Functions -------------- //

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

// ----------------- Event Listeners ----------------- //

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

document.addEventListener('DOMContentLoaded', function () {
  
  if (isMobileDevice) {
    window.addEventListener('touchmove', debounce(handleTouchMove, timeDelayMobile));
    window.addEventListener('touchend', handleTouchStop);
    window.addEventListener('touchcancel', handleTouchStop);
  }
  else {
    window.addEventListener('mousemove', debounce(handleMouseMove, timeDelay));
    window.addEventListener('mouseout', handleMouseStop);
    window.addEventListener('blur', handleMouseStop);
  }
  document.addEventListener('click', (event) => {
    if (zoomedIn && (event.target === zoomedSvg || event.target === zoomedContainer)) {
      exitZoomMode();
    }
  });

  // Click event for subtitle
  subTitle.addEventListener('click', () => {
    subTitle.classList.add('clicked');
    fadeOutTitle();
    setTimeout(() => {
      subTitle.style.opacity = 1;
      getRandomImage(); // Add the first image after the subtitle is clicked
    }, 1000);
  });
});

