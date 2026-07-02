/**
 * Website portfolio showcase — client work and starter demos
 *
 * status:
 * - live: on the client's production domain
 * - in-progress: real client work on a staging/preview URL (e.g. Vercel) until launch
 * - demo: WebOps starter template, not tied to a client launch
 */

export const templates = [
    {
        name: "ClubExtreme Volleyball",
        kind: "client",
        status: "live",
        meta: "Sports club · Ohio",
        tagline: "Athlete profiles, event calendar, and registration for a competitive volleyball club.",
        features: ["Event calendar", "Athlete profiles", "Registration"],
        color: "#dc2626",
        badge: "Sports",
        image: "assets/images/templates/clubextreme-volleyball.jpg",
        liveUrl: "https://www.cevohio.org/"
    },
    {
        name: "Neptune Pressure Washing",
        kind: "client",
        status: "live",
        meta: "Service business · Green, OH",
        tagline: "Interactive house visualization, before/after gallery, and lead capture for a local exterior cleaning company.",
        features: ["Interactive house", "Before/after gallery", "Lead capture"],
        color: "#1e3a5f",
        path: "WebOps Development LLC Website/templates/neptune-pressure-washing/",
        badge: "Service",
        image: "assets/images/templates/neptune-pressure-washing-preview.jpg",
        liveUrl: "https://www.neptunewashpros.com/"
    },
    {
        name: "The Group Sales Network",
        kind: "client",
        status: "in-progress",
        meta: "Hospitality · Group sales",
        tagline: "On-demand task force site for hotel group sales teams — in active development ahead of client launch.",
        features: ["Service pages", "Portfolio story", "Lead CTAs"],
        color: "#0f766e",
        badge: "Hospitality",
        image: "assets/images/templates/the-group-sales-network-preview.jpg",
        previewUrl: "https://the-group-sales-network.vercel.app/"
    },
    {
        name: "Special Event Designs",
        kind: "client",
        status: "in-progress",
        meta: "Events · Floral design",
        tagline: "Event planning and floral design with calendar booking, galleries, and testimonials — staging preview until launch.",
        features: ["Calendar booking", "Portfolio gallery", "Service showcase"],
        color: "#dc2626",
        path: "WebOps Development LLC Website/templates/special-event-designs/",
        badge: "Events",
        image: "assets/images/templates/special-event-designs-preview.jpg",
        previewUrl: "https://special-event-designs-cnnf.vercel.app/"
    },
    {
        name: "Business Websites",
        kind: "demo",
        status: "demo",
        meta: "Corporate · B2B",
        tagline: "Consulting demo with case studies, team profiles, FAQ, and conversion-focused sections.",
        features: ["Case studies", "Team profiles", "Lead capture"],
        color: "#2563EB",
        path: "WebOps Development LLC Website/templates/business-websites/",
        badge: "Corporate",
        image: "assets/images/templates/business-websites-hero.jpg"
    },
    {
        name: "Service-Oriented Website",
        kind: "demo",
        status: "demo",
        meta: "Local services · Salon",
        tagline: "Booking flow, service cards, gallery, and offers for salons, studios, and local pros.",
        features: ["Booking flow", "Service cards", "Gallery"],
        color: "#E11D48",
        path: "WebOps Development LLC Website/templates/service-oriented-website/",
        badge: "Service",
        image: "assets/images/templates/service-oriented-website-preview.jpg"
    },
    {
        name: "E-commerce Website",
        kind: "demo",
        status: "demo",
        meta: "Retail · DTC",
        tagline: "Product grid, deals, categories, and cart preview for online stores and boutiques.",
        features: ["Product grid", "Cart preview", "Deals"],
        color: "#7C3AED",
        path: "WebOps Development LLC Website/templates/e-commerce-website/",
        badge: "Retail",
        image: "assets/images/templates/e-commerce-website-preview.jpg"
    },
    {
        name: "Dealership Website",
        kind: "demo",
        status: "demo",
        meta: "Automotive · Dealer",
        tagline: "Inventory search, financing calculator, and service department for auto dealerships.",
        features: ["Inventory search", "Financing", "Service dept"],
        color: "#1D4ED8",
        path: "WebOps Development LLC Website/templates/dealership-website/",
        badge: "Automotive",
        image: "assets/images/templates/dealership-website-hero.jpg"
    },
    {
        name: "Blog Website",
        kind: "demo",
        status: "demo",
        meta: "Content · Publishing",
        tagline: "Article layouts, categories, and search for writers, creators, and content teams.",
        features: ["SEO optimized", "Categories", "Article layouts"],
        color: "#0d9488",
        path: "WebOps Development LLC Website/templates/blog-website/",
        badge: "Content",
        image: "assets/images/templates/blog-website-featured.jpg"
    },
    {
        name: "Property Management",
        kind: "demo",
        status: "demo",
        meta: "Real estate · Rentals",
        tagline: "Property listings, tenant portal, and maintenance requests for rental managers.",
        features: ["Listings", "Tenant portal", "Maintenance"],
        color: "#1e3a8a",
        path: "WebOps Development LLC Website/templates/property-management/",
        badge: "Real Estate",
        image: "assets/images/templates/property-management-preview.jpg"
    }
];

/** Bump when replacing files under assets/images/templates/ so browsers fetch fresh previews. */
export const TEMPLATE_PREVIEW_ASSET_VERSION = '20250628e';

/**
 * Cache-bust same-origin template preview paths (not absolute URLs).
 * @param {string} url
 */
export function withTemplatePreviewCacheBust(url) {
    if (!url || /^(https?:)?\/\//i.test(url)) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${TEMPLATE_PREVIEW_ASSET_VERSION}`;
}

/** @param {typeof templates[number]} template */
export function getTemplateStatus(template) {
    if (!template) return 'demo';
    if (template.status) return template.status;
    if (template.kind === 'demo') return 'demo';
    if (template.liveUrl) return 'live';
    return 'in-progress';
}

/**
 * Pick the best URL to link to for a portfolio item.
 * @param {typeof templates[number]} template
 */
export function getTemplatePrimaryUrl(template) {
    if (!template) return '';
    return template.liveUrl || template.previewUrl || template.demoUrl || template.path || '';
}

/** @param {typeof templates[number]} template */
export function getTemplateLinkLabel(template) {
    const status = getTemplateStatus(template);
    if (status === 'live') return 'View live site';
    if (status === 'in-progress') return 'Preview staging site';
    return 'Preview demo';
}

/** @param {typeof templates[number]} template */
export function getTemplateMetaLine(template) {
    const statusLabels = {
        live: 'Live site',
        'in-progress': 'In progress',
        demo: 'Starter demo'
    };
    const kindLabel = statusLabels[getTemplateStatus(template)] || 'Starter demo';
    return template.meta ? `${kindLabel} · ${template.meta}` : kindLabel;
}

export function initTemplates() {
    const templatesList = document.getElementById('templates-grid');
    if (!templatesList) return;

    templates.forEach((template) => {
        templatesList.appendChild(createShowcaseItem(template));
    });

    initShowcaseFilters();
}

/** @param {typeof templates[number]} template */
function createShowcaseItem(template) {
    const item = document.createElement('article');
    item.className = 'showcase-item';
    item.dataset.kind = template.kind || 'demo';
    item.dataset.status = getTemplateStatus(template);

    const imageUrl = withTemplatePreviewCacheBust(
        template.image || `assets/images/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
    );
    const primaryHref = encodeURI(getTemplatePrimaryUrl(template) || '#');
    const linkLabel = getTemplateLinkLabel(template);
    const tagline = template.tagline || template.description || '';
    const metaLine = getTemplateMetaLine(template);

    item.innerHTML = `
        <a href="${primaryHref}" class="showcase-item__thumb" target="_blank" rel="noopener noreferrer" aria-label="${template.name} — ${linkLabel}">
            <img src="${imageUrl}" alt="" loading="lazy" width="400" height="250">
        </a>
        <div class="showcase-item__content">
            <p class="showcase-item__meta">${metaLine}</p>
            <h3 class="showcase-item__title">
                <a href="${primaryHref}" target="_blank" rel="noopener noreferrer">${template.name}</a>
            </h3>
            <p class="showcase-item__text">${tagline}</p>
            <a href="${primaryHref}" class="showcase-item__link" target="_blank" rel="noopener noreferrer">${linkLabel} →</a>
        </div>
    `;

    return item;
}

function initShowcaseFilters() {
    const filterBar = document.getElementById('showcase-filters');
    const list = document.getElementById('templates-grid');
    if (!filterBar || !list) return;

    const buttons = filterBar.querySelectorAll('[data-filter]');
    const items = list.querySelectorAll('.showcase-item');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            buttons.forEach((btn) => {
                btn.classList.toggle('is-active', btn === button);
                btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
            });

            items.forEach((item) => {
                const match = filter === 'all' || item.dataset.kind === filter;
                item.hidden = !match;
            });
        });
    });
}
