# Neptune Pressure Washing Website Template

A professional pressure washing service website template featuring an interactive house visualization, service bubbles, before/after gallery, and comprehensive service listings. Perfect for exterior cleaning businesses, power washing services, and property maintenance companies.

## Key Features

- ✅ **Interactive House Visualization** - Interactive service bubbles on house image
- ✅ **Service Bubbles** - Clickable service points on house image
- ✅ **Before/After Gallery** - Showcase transformation results
- ✅ **Trust Badges** - Build credibility with trust elements
- ✅ **Service Listings** - Comprehensive service offerings
- ✅ **Review Ticker** - Display customer reviews prominently
- ✅ **Mobile Responsive** - Fully responsive design
- ✅ **SEO Optimized** - Local business schema and meta tags
- ✅ **Fast Loading** - Optimized for performance

## Template Structure

```
neptune-pressure-washing/
├── index.html              # Main homepage
├── css/
│   ├── main.css           # Main stylesheet (imports all)
│   ├── variables.css      # CSS custom properties
│   ├── reset.css          # CSS reset
│   ├── base.css           # Base styles
│   ├── layout.css         # Layout styles
│   ├── components.css     # Component styles
│   └── utilities.css      # Utility classes
├── js/
│   ├── main.js            # Main initialization
│   ├── navigation.js      # Navigation functionality
│   ├── animations.js      # Animation handlers
│   └── utils.js           # Utility functions
├── assets/
│   └── images/            # Image assets
├── robots.txt             # SEO robots file
├── sitemap.xml            # SEO sitemap
└── README.md              # This file
```

## Customization Guide

### 1. Brand Colors

Update colors in `css/variables.css`:

```css
:root {
    --color-neptune-blue: #1e3a5f;
    --color-neptune-dark-blue: #0f1f35;
    --color-neptune-light-blue: #3b82f6;
    --color-neptune-gold: #d4af37;
}
```

### 2. Business Information

Update business details in `index.html`:
- Company name
- Phone number
- Email address
- Address
- Service areas
- Social media links

### 3. Services

Update services in `index.html`:
- Service cards in the services grid
- Service bubbles on the interactive house
- Footer service links

### 4. Images

Replace images in `assets/images/`:
- `house-hero.png` or `Untitled design (2).png` - Main house image
- Before/after gallery images
- Service images

### 5. Reviews

Add reviews in `js/main.js`:
```javascript
const reviews = [
    '"Your review text here" — Customer Name',
    // Add more reviews
];
```

## Interactive Features

### Service Bubbles

The interactive house section features clickable service bubbles that:
- Animate on page load
- Show hover effects
- Link to service sections
- Display service descriptions on hover

### Before/After Gallery

The gallery features:
- Click to view full-size modal
- Before/after side-by-side comparison
- Service descriptions
- Responsive grid layout

### Trust Badges

Multiple trust badge sections:
- Prominent trust badges (top section)
- Detailed trust badges (why choose us)
- Satisfaction guarantee badge

## SEO Optimization

### Local Business Schema

The template includes LocalBusiness schema markup with:
- Business name and description
- Contact information
- Address and service area
- Opening hours
- Social media profiles

### Meta Tags

Comprehensive meta tags for:
- Search engines
- Social media (Open Graph)
- Twitter Cards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized images
- Lazy loading
- Efficient CSS
- Minimal JavaScript
- Fast page load times

## Deployment

1. Upload all files to your web server
2. Update business information
3. Replace placeholder images
4. Test all links and forms
5. Submit sitemap to search engines

## Support

For customization help or questions, refer to the main template documentation or contact support.

## License

This template is provided as-is for use in client projects.
