/**
 * Main Initialization
 */

import { getTheme, setTheme } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations, initScrollToTop } from './animations.js';
import { initSEO } from './seo.js';
import { initPerformanceMonitoring, initLazyLoading, optimizeForSlowConnection } from './performance.js';
import { initErrorHandling } from './error-handler.js';
import { initLoadingState } from './loading.js';
import { initExitIntent, initStickyCTA, initFAQ, initResourceTabs } from './conversion.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading state
    initLoadingState();
    
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
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Optimize for slow connections
    optimizeForSlowConnection();
    
    // Initialize error handling
    initErrorHandling();
    
    // Initialize conversion features
    initExitIntent();
    initStickyCTA();
    initFAQ();
    initResourceTabs();
    
    // Register service worker (if available)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        });
    }
});

// Force light mode (theme toggle removed)
function initThemeToggle() {
    // Always set to light mode
    setTheme('light');
    // Remove any stored dark theme preference
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

