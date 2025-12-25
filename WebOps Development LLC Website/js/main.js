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

