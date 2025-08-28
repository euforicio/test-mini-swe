# Euforicio Flowers — Simple Marketing Website

A lightweight, responsive marketing website for a flower store.

Brand
- Site: Euforicio Flowers
- Tagline: Fresh blooms, delivered with love

Pages
- index.html (Home)
- about.html
- products.html
- contact.html

Features
- Responsive, mobile-first layout (Flexbox + Grid)
- Accessible semantics (alt text, labels, high contrast)
- SEO basics (titles, meta description, Open Graph, favicon)
- Products grid with prices and Order buttons
- Contact form with client-side validation (no backend) and mailto fallback
- Mobile nav toggle and smooth scrolling for same-page anchors
- Optimized images via remote, compressed Unsplash URLs

How to run locally
1) Ensure you have Python 3 installed.
2) From this directory, run:
   python3 -m http.server 8000
3) Open http://localhost:8000 in your browser.

Notes
- No build step. Plain HTML/CSS/JS.
- Images are served from Unsplash with compression parameters for performance.
