/**
 * Scroll Animations and Effects
 */

import { debounce } from './utils.js';

export function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.section, .problem-card, .service-card, .testimonial-card, .case-study, .team-card, .offer-card'
    );
    animatedElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });

    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = debounce(() => {
        if (window.pageYOffset > 24) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

export function initHeroReveal() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
        hero.classList.add('is-revealed');
        return;
    }

    requestAnimationFrame(() => {
        hero.classList.add('is-revealed');
    });
}

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

    window.addEventListener('scroll', handleScroll, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
