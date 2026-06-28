/**
 * Navigation Functionality
 */

import { scrollToElement } from './utils.js';

export function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.querySelector('.header');

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const spans = navToggle.querySelectorAll('span');
            if (spans.length === 3) {
                navToggle.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                    if (navToggle) {
                        navToggle.classList.remove('active');
                    }
                    
                    // Scroll to section
                    const headerHeight = header ? header.offsetHeight : 80;
                    scrollToElement(targetElement, headerHeight);
                    
                    // Update active link
                    updateActiveLink(link);
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', throttle(updateActiveLinkOnScroll, 100));
}

// Update active navigation link based on scroll position
function updateActiveLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 80;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active link
function updateActiveLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
