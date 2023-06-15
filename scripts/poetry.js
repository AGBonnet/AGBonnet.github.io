document.addEventListener('DOMContentLoaded', function () {
  const lines = document.querySelectorAll('.line');

  function updateFadeInOut() {

    lines.forEach((line) => {
      const rect = line.getBoundingClientRect();    // --> size of line and its position relative to the viewport
      const lineCenter = rect.top + rect.height / 2; // --> center of line relative to viewport
      const distFromCenter = Math.abs(window.innerHeight / 2 - lineCenter); // --> distance from center of line to center of viewport
      // Make opacity 1 when line is at center of viewport, and 0 when line is at top or bottom of viewport, with quadratic easing
      const opacity = 1 - Math.pow(distFromCenter / (window.innerHeight / 2), 2);
      
      line.style.opacity = opacity;
    });
  }

  function startFadeInOut() {
    updateFadeInOut();
  }

  window.addEventListener('scroll', startFadeInOut);
  window.addEventListener('resize', startFadeInOut);
});
