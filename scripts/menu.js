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
  
    // Check if the contact form is present on the page
    const form = document.querySelector('.contact-form');
    if (form) {
      const textarea = document.getElementById('message');
  
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (textarea.value.trim() !== '') {
          alert('Message sent!');
          textarea.value = '';
        }
      });
  
      textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          form.submit();
        }
      });
    }
  });
  