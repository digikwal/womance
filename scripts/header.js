document.addEventListener('DOMContentLoaded', () => {
    fetch("/partials/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("header").innerHTML = html;
            // Initialiseer menu.js hier
            const hamburgerMenu = document.querySelector('.hamburger-menu');
            const mobileNav = document.querySelector('.mobile-nav');

            if (!mobileNav.classList.contains('hidden')) {
                mobileNav.classList.add('hidden');
            }

            hamburgerMenu.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
            });
        });
});