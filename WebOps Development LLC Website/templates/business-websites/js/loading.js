/**
 * Loading State Management
 */

export function initLoadingState() {
    const pageLoader = document.getElementById('page-loader');
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        if (pageLoader) {
            pageLoader.classList.add('page-loader--hidden');
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 300);
        }
    });
    
    // Show loader for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.textContent;
                submitButton.dataset.originalText = originalText;
                submitButton.textContent = 'Submitting...';
                
                // Re-enable after 5 seconds as fallback
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Submit';
                }, 5000);
            }
        });
    });
}

