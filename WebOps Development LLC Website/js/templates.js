/**
 * Template Showcase - Dynamically generate template cards
 */

const templates = [
    {
        name: "Blog Website",
        description: "Perfect for content creators, writers, and businesses sharing regular updates. Features article layouts, categories, and search functionality.",
        features: ["SEO Optimized", "Responsive", "Category System"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Easily migratable to Next.js, React, Vue, or any framework",
        color: "#0d9488",
        path: "templates/blog-website/",
        badge: "Content",
        image: "assets/images/templates/blog-website-featured.jpg"
    },
    {
        name: "Business Websites",
        description: "Professional corporate websites with team sections, testimonials, case studies, and comprehensive service showcases.",
        features: ["Team Profiles", "Testimonials", "Case Studies"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Framework-agnostic - works with any backend or framework",
        color: "#1e3a8a",
        path: "templates/business-websites/",
        badge: "Corporate",
        image: "assets/images/templates/business-websites-hero.jpg"
    },
    {
        name: "Dealership Website",
        description: "Specialized for vehicle dealerships with inventory management, vehicle search filters, financing calculator, and service department.",
        features: ["Inventory Grid", "Financing", "Service Dept"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Ready for React, Vue, or framework integration",
        color: "#2563eb",
        path: "templates/dealership-website/",
        badge: "Automotive",
        image: "assets/images/templates/dealership-website-hero.jpg"
    },
    {
        name: "E-commerce Website",
        description: "Complete online store solution with product catalog, shopping cart, checkout process, and payment integration ready.",
        features: ["Product Catalog", "Shopping Cart", "Checkout"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Easily enhanced with Next.js, Vue.js, Ruby on Rails, or any e-commerce backend",
        color: "#9333ea",
        path: "templates/e-commerce-website/",
        badge: "Retail",
        image: "assets/images/templates/e-commerce-website-preview.jpg"
    },
    {
        name: "Service-Oriented Website",
        description: "Perfect for service businesses with booking systems, service listings, emergency services, and trust-building elements.",
        features: ["Booking System", "Service Listings", "Trust Elements"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Framework-agnostic foundation",
        color: "#ec4899",
        path: "templates/service-oriented-website/",
        badge: "Service",
        image: "assets/images/templates/service-oriented-website-preview.jpg"
    },
    {
        name: "Property Management",
        description: "Professional property management platform for vacation homes, apartments, and rental properties. Features property listings, tenant portals, maintenance requests, and booking systems.",
        features: ["Property Listings", "Tenant Portal", "Maintenance System"],
        techStack: "Vanilla JavaScript (ES6+), Modern CSS, Semantic HTML5",
        frameworkReady: "Ready for React, Vue, or any property management backend",
        color: "#1e3a8a",
        path: "templates/property-management/",
        badge: "Real Estate",
        image: "assets/images/templates/property-management-preview.jpg"
    }
];

export function initTemplates() {
    const templatesGrid = document.getElementById('templates-grid');
    if (!templatesGrid) return;

    templates.forEach((template, index) => {
        const card = createTemplateCard(template, index);
        templatesGrid.appendChild(card);
    });
}

function createTemplateCard(template, index) {
    const card = document.createElement('article');
    card.className = 'template-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Use custom image if provided, otherwise generate from template name
    const imageUrl = template.image || `assets/images/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    
    card.innerHTML = `
        <div class="template-card__image" style="background-color: transparent;">
            <img src="${imageUrl}" alt="${template.name} preview" loading="lazy">
            <span class="template-card__badge" style="background-color: ${template.color}">${template.badge}</span>
        </div>
        <div class="template-card__content">
            <h3 class="template-card__title">${template.name}</h3>
            <p class="template-card__description">${template.description}</p>
            <div class="template-card__features">
                ${template.features.map(feature => 
                    `<span class="template-card__feature">${feature}</span>`
                ).join('')}
            </div>
            <div class="template-card__tech">
                <div class="template-card__tech-stack">
                    <strong>Tech Stack:</strong> ${template.techStack}
                </div>
                <div class="template-card__framework-ready">
                    <strong>Framework Ready:</strong> ${template.frameworkReady}
                </div>
            </div>
            <div class="template-card__actions">
                <a href="${template.path}" class="template-card__link" target="_blank" style="background-color: ${template.color}">
                    View Template
                </a>
            </div>
        </div>
    `;

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = template.color;
    });

    return card;
}

