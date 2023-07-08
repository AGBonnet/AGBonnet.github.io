
const memoryPalaceButton = document.getElementById('memory-palace-button');
const fauneButton = document.getElementById('faune-aux-jumelles-button');
const poemContent = document.getElementById('poem-content');
const banner = document.querySelector('.poetry-buttons');
const timeInterval = 10; // Time interval for checking visibility of lines
let scrolledDown = false; // Add a variable to keep track of scroll direction

function handleScroll() {
  console.log('scrolledDown:', scrolledDown)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  console.log('scrollTop:', scrollTop)
  // Check if the user has scrolled down
  if (scrollTop > 100 && !scrolledDown) {
    banner.classList.add('hidden');
    scrolledDown = true;
    console.log('scrolled down');
  } else if (scrollTop <= 100 && scrolledDown) {
    banner.classList.remove('hidden');
    scrolledDown = false;
    console.log('scrolled up');
  }
}

//window.addEventListener('scroll', handleScroll);
//window.addEventListener('resize', handleScroll);
  
// Fade-in lines

function checkFadeIn() {
console.log('checkFadeIn')
const lines = poemContent.querySelectorAll('.line'); // Target lines within the loaded poem content
lines.forEach(line => {
    const rect = line.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom >= 100;
    if (isVisible) {
    line.classList.add('fade-in');
    } else {
    //line.classList.remove('fade-in');
    }
});
}

function startFadeInTimer() {
console.log('startFadeInTimer')
checkFadeIn();
setInterval(checkFadeIn, timeInterval); 
}

// Trigger the fade-in effect when the page loads
//startFadeInTimer(); 

// Check initial visibility
//checkFadeIn();