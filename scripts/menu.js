document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const headerMenu = document.querySelector('.header-menu');

  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('open');

    if (menuToggle.classList.contains('open')) {
      // Wait for the cross to become a line before opening the menu
      setTimeout(function () {
        headerMenu.classList.add('open');
      }, 300); // Adjust the duration to match your CSS transition duration
    } else {
      headerMenu.classList.remove('open');
    }
  });

  // Add mouseleave event listener to the header-menu
  headerMenu.addEventListener('mouseleave', function () {
    menuToggle.classList.remove('open');
    headerMenu.classList.remove('open');
  });

  
});
