/**
 * Portfolio Showcase - Display client websites
 */

const portfolioItems = [
    {
        name: "ClubExtreme Volleyball",
        description: "Professional volleyball club website featuring athlete profiles, event calendar, team information, and registration system.",
        features: ["Event Calendar", "Athlete Profiles", "Registration System"],
        color: "#dc2626", // Red color for sports/volleyball
        coralColor: "#f37a85", // Coral color from ClubExtreme website
        url: "https://www.cevohio.org/",
        badge: "Sports",
        image: "assets/images/templates/clubextreme-volleyball.jpg"
    }
];

export function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioItems.forEach((item, index) => {
        const card = createPortfolioCard(item, index);
        portfolioGrid.appendChild(card);
    });
}

function createPortfolioCard(item, index) {
    const card = document.createElement('article');
    card.className = 'portfolio-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="portfolio-card__image" style="background-color: ${item.coralColor || item.color}; border-left: 4px solid ${item.coralColor || item.color}; border-right: 4px solid ${item.coralColor || item.color};">
            <img src="${item.image}" alt="${item.name} preview" loading="lazy" onerror="this.style.display='none'">
            <span class="portfolio-card__badge" style="background-color: ${item.color}">${item.badge}</span>
        </div>
        <div class="portfolio-card__content">
            <h3 class="portfolio-card__title">${item.name}</h3>
            <p class="portfolio-card__description">${item.description}</p>
            <div class="portfolio-card__features">
                ${item.features.map(feature => 
                    `<span class="portfolio-card__feature">${feature}</span>`
                ).join('')}
            </div>
            <div class="portfolio-card__actions">
                <a href="${item.url}" class="portfolio-card__link" target="_blank" rel="noopener noreferrer" style="background-color: ${item.coralColor || item.color}">
                    Visit Website
                </a>
            </div>
        </div>
    `;

    // Hover effect - border removed

    return card;
}

