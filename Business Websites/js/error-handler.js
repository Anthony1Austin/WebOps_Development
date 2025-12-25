/**
 * Error Handling & User Feedback
 */

// Global Error Handler
export function initErrorHandling() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
        logError('JavaScript Error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
        
        showErrorMessage('Something went wrong. Please refresh the page or contact support if the problem persists.');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logError('Unhandled Promise Rejection', {
            reason: event.reason,
            stack: event.reason?.stack
        });
        
        showErrorMessage('An error occurred. Please try again.');
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
        if (event.target.tagName === 'IMG') {
            handleImageError(event.target);
        } else if (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
            logError('Resource Load Error', {
                tag: event.target.tagName,
                src: event.target.src || event.target.href
            });
        }
    }, true);

    // Initialize error message close button
    const errorCloseBtn = document.getElementById('error-message')?.querySelector('.error-message__close');
    if (errorCloseBtn) {
        errorCloseBtn.addEventListener('click', () => {
            hideErrorMessage();
        });
    }
}

// Show error message to user
export function showErrorMessage(message, duration = 5000) {
    const errorContainer = document.getElementById('error-message');
    const errorText = errorContainer?.querySelector('.error-message__text');
    
    if (errorContainer && errorText) {
        errorText.textContent = message;
        errorContainer.style.display = 'block';
        errorContainer.setAttribute('aria-hidden', 'false');
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                hideErrorMessage();
            }, duration);
        }
    }
}

// Hide error message
export function hideErrorMessage() {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.style.display = 'none';
        errorContainer.setAttribute('aria-hidden', 'true');
    }
}

// Handle image loading errors
function handleImageError(img) {
    // Replace with placeholder
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" dy="10.5" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
    img.alt = 'Image not available';
    img.classList.add('image-error');
}

// Log errors (send to your error tracking service)
function logError(type, details) {
    // Send to error tracking service (e.g., Sentry, LogRocket)
    if (typeof window.trackError === 'function') {
        window.trackError(type, details);
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost') {
        console.error(`[${type}]`, details);
    }
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': `${type}: ${details.message || 'Unknown error'}`,
            'fatal': false
        });
    }
}

// Form validation with error handling
export function validateForm(form) {
    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push({
                field: field.name || field.id,
                message: `${field.labels[0]?.textContent || 'This field'} is required`
            });
            field.classList.add('form__input--error');
        } else {
            field.classList.remove('form__input--error');
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                errors.push({
                    field: field.name || field.id,
                    message: 'Please enter a valid email address'
                });
                field.classList.add('form__input--error');
            }
        }
    });
    
    return errors;
}

