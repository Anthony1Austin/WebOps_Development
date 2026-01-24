/**
 * Animation Functionality
 */

import { isPartiallyInViewport } from './utils.js';

export function initAnimations() {
    // Animate service bubbles on load
    animateServiceBubbles();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Initialize before/after gallery modal
    initBeforeAfterModal();
    
    // Initialize service bubble interactions
    initServiceBubbleInteractions();
}

// Animate service bubbles
function animateServiceBubbles() {
    const bubbles = document.querySelectorAll('.service-bubble');
    
    bubbles.forEach((bubble, index) => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0)';
        
        setTimeout(() => {
            bubble.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
        }, index * 150);
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .trust-badge, .before-after-card, .prominent-trust-badge');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(element);
    });
}

// Initialize service bubble interactions
function initServiceBubbleInteractions() {
    const bubbles = document.querySelectorAll('.service-bubble');
    
    bubbles.forEach(bubble => {
        const button = bubble.querySelector('.service-bubble__button');
        
        bubble.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.6)';
            button.style.borderColor = 'var(--color-neptune-gold)';
        });
        
        bubble.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            button.style.borderColor = 'rgba(212, 175, 55, 0.5)';
        });
    });
}

// Initialize before/after gallery modal
function initBeforeAfterModal() {
    const cards = document.querySelectorAll('.before-after-card');
    let currentModal = null;
    
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(index);
        });
    });
    
    function openModal(index) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'before-after-modal';
        
        const card = cards[index];
        const title = card.querySelector('.before-after-card__title').textContent;
        const description = card.querySelector('.before-after-card__description').textContent;
        
        modal.innerHTML = `
            <div class="modal__content">
                <button class="modal__close" aria-label="Close modal">✕</button>
                <div class="before-after-card__image-container">
                    <div class="before-after-card__before">
                        <div class="before-after-card__label before-after-card__label--before">BEFORE</div>
                        <div style="color: var(--color-gray-400);">Before Image</div>
                    </div>
                    <div class="before-after-card__divider"></div>
                    <div class="before-after-card__after">
                        <div class="before-after-card__label before-after-card__label--after">AFTER</div>
                        <div style="color: var(--color-gray-400);">After Image</div>
                    </div>
                </div>
                <div class="modal__body">
                    <h3 class="before-after-card__title">${title}</h3>
                    <p class="before-after-card__description">${description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        currentModal = modal;
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal__close');
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', handleEscape);
        
        function closeModal() {
            if (currentModal) {
                currentModal.remove();
                currentModal = null;
                document.removeEventListener('keydown', handleEscape);
            }
        }
        
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
    }
}
