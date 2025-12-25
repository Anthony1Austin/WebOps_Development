/**
 * Main Initialization
 */

import { getTheme, setTheme } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations, initScrollToTop } from './animations.js';
import { initSEO } from './seo.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Initialize animations
    initAnimations();

    // Initialize scroll to top
    initScrollToTop();

    // Initialize theme toggle
    initThemeToggle();

    // Initialize form handling
    initFormHandling();

    // Initialize SEO features
    initSEO();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
    
    if (!themeToggle) return;

    // Set initial theme
    const currentTheme = getTheme();
    setTheme(currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle__icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Form Handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send data to a server
    console.log('Form submitted:', data);
    
    // Show success message (you can customize this)
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    e.target.reset();
}

