/**
 * Main Initialization
 */

import { setTheme } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations, initHeroReveal, initScrollToTop } from './animations.js';
import { initSEO } from './seo.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroReveal();
    initAnimations();
    initScrollToTop();
    initThemeToggle();
    initFormHandling();
    initSEO();
});

function initThemeToggle() {
    setTheme('light');
    localStorage.removeItem('theme');
}

function initFormHandling() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    const newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thanks for subscribing! (Demo only — no email sent.)');
            e.target.reset();
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}
