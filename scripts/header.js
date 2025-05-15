document.addEventListener('DOMContentLoaded', () => {
  fetch("/partials/header.html")
    .then(res => res.text())
    .then(html => document.getElementById("header").innerHTML = html);
});