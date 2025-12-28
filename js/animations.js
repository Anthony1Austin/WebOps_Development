/**
 * Scroll Animations and Effects
 */

import { debounce } from './utils.js';

export function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('.section, .template-card, .service-card, .process__step');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Scroll to top button visibility
export function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) return;

    const handleScroll = debounce(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

