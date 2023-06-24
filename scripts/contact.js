document.addEventListener('DOMContentLoaded', function () {

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