document.addEventListener('DOMContentLoaded', () => {
    fetch("/partials/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("header").innerHTML = html;

            const hamburgerMenu = document.querySelector('.hamburger-menu');
            const mobileNav = document.querySelector('.mobile-nav');

            // Zorg dat het mobiele menu standaard verborgen is
            if (!mobileNav.classList.contains('hidden')) {
                mobileNav.classList.add('hidden');
            }

            // Toggle het mobiele menu bij klikken op het hamburger menu
            hamburgerMenu.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                mobileNav.classList.toggle('open');
            });
        });
});