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

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.form__message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Send to API endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to send message');
        }
        
        // Show success message
        showFormMessage('success', 'Thank you for your message! We will get back to you within 24 hours.');
        
        // Reset form
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly at info@webopsdev.com');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

function showFormMessage(type, message) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form__message form__message--${type}`;
    messageEl.textContent = message;
    
    // Insert before submit button
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    form.insertBefore(messageEl, submitButton);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

