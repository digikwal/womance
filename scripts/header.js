document.addEventListener('DOMContentLoaded', () => {
    fetch("/partials/header.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("header").innerHTML = html;

            const hamburgerMenu = document.querySelector('.hamburger-menu');
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

            // Zorg dat het mobiele menu standaard verborgen is
            if (!mobileNav.classList.contains('hidden')) {
                mobileNav.classList.add('hidden');
            }

            // Toggle het mobiele menu bij klikken op het hamburger menu
            hamburgerMenu.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                mobileNav.classList.toggle('open');
            });

            // Sluit het mobiele menu bij klikken op een menu-item
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.add('hidden');
                    mobileNav.classList.remove('open');
                });
            });
        });
});