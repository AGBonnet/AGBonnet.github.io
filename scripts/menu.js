const headerMenu = document.querySelector('.header-menu');
const mobileMenuButton = document.querySelector('.mobile-menu-button');

function toggleMenu() {
    headerMenu.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", function () {
    mobileMenuButton.addEventListener('click', toggleMenu);
});
