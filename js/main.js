/**
 * Main Initialization
 */

import { updateCopyrightYear } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations, initScrollToTop } from './animations.js';
import { initTemplates, templates } from './templates.js';
import { initPortfolio } from './portfolio.js';
import { getAvailableTimeSlots, formatTime } from './calendar.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set logo link based on environment
    setLogoLink();
    
    // Set legal links based on environment
    setLegalLinks();

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

    // Initialize calendar
    initCalendar();

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

// Set privacy and terms links to work in both development and production
function setLegalLinks() {
    // Check if we're in development (localhost or 127.0.0.1)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';

    // Find all privacy and terms links
    const privacyLinks = document.querySelectorAll('a[href="/privacy"]');
    const termsLinks = document.querySelectorAll('a[href="/terms"]');

    if (isDevelopment) {
        // In development (Live Server), use .html extension
        privacyLinks.forEach(link => {
            link.href = '/privacy.html';
        });
        termsLinks.forEach(link => {
            link.href = '/terms.html';
        });
    } else {
        // In production (Vercel), use clean URLs (no .html)
        privacyLinks.forEach(link => {
            link.href = '/privacy';
        });
        termsLinks.forEach(link => {
            link.href = '/terms';
        });
    }
}

// Update template count in hero section
function updateTemplateCount() {
    const templateCountElement = document.getElementById('template-count');
    if (templateCountElement && templates) {
        templateCountElement.textContent = templates.length;
    }
}

// Calendar Initialization
function initCalendar() {
    const dateInput = document.getElementById('appointment-date');
    const timeSelect = document.getElementById('appointment-time');
    
    if (!dateInput || !timeSelect) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Set maximum date
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    // Update time slots when date changes
    dateInput.addEventListener('change', async (e) => {
        const selectedDate = new Date(e.target.value);
        
        // Check if it's a weekend
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const isWeekendDay = dayName === 'saturday' || dayName === 'sunday';
        
        // Show loading state
        timeSelect.innerHTML = '<option value="">Loading available times...</option>';
        timeSelect.disabled = true;
        
        if (isWeekendDay) {
            // Weekend - show special message
            timeSelect.innerHTML = '';
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Please send a message requesting this day';
            timeSelect.appendChild(option);
            timeSelect.disabled = false; // Allow selection but it's just a message
        } else {
            const slots = await getAvailableTimeSlots(selectedDate);
            
            timeSelect.innerHTML = '';
            
            if (slots.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No available times for this date';
                timeSelect.appendChild(option);
                timeSelect.disabled = true;
            } else {
                slots.forEach(slot => {
                    const option = document.createElement('option');
                    option.value = slot;
                    option.textContent = formatTime(slot);
                    timeSelect.appendChild(option);
                });
                timeSelect.disabled = false;
            }
        }
    });
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
    
    // Validate email format
    const emailInput = form.querySelector('#email');
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(emailValue)) {
        showFormMessage('error', 'Please enter a valid email address.');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        emailInput.focus();
        return;
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
        showFormMessage('success', 'Thank you for your message! We\'ve sent a confirmation email with your appointment details. We will contact you to confirm the appointment time.');
        
        // Reset form
        form.reset();
        
        // Reset calendar
        const dateInput = document.getElementById('appointment-date');
        const timeSelect = document.getElementById('appointment-time');
        if (dateInput) dateInput.value = '';
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="">Select a date first</option>';
            timeSelect.disabled = false;
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly at info@webopsdevelopment.com');
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

