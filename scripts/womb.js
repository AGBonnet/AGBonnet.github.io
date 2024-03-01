
// ---------------- DOM Elements ---------------- //

const body = document.body;
const artInspiration = document.querySelector('.art-inspirations');
const title = document.getElementById('title');
const subTitle = document.getElementById('subtitle');
const zoomedContainer = document.getElementById('zoomed-container');
const zoomedSvg = document.getElementById('zoomed-svg');
const headerMenu = document.querySelector('.header-menu');
let headerMenuHidden = false;
let buttonClicked = false;

// ---------------- Constants ---------------- //

const dir = '/portfolio/womb/';
const maxImages = 29;         // Number of images in directory
const randomOrder = Array.from({ length: maxImages }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
let idx = 0;
const timeDelay = 8;          // Adjust the delay between each image addition
const imageFadeDuration = 100;// Adjust the fade duration as needed (in milliseconds)
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const headerThreshold = 120;  // Adjust the threshold for header menu visibility


// -------------- Image Functions -------------- //

function loadImage() {
  index = randomOrder[idx];
  const newImage = new Image();
  newImage.src = dir + 'womb' + index + '.png';
  newImage.classList.add('fade-in');
  newImage.style.opacity = 0;
  newImage.style.width = '80%';
  newImage.style.height = 'auto';
  newImage.style.position = 'absolute';
  artInspiration.appendChild(newImage);
  setTimeout(() => {
    newImage.style.opacity = 1;
  }, 100);
  if (artInspiration.children.length > 1) {
    const oldImage = artInspiration.children[0];
    oldImage.style.opacity = 0;
    setTimeout(() => {
      artInspiration.removeChild(oldImage);
    }, imageFadeDuration);
  }
}

function nextImage() {
  idx = (idx + 1) % maxImages;
  loadImage();
}

function prevImage() {
  idx = (idx - 1 + maxImages) % maxImages;
  loadImage();
}

// ---------------- Header Menu Functions ---------------- //

function hideHeaderMenu() {
  headerMenu.classList.add('hidden');
  headerMenuHidden = true;
}
function showHeaderMenu() {
  headerMenu.classList.remove('hidden');
  headerMenuHidden = false;
}

// -------------- Title Functions -------------- //

function fadeOutTitle() {
  if (subTitle.classList.contains('clicked')) {
    if (!isMobileDevice) {
      hideHeaderMenu();
    }
    title.classList.remove('fade-in');
    title.classList.add('fade-out');
    setTimeout(() => {
      title.classList.add('faded-out');
    }, 1000);
  }
}

function handleMouseMove(event) {
  const mouseY = event.clientY;
  if (buttonClicked) {
    if (mouseY <= headerThreshold && headerMenuHidden) {
      showHeaderMenu();
    } else if (mouseY > headerThreshold && !headerMenuHidden) {
      hideHeaderMenu();
    }
  }
}

function handleMouseStop() {
  if (!title.classList.contains('fade-in')) {
    mouseMoving = false;
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
  showHeaderMenu();

  if (!isMobileDevice) {
    window.addEventListener('mousemove', debounce(handleMouseMove, timeDelay));
    window.addEventListener('mouseout', handleMouseStop);
    window.addEventListener('blur', handleMouseStop);
  }

  /* Listen to click on artInspiration to change the image */
  artInspiration.addEventListener('click', () => {
    if (buttonClicked) {
      nextImage();
    }
  });

  /* Listen to horizontal scroll to change the image. Make the image move laterally and disappear */
  artInspiration.addEventListener('wheel', (event) => {
    if (buttonClicked) {
      if (event.deltaY > 0) {
        nextImage();
      }
      else if (event.deltaY < 0) {
        prevImage();
      }
      else if (event.deltaX > 0) {
        nextImage();
      }
      else if (event.deltaX < 0) {
        prevImage();
      }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (buttonClicked) {
      if (event.key === 'ArrowRight') {
        nextImage();
      }
      else if (event.key === 'ArrowLeft') {
        prevImage();
      }
      else if (event.key === 'ArrowUp') {
        nextImage();
      }
      else if (event.key === 'ArrowDown') {
        prevImage();
    }
  }
  })

  subTitle.addEventListener('click', () => {
    buttonClicked = true;
    if (!isMobileDevice) {
      hideHeaderMenu();
    }
    subTitle.classList.add('clicked');
    fadeOutTitle();
    setTimeout(() => {
      subTitle.style.opacity = 1;
      loadImage(); // Add the first image after the subtitle is clicked
    }, 1000);
  });
});

