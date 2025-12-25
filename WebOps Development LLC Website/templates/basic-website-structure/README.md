# Basic Website Structure

A flexible, modern website template designed to be easily customized for any client needs. This structure provides a solid foundation that can be adapted to various frameworks and technologies.

## Features

- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Modern CSS Architecture** - Modular, maintainable, and scalable
- ✅ **CSS Custom Properties** - Easy theming and customization
- ✅ **Dark/Light Theme Toggle** - Built-in theme switching
- ✅ **Smooth Animations** - Scroll animations and transitions
- ✅ **Accessible** - WCAG compliant, keyboard navigation, screen reader friendly
- ✅ **SEO Optimized** - Semantic HTML, proper meta tags, structured data
- ✅ **Performance Focused** - Optimized for speed
- ✅ **Component-Based** - Reusable components and utilities

## File Structure

```
Basic Website Structure/
├── index.html          # Main HTML file
├── css/                # Stylesheets
│   ├── reset.css       # CSS reset
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Base styles
│   ├── layout.css      # Layout styles
│   ├── components.css  # Component styles
│   ├── utilities.css   # Utility classes
│   └── main.css        # Main stylesheet (imports all)
├── js/                 # JavaScript files
│   ├── main.js         # Main initialization
│   ├── navigation.js   # Navigation functionality
│   ├── animations.js   # Scroll animations
│   ├── seo.js          # SEO utilities
│   └── utils.js        # Utility functions
├── assets/             # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── robots.txt          # Search engine directives
├── sitemap.xml         # Site structure for search engines
├── site.webmanifest    # PWA manifest
├── browserconfig.xml   # Windows tile configuration
└── README.md           # This file
```

## Getting Started

1. **Customize** the content in `index.html`
2. **Modify colors** in `css/variables.css` to match your brand
3. **Add your content** to each section
4. **Replace placeholder** images and icons
5. **Update SEO meta tags** in `index.html`
6. **Configure** `robots.txt` and `sitemap.xml` with your domain
7. **Test** on different devices and browsers

## Customization

### Colors
Edit `css/variables.css` to change the color scheme:
```css
:root {
    --color-primary: #your-color;
    --color-secondary: #your-color;
    /* ... */
}
```

### Typography
Modify font families and sizes in `css/variables.css`:
```css
:root {
    --font-family-primary: 'Your Font', sans-serif;
    --font-size-base: 1rem;
    /* ... */
}
```

### Layout
Adjust container width and spacing in `css/variables.css`:
```css
:root {
    --container-max-width: 1200px;
    --spacing-md: 1rem;
    /* ... */
}
```

## SEO Configuration

Before launching, make sure to:

1. Update all meta tags in `index.html`
2. Configure structured data (JSON-LD) in `index.html`
3. Update `robots.txt` with your domain
4. Update `sitemap.xml` with your URLs
5. Add favicons and app icons
6. Set up Google Analytics (uncomment in `index.html`)
7. Submit sitemap to Google Search Console

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Converting to Frameworks

### Next.js
This structure can easily be converted to Next.js:
1. Create a Next.js project
2. Move HTML sections to React components
3. Convert CSS to CSS Modules or styled-components
4. Use Next.js routing for navigation

### React/Vue/Angular
- Extract sections into components
- Use framework-specific styling solutions
- Implement routing with framework router

### WordPress
- Convert HTML to PHP templates
- Use WordPress functions for dynamic content
- Maintain CSS structure

## Performance Tips

1. Optimize images (use WebP format)
2. Minify CSS and JavaScript for production
3. Use a CDN for assets
4. Implement lazy loading for images
5. Consider using a build tool (Webpack, Vite, etc.)

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Skip links

## License

Free to use for personal and commercial projects.

## Support

For customization help or questions, refer to the code comments or modify as needed for your specific requirements.

