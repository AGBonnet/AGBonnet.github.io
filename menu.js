document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerMenu = document.querySelector('.header-menu');

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('open');
        headerMenu.classList.toggle('open');
    });

    const textarea = document.getElementById('message');
    const form = document.querySelector('.contact-form');

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

});