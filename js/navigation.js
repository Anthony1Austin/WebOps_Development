/**
 * Navigation Functionality
 */

import { scrollToElement } from './utils.js';
import { templates } from './templates.js';

export function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const navDropdownItems = document.querySelectorAll('.nav__item--dropdown');
    const header = document.getElementById('header');

    // Initialize templates dropdown
    initTemplatesDropdown();

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Handle dropdown menus
    navDropdownItems.forEach(item => {
        const dropdownLink = item.querySelector('.nav__link');
        
        // Desktop: hover to show dropdown
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 968) {
                item.classList.add('active');
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 968) {
                item.classList.remove('active');
            }
        });
        
        // Mobile: click to toggle dropdown (prevent default scroll)
        dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                e.stopPropagation();
                item.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle anchor links (same page)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    
                    // Close all dropdowns
                    navDropdownItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Scroll to section
                    scrollToElement(targetElement, header.offsetHeight);
                    
                    // Update active link
                    updateActiveLink(link);
                }
            } else if (href.startsWith('/') && !href.includes('#')) {
                // Handle page links - close mobile menu and dropdowns
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navDropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });

    // Handle dropdown link clicks
    const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle anchor links (same page)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    
                    // Close all dropdowns
                    navDropdownItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Scroll to section
                    scrollToElement(targetElement, header.offsetHeight);
                    
                    // Update active link
                    const mainLink = document.querySelector(`.nav__link[href="${href}"]`);
                    if (mainLink) {
                        updateActiveLink(mainLink);
                    }
                }
            } else if (href.includes('#')) {
                // Handle page links with anchor (e.g., /services.html#web-design)
                // Let the browser handle navigation, but close menus
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navDropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            } else if (href.startsWith('/')) {
                // Handle page links - close menus
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navDropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });

    // Handle template dropdown item links (delegate event handling)
    document.addEventListener('click', (e) => {
        const templateLink = e.target.closest('.nav__dropdown-template-link');
        if (templateLink) {
            // Template links already have target="_blank", so they'll open in new tab
            // Just close the dropdown
            navDropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Update active link on scroll (only for single-page)
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        window.addEventListener('scroll', updateActiveLinkOnScroll);
    }
    
    // Set active link based on current page
    setActiveLinkForCurrentPage();

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

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

function updateActiveLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function setActiveLinkForCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        // Check if this link matches the current page
        if (href === currentPath || 
            (currentPath === '/' && (href === '/' || href === '/index.html' || href === 'index.html')) ||
            (currentPath.includes('templates') && href.includes('templates')) ||
            (currentPath.includes('portfolio') && href.includes('portfolio')) ||
            (currentPath.includes('services') && href.includes('services')) ||
            (currentPath.includes('about') && href.includes('about')) ||
            (currentPath.includes('contact') && href.includes('contact'))) {
            link.classList.add('active');
        }
    });
}

function initTemplatesDropdown() {
    const templatesDropdown = document.getElementById('templates-dropdown');
    if (!templatesDropdown || !templates) return;

    // Clear existing content
    templatesDropdown.innerHTML = '';

    // Add "View All Templates" link
    const viewAllItem = document.createElement('li');
    viewAllItem.innerHTML = `
        <a href="/templates.html" class="nav__dropdown-link nav__dropdown-link--view-all">
            View All Templates
        </a>
    `;
    templatesDropdown.appendChild(viewAllItem);

    // Add each template as a dropdown item
    templates.forEach(template => {
        const listItem = document.createElement('li');
        listItem.className = 'nav__dropdown-template-item';
        
        // Use the image path from template data
        const imageUrl = template.image || `assets/images/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        
        listItem.innerHTML = `
            <div class="nav__dropdown-template-image">
                <img src="${imageUrl}" alt="${template.name} preview" loading="lazy">
            </div>
            <div class="nav__dropdown-template-content">
                <div class="nav__dropdown-template-name">${template.name}</div>
                <div class="nav__dropdown-template-features">
                    ${template.features.slice(0, 2).map(feature => 
                        `<span class="nav__dropdown-template-feature">${feature}</span>`
                    ).join('')}
                </div>
                <a href="${encodeURI(template.path)}" class="nav__dropdown-template-link" target="_blank" rel="noopener noreferrer">
                    View Template
                </a>
            </div>
        `;
        
        templatesDropdown.appendChild(listItem);
    });
}

