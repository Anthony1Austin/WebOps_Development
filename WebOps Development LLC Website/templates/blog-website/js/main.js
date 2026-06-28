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

// Force dark mode (theme toggle removed)
function initThemeToggle() {
    // Always set to dark mode
    setTheme('dark');
    // Remove any stored light theme preference
    localStorage.removeItem('theme');
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

