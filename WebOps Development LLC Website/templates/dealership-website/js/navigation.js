/**
 * Navigation Functionality
 */

import { scrollToElement } from './utils.js';

export function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    
                    // Scroll to section
                    scrollToElement(targetElement, header.offsetHeight);
                    
                    // Update active link
                    updateActiveLink(link);
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLinkOnScroll);
    
    // Initialize dropdown menus
    initDropdowns();
}

// Initialize dropdown menus
function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav__link');
        const dropdown = item.querySelector('.nav__dropdown');
        
        if (link && dropdown) {
            // Handle click on mobile
            if (window.innerWidth <= 768) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
            
            // Handle hover on desktop
            if (window.innerWidth > 768) {
                item.addEventListener('mouseenter', () => {
                    dropdown.classList.add('active');
                });
                item.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
    
    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-initialize dropdowns on resize
            initDropdowns();
        }, 250);
    });
}

// Update active navigation link based on scroll position
function updateActiveLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const headerHeight = document.getElementById('header').offsetHeight;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
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

