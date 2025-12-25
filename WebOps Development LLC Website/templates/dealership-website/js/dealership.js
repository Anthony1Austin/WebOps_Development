/**
 * Dealership-Specific Functionality
 */

// Advanced Search & Filtering
export function initInventoryFilters() {
    const filters = document.querySelectorAll('.filter-checkbox, .filter-radio');
    const clearBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-by');
    
    // Filter change handler
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
            updateInventoryCount();
        });
    });
    
    // Clear filters
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filters.forEach(filter => {
                filter.checked = false;
            });
            applyFilters();
            updateInventoryCount();
        });
    }
    
    // Sort handler
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortInventory(sortSelect.value);
        });
    }
}

function applyFilters() {
    // Get all active filters
    const activeFilters = {
        type: Array.from(document.querySelectorAll('input[name="type"]:checked')).map(f => f.value),
        price: document.querySelector('input[name="price"]:checked')?.value,
        make: Array.from(document.querySelectorAll('input[name="make"]:checked')).map(f => f.value),
        body: Array.from(document.querySelectorAll('input[name="body"]:checked')).map(f => f.value),
        mileage: document.querySelector('input[name="mileage"]:checked')?.value,
        features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(f => f.value)
    };
    
    // Filter vehicle cards (in real implementation, this would filter actual data)
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    let visibleCount = 0;
    
    vehicleCards.forEach(card => {
        let show = true;
        
        // Apply type filter
        if (activeFilters.type.length > 0) {
            const cardType = card.querySelector('.vehicle-card__badge')?.textContent.toLowerCase();
            const hasType = activeFilters.type.some(type => {
                if (type === 'new') return cardType === 'new';
                if (type === 'used') return cardType === 'pre-owned';
                if (type === 'certified') return cardType === 'certified';
                return false;
            });
            if (!hasType) show = false;
        }
        
        // Apply price filter (simplified - would need actual price data)
        if (activeFilters.price) {
            // Price filtering logic would go here
        }
        
        // Apply make filter (simplified - would need actual make data)
        if (activeFilters.make.length > 0) {
            // Make filtering logic would go here
        }
        
        if (show) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    return visibleCount;
}

function updateInventoryCount() {
    const count = applyFilters();
    const countElement = document.getElementById('inventory-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function sortInventory(sortBy) {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.vehicle-card'));
    
    cards.sort((a, b) => {
        let aValue, bValue;
        
        switch(sortBy) {
            case 'price-low':
                aValue = parsePrice(a.querySelector('.vehicle-card__price-amount')?.textContent);
                bValue = parsePrice(b.querySelector('.vehicle-card__price-amount')?.textContent);
                return aValue - bValue;
                
            case 'price-high':
                aValue = parsePrice(a.querySelector('.vehicle-card__price-amount')?.textContent);
                bValue = parsePrice(b.querySelector('.vehicle-card__price-amount')?.textContent);
                return bValue - aValue;
                
            case 'year-new':
                aValue = parseInt(a.querySelector('.vehicle-card__title')?.textContent.match(/\d{4}/)?.[0] || 0);
                bValue = parseInt(b.querySelector('.vehicle-card__title')?.textContent.match(/\d{4}/)?.[0] || 0);
                return bValue - aValue;
                
            case 'year-old':
                aValue = parseInt(a.querySelector('.vehicle-card__title')?.textContent.match(/\d{4}/)?.[0] || 0);
                bValue = parseInt(b.querySelector('.vehicle-card__title')?.textContent.match(/\d{4}/)?.[0] || 0);
                return aValue - bValue;
                
            case 'mileage-low':
                aValue = parseMileage(a.querySelector('.vehicle-card__spec')?.textContent);
                bValue = parseMileage(b.querySelector('.vehicle-card__spec')?.textContent);
                return aValue - bValue;
                
            case 'mileage-high':
                aValue = parseMileage(a.querySelector('.vehicle-card__spec')?.textContent);
                bValue = parseMileage(b.querySelector('.vehicle-card__spec')?.textContent);
                return bValue - aValue;
                
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
}

function parsePrice(priceText) {
    if (!priceText) return 0;
    return parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
}

function parseMileage(mileageText) {
    if (!mileageText) return 0;
    const match = mileageText.match(/([\d,]+)\s*mi/i);
    if (match) {
        return parseInt(match[1].replace(/,/g, '')) || 0;
    }
    return 0;
}

// View Toggle (Grid/List)
export function initViewToggle() {
    const toggles = document.querySelectorAll('.view-toggle');
    const grid = document.getElementById('inventory-grid');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const view = toggle.dataset.view;
            
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            if (grid) {
                grid.className = `inventory__grid inventory__grid--${view}`;
            }
        });
    });
}

// Payment Calculator
export function initPaymentCalculator() {
    const calculator = document.getElementById('payment-calculator');
    if (!calculator) return;
    
    const inputs = calculator.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', calculatePayment);
        input.addEventListener('change', calculatePayment);
    });
    
    // Sync sliders with inputs
    const downSlider = document.getElementById('calc-down-slider');
    const downInput = document.getElementById('calc-down');
    const rateSlider = document.getElementById('calc-rate-slider');
    const rateInput = document.getElementById('calc-rate');
    
    if (downSlider && downInput) {
        downSlider.addEventListener('input', (e) => {
            downInput.value = e.target.value;
            calculatePayment();
        });
        downInput.addEventListener('input', (e) => {
            downSlider.value = e.target.value;
            calculatePayment();
        });
    }
    
    if (rateSlider && rateInput) {
        rateSlider.addEventListener('input', (e) => {
            rateInput.value = e.target.value;
            calculatePayment();
        });
        rateInput.addEventListener('input', (e) => {
            rateSlider.value = e.target.value;
            calculatePayment();
        });
    }
    
    // Initialize calculation
    calculatePayment();
}

function calculatePayment() {
    const price = parseFloat(document.getElementById('calc-price')?.value) || 0;
    const down = parseFloat(document.getElementById('calc-down')?.value) || 0;
    const trade = parseFloat(document.getElementById('calc-trade')?.value) || 0;
    const term = parseInt(document.getElementById('calc-term')?.value) || 60;
    const rate = parseFloat(document.getElementById('calc-rate')?.value) || 4.9;
    
    const loanAmount = Math.max(0, price - down - trade);
    const monthlyRate = (rate / 100) / 12;
    const numPayments = term;
    
    let monthlyPayment = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else if (loanAmount > 0) {
        monthlyPayment = loanAmount / numPayments;
    }
    
    const totalInterest = Math.max(0, (monthlyPayment * numPayments) - loanAmount);
    const totalCost = monthlyPayment * numPayments;
    
    // Update display
    const paymentEl = document.getElementById('calc-payment');
    const loanEl = document.getElementById('calc-loan');
    const interestEl = document.getElementById('calc-interest');
    const totalEl = document.getElementById('calc-total');
    
    if (paymentEl) paymentEl.textContent = `$${Math.round(monthlyPayment).toLocaleString()}`;
    if (loanEl) loanEl.textContent = `$${Math.round(loanAmount).toLocaleString()}`;
    if (interestEl) interestEl.textContent = `$${Math.round(totalInterest).toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${Math.round(totalCost).toLocaleString()}`;
}

// Vehicle Gallery
export function initVehicleGallery() {
    const thumbs = document.querySelectorAll('.vehicle-gallery__thumb');
    const mainImg = document.getElementById('gallery-main');
    
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            const img = thumb.querySelector('img');
            if (mainImg && img) {
                // Replace thumbnail size with full size
                mainImg.src = img.src.replace('150x100', '800x500');
                
                // Update active thumb
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        });
    });
}

// Lead Form Modals
export function initLeadModals() {
    // Test Drive Modal
    const testDriveBtns = document.querySelectorAll('a[href="#test-drive"]');
    const testDriveModal = document.getElementById('test-drive-modal');
    const testDriveForm = document.getElementById('test-drive-form');
    
    testDriveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (testDriveModal) {
                testDriveModal.style.display = 'flex';
                const vehicle = btn.closest('.vehicle-card')?.querySelector('.vehicle-card__title')?.textContent.trim();
                if (vehicle && document.getElementById('test-drive-vehicle')) {
                    document.getElementById('test-drive-vehicle').value = vehicle;
                }
            }
        });
    });
    
    if (testDriveForm) {
        testDriveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log('Test drive request:', data);
            alert('Thank you! We\'ll contact you shortly to confirm your test drive appointment.');
            testDriveModal.style.display = 'none';
            testDriveForm.reset();
        });
    }
    
    // Quote Modal
    const quoteBtns = document.querySelectorAll('a[href="#get-quote"]');
    const quoteModal = document.getElementById('quote-modal');
    const quoteForm = document.getElementById('quote-form');
    
    quoteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (quoteModal) {
                quoteModal.style.display = 'flex';
                const vehicle = btn.closest('.vehicle-card')?.querySelector('.vehicle-card__title')?.textContent.trim();
                if (vehicle && document.getElementById('quote-vehicle')) {
                    document.getElementById('quote-vehicle').value = vehicle;
                }
            }
        });
    });
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log('Quote request:', data);
            alert('Thank you! We\'ll send you our best price within 24 hours.');
            quoteModal.style.display = 'none';
            quoteForm.reset();
        });
    }
    
    // Financing Modal
    const financingBtns = document.querySelectorAll('a[href="#financing"], a[href="#apply-financing"]');
    const financingModal = document.getElementById('financing-modal');
    const financingForm = document.getElementById('financing-form');
    
    financingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (financingModal) {
                financingModal.style.display = 'flex';
            }
        });
    });
    
    if (financingForm) {
        financingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log('Financing application:', data);
            alert('Thank you! Your application has been submitted. We\'ll contact you within 24 hours.');
            financingModal.style.display = 'none';
            financingForm.reset();
        });
    }
    
    // Close modals
    document.querySelectorAll('.lead-modal__close, .lead-modal__overlay').forEach(close => {
        close.addEventListener('click', (e) => {
            if (e.target === close || e.target.classList.contains('lead-modal__overlay')) {
                const modal = close.closest('.lead-modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.lead-modal').forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// Live Chat
export function initLiveChat() {
    const chatToggle = document.getElementById('live-chat-toggle');
    const chatWindow = document.getElementById('live-chat-window');
    const chatClose = document.getElementById('live-chat-close');
    const chatSend = document.getElementById('live-chat-send');
    const chatInput = document.getElementById('live-chat-input');
    const chatMessages = document.getElementById('live-chat-messages');
    
    if (!chatToggle || !chatWindow) return;
    
    chatToggle.addEventListener('click', () => {
        const isVisible = chatWindow.style.display !== 'none';
        chatWindow.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
    });
    
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });
    }
    
    function sendMessage() {
        const message = chatInput?.value.trim();
        if (!message) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'live-chat__message live-chat__message--user';
        userMsg.innerHTML = `<div class="live-chat__message-content"><p>${escapeHtml(message)}</p></div>`;
        chatMessages?.appendChild(userMsg);
        
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate bot response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'live-chat__message live-chat__message--bot';
            botMsg.innerHTML = `<div class="live-chat__message-content"><p>Thanks for your message! A representative will be with you shortly. In the meantime, feel free to browse our inventory or schedule a test drive.</p></div>`;
            chatMessages?.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Model Selection (for search)
export function initModelSelection() {
    const makeSelect = document.getElementById('search-make');
    const modelSelect = document.getElementById('search-model');
    
    if (!makeSelect || !modelSelect) return;
    
    const models = {
        toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', '4Runner', 'Sequoia'],
        honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Ridgeline', 'HR-V', 'Passport'],
        ford: ['F-150', 'Explorer', 'Escape', 'Mustang', 'Edge', 'Expedition', 'Bronco', 'Ranger'],
        chevrolet: ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Suburban', 'Trailblazer', 'Blazer'],
        bmw: ['3 Series', '5 Series', 'X3', 'X5', 'X7', 'X1', 'X4'],
        mercedes: ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class', 'GLS', 'CLA'],
        audi: ['A4', 'A6', 'Q5', 'Q7', 'Q3', 'A3', 'Q8'],
        lexus: ['ES', 'RX', 'NX', 'GX', 'LX', 'IS', 'UX']
    };
    
    makeSelect.addEventListener('change', () => {
        const make = makeSelect.value;
        modelSelect.innerHTML = '<option value="">All Models</option>';
        
        if (make && models[make]) {
            models[make].forEach(model => {
                const option = document.createElement('option');
                option.value = model.toLowerCase().replace(/\s+/g, '-');
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    });
}

// Hero Search Form Handler
export function initHeroSearch() {
    const heroSearchForm = document.getElementById('hero-search-form');
    
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const searchParams = new URLSearchParams(formData);
            
            // Scroll to inventory section
            const inventorySection = document.getElementById('inventory');
            if (inventorySection) {
                inventorySection.scrollIntoView({ behavior: 'smooth' });
                
                // Apply filters based on search (simplified)
                setTimeout(() => {
                    // This would trigger filter application based on search params
                    console.log('Search params:', Object.fromEntries(searchParams));
                }, 500);
            }
        });
    }
}

// Vehicle Favorite Toggle
export function initVehicleFavorites() {
    const favoriteBtns = document.querySelectorAll('.vehicle-card__favorite');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.textContent = '♥';
            } else {
                btn.textContent = '♡';
            }
            
            // Save to localStorage
            const vehicleCard = btn.closest('.vehicle-card');
            const vehicleTitle = vehicleCard?.querySelector('.vehicle-card__title')?.textContent;
            if (vehicleTitle) {
                const favorites = JSON.parse(localStorage.getItem('vehicleFavorites') || '[]');
                if (btn.classList.contains('active')) {
                    if (!favorites.includes(vehicleTitle)) {
                        favorites.push(vehicleTitle);
                    }
                } else {
                    const index = favorites.indexOf(vehicleTitle);
                    if (index > -1) {
                        favorites.splice(index, 1);
                    }
                }
                localStorage.setItem('vehicleFavorites', JSON.stringify(favorites));
            }
        });
    });
    
    // Load saved favorites on page load
    const favorites = JSON.parse(localStorage.getItem('vehicleFavorites') || '[]');
    favoriteBtns.forEach(btn => {
        const vehicleCard = btn.closest('.vehicle-card');
        const vehicleTitle = vehicleCard?.querySelector('.vehicle-card__title')?.textContent;
        if (favorites.includes(vehicleTitle)) {
            btn.classList.add('active');
            btn.textContent = '♥';
        }
    });
}

// Service Booking Form
export function initServiceBooking() {
    const serviceForm = document.getElementById('service-booking-form');
    
    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log('Service booking:', data);
            alert('Thank you! Your service appointment has been scheduled. We\'ll send you a confirmation email shortly.');
            serviceForm.reset();
        });
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

