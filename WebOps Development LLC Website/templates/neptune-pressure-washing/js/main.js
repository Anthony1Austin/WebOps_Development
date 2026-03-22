/**
 * Main Initialization
 */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();

    // Initialize animations
    initAnimations();
    
    // Initialize review ticker if needed
    initReviewTicker();
});

// Initialize review ticker (optional - can be populated with actual reviews)
function initReviewTicker() {
    const reviewTicker = document.getElementById('review-ticker');
    const marquee = document.getElementById('marquee');
    
    const reviews = [
        '"Our concrete looks brand new again. Thomas is great to work with!" — Karen T.',
        '"Neptune did a fantastic job on my house—I would definitely recommend!" — Marilyn P.',
        '"Very professional & meticulous. My house looks like I had it painted!" — Mary F.'
    ];
    
    // Only show ticker if we have reviews
    if (reviews.length > 0 && marquee) {
        // Duplicate reviews for seamless loop
        const duplicatedReviews = [...reviews, ...reviews];
        
        duplicatedReviews.forEach(review => {
            const span = document.createElement('span');
            span.className = 'marquee-item';
            span.textContent = review;
            marquee.appendChild(span);
        });
        
        // Show the ticker
        reviewTicker.style.display = 'block';
        
        // Adjust header position
        const header = document.getElementById('header');
        if (header) {
            header.style.top = '36px';
        }
    }
}
