'use strict';

const switcher = document.querySelector('.btn-switch');

switcher.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    const className = document.body.className;
    if (className == "light-theme") {
        this.textContent = "Dark Theme";
    } else {
        this.textContent = "Light Theme";
    }
});