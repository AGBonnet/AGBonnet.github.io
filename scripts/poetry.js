document.addEventListener('DOMContentLoaded', function () {
const lines = document.querySelectorAll('.line');

function checkFadeIn() {
  lines.forEach((line) => {
    const rect = line.getBoundingClientRect();
    const isVisible =
      rect.top < window.innerHeight - 100 && rect.bottom >= 100; /* Adjust the visibility conditions */

    if (isVisible) {
      line.classList.add('fade-in');
    } else {
      //line.classList.remove('fade-in');
    }
  });
}

function startFadeInTimer() {
  checkFadeIn();
  setInterval(checkFadeIn, 10); // Adjust the interval time as needed
}

window.addEventListener('scroll', startFadeInTimer);
window.addEventListener('resize', startFadeInTimer);

startFadeInTimer(); // Trigger the fade-in effect when the page loads

// Check initial visibility
checkFadeIn();
});