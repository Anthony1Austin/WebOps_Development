/**
 * Performance Monitoring & Optimization
 */

// Performance Metrics Tracking
export function initPerformanceMonitoring() {
    // Only track in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
    }

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                const lcp = lastEntry.renderTime || lastEntry.loadTime;
                
                // Log to analytics
                trackPerformanceMetric('LCP', lcp);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observer not supported');
        }

        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const fid = entry.processingStart - entry.startTime;
                    trackPerformanceMetric('FID', fid);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID observer not supported');
        }

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        try {
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                trackPerformanceMetric('CLS', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS observer not supported');
        }
    }

    // Track Page Load Time
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        trackPerformanceMetric('PageLoad', pageLoadTime);
        trackPerformanceMetric('DOMContentLoaded', domContentLoaded);
    });

    // Track Resource Load Times
    if ('PerformanceObserver' in window) {
        try {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) { // Log slow resources (>1s)
                        console.warn('Slow resource detected:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
            console.warn('Resource observer not supported');
        }
    }
}

// Track performance metrics (integrate with your analytics)
function trackPerformanceMetric(name, value) {
    // Send to Google Analytics or your analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'performance', {
            'event_category': 'Web Vitals',
            'event_label': name,
            'value': Math.round(value),
            'non_interaction': true
        });
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost') {
        console.log(`Performance Metric - ${name}: ${Math.round(value)}ms`);
    }
}

// Lazy Load Images with Intersection Observer
export function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Show skeleton loader
                    const skeleton = img.closest('.skeleton-wrapper');
                    if (skeleton) {
                        skeleton.classList.add('loading');
                    }
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Handle image load
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        if (skeleton) {
                            skeleton.classList.remove('loading');
                            skeleton.classList.add('loaded');
                        }
                    });
                    
                    // Handle image error
                    img.addEventListener('error', () => {
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                        img.alt = 'Image not available';
                        if (skeleton) {
                            skeleton.classList.remove('loading');
                        }
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Debounce function for performance
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Preload critical resources
export function preloadResource(url, as = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
}

// Check if user is on slow connection
export function isSlowConnection() {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            // Check effective type (4G, 3G, 2G, slow-2g)
            const slowConnections = ['slow-2g', '2g', '3g'];
            return slowConnections.includes(connection.effectiveType);
        }
    }
    return false;
}

// Optimize for slow connections
export function optimizeForSlowConnection() {
    if (isSlowConnection()) {
        // Disable animations
        document.documentElement.classList.add('reduced-motion');
        
        // Lazy load non-critical resources
        const nonCriticalScripts = document.querySelectorAll('script[data-lazy]');
        nonCriticalScripts.forEach(script => {
            script.setAttribute('defer', '');
        });
        
        // Reduce image quality
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.dataset.src;
            if (src && !src.includes('quality=')) {
                img.dataset.src = src + (src.includes('?') ? '&' : '?') + 'quality=75';
            }
        });
    }
}

