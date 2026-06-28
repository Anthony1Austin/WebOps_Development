/**
 * Conversion Optimization - Exit Intent & Sticky CTA
 */

// Exit-Intent Popup
export function initExitIntent() {
    const exitPopup = document.getElementById('exit-popup');
    const exitPopupClose = document.getElementById('exit-popup-close');
    const exitPopupForm = document.getElementById('exit-popup-form');
    
    if (!exitPopup) return;
    
    // Check if user has already seen the popup (using sessionStorage)
    const hasSeenPopup = sessionStorage.getItem('exitPopupShown');
    
    // Track mouse movement
    let mouseY = 0;
    
    document.addEventListener('mouseout', (e) => {
        if (!e.toElement && !e.relatedTarget && e.clientY < 10) {
            // Mouse is leaving the top of the page
            if (!hasSeenPopup && !exitPopup.classList.contains('active')) {
                exitPopup.classList.add('active');
                sessionStorage.setItem('exitPopupShown', 'true');
            }
        }
    });
    
    // Close button
    if (exitPopupClose) {
        exitPopupClose.addEventListener('click', () => {
            exitPopup.classList.remove('active');
        });
    }
    
    // Close on overlay click
    exitPopup.addEventListener('click', (e) => {
        if (e.target.classList.contains('exit-popup__overlay')) {
            exitPopup.classList.remove('active');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitPopup.classList.contains('active')) {
            exitPopup.classList.remove('active');
        }
    });
    
    // Form submission
    if (exitPopupForm) {
        exitPopupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            console.log('Exit popup form submitted:', data);
            
            // Here you would send to your email service/CRM
            alert('Thank you! Check your email for the download link.');
            
            exitPopup.classList.remove('active');
            exitPopupForm.reset();
        });
    }
}

// Sticky CTA Bar
export function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-cta');
    const stickyCTAClose = document.getElementById('sticky-cta-close');
    
    if (!stickyCTA) return;
    
    // Show sticky CTA on mobile after scrolling
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const windowWidth = window.innerWidth;
        
        // Only show on mobile/tablet
        if (windowWidth <= 968) {
            if (currentScroll > 500 && currentScroll > lastScroll) {
                // Scrolling down
                stickyCTA.classList.add('visible');
            } else if (currentScroll < lastScroll || currentScroll < 100) {
                // Scrolling up or near top
                stickyCTA.classList.remove('visible');
            }
        } else {
            stickyCTA.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
    });
    
    // Close button
    if (stickyCTAClose) {
        stickyCTAClose.addEventListener('click', () => {
            stickyCTA.classList.remove('visible');
            // Remember user closed it for this session
            sessionStorage.setItem('stickyCTAClosed', 'true');
        });
    }
    
    // Check if user previously closed it
    if (sessionStorage.getItem('stickyCTAClosed') === 'true') {
        stickyCTA.classList.remove('visible');
    }
}

// FAQ Accordion Functionality
export function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-item__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-item__icon');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
}

// Resources Tabs Functionality
export function initResourceTabs() {
    const tabs = document.querySelectorAll('.resources__tab');
    const panels = document.querySelectorAll('.resources__panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            const targetPanel = document.getElementById(`${targetTab}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

