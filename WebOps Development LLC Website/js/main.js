/**
 * Main Initialization
 */

import { updateCopyrightYear } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations, initScrollToTop } from './animations.js';
import { initTemplates, templates } from './templates.js';
import { initPortfolio } from './portfolio.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set logo link based on environment
    setLogoLink();

    // Initialize navigation
    initNavigation();

    // Initialize animations
    initAnimations();

    // Initialize scroll to top
    initScrollToTop();

    // Update template count dynamically
    updateTemplateCount();

    // Initialize template showcase
    initTemplates();

    // Initialize portfolio showcase
    initPortfolio();

    // Update copyright year
    updateCopyrightYear();

    // Initialize form handling
    initFormHandling();
});

// Set logo link to work in both development and production
function setLogoLink() {
    const logoLink = document.getElementById('logo-link');
    if (!logoLink) return;

    // Check if we're in development (localhost or 127.0.0.1)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';

    if (isDevelopment) {
        // In development, use the current directory's index.html
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        logoLink.href = basePath + 'index.html';
    } else {
        // In production, use root
        logoLink.href = '/';
    }
}

// Update template count in hero section
function updateTemplateCount() {
    const templateCountElement = document.querySelector('.hero__stat-number');
    if (templateCountElement && templates) {
        templateCountElement.textContent = `${templates.length}+`;
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
    
    // Show success message
    alert('Thank you for your message! We will get back to you within 24 hours.');
    
    // Reset form
    e.target.reset();
}

