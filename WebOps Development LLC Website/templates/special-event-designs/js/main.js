/**
 * Main Initialization
 */

import { initNavigation } from './navigation.js';
import { initAnimations, initScrollToTop } from './animations.js';
import { initSEO } from './seo.js';
import { validateEmail } from './utils.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Initialize animations
    initAnimations();

    // Initialize scroll to top
    initScrollToTop();

    // Initialize form handling
    initFormHandling();

    // Initialize newsletter form
    initNewsletterForm();

    // Initialize SEO features
    initSEO();
});

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
    
    // Validate email
    if (data.email && !validateEmail(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Here you would typically send data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    e.target.reset();
}

// Newsletter Form Handling
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    // Validate email
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Here you would typically send data to a server
    console.log('Newsletter signup:', email);
    
    // Show success message
    alert('Thank you for subscribing to our newsletter!');
    
    // Reset form
    e.target.reset();
}
