document.addEventListener('DOMContentLoaded', function () {
  const memoryPalaceButton = document.getElementById('memory-palace-button');
  const fauneButton = document.getElementById('faune-aux-jumelles-button');
  const poemContent = document.getElementById('poem-content');
  const banner = document.querySelector('.poetry-buttons');

  memoryPalaceButton.classList.add('active'); // Add the 'active' class to the memoryPalaceButton
  loadPoemContent('poems/palace.html'); // Load the 'Memory Palace' poem by default

  memoryPalaceButton.addEventListener('click', () => {
    loadPoemContent('poems/palace.html');
    memoryPalaceButton.classList.add('active');
    fauneButton.classList.remove('active');
  });

  fauneButton.addEventListener('click', () => {
    loadPoemContent('poems/faune.html');
    fauneButton.classList.add('active');
    memoryPalaceButton.classList.remove('active');
  });

  function loadPoemContent(url) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        poemContent.innerHTML = data;
        startFadeInTimer();
      })
      .catch(error => {
        console.error('Error loading poem content:', error);
      });
  }

  function checkFadeIn() {
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
    checkFadeIn();
    setInterval(checkFadeIn, 10); // Adjust the interval time as needed
  }

  startFadeInTimer(); // Trigger the fade-in effect when the page loads

  // Check initial visibility
  checkFadeIn();

  function handleScroll() {
    console.log('scroll')
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Check if the user has scrolled down
    if (scrollTop > 0) {
      banner.style.display = 'none';
      scrolledDown = true;
    } else if (scrollTop === 0) {
      banner.style.display = 'flex';
      scrolledDown = false;
    }
  }

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);

});
