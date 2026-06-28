/**
 * SEO Enhancement Utilities
 */

// Update copyright year automatically
export function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

// Lazy load images with proper alt text
export function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize SEO features
export function initSEO() {
    updateCopyrightYear();
    lazyLoadImages();
}
