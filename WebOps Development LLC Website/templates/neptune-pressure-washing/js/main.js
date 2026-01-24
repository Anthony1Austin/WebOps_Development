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
    
    // Example reviews - replace with actual reviews from your data source
    const reviews = [
        '"Excellent service! My house looks brand new!" — John D.',
        '"Professional, reliable, and affordable. Highly recommend!" — Sarah M.',
        '"Best pressure washing service in Massillon!" — Mike T.'
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
