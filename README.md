# Paws & Pamper – Marketing Website

A professional, responsive, static website for a dog grooming business named “Paws & Pamper”.

## Pages
- index.html – Landing page with hero, services overview, and quick contact
- services.html – Detailed list of packages and add‑ons
- about.html – Story, philosophy, and team profiles
- contact.html – Contact form and location information
- styles.css – Modern, clean styling with responsive design

## Local Development
This site is pure HTML/CSS and works without a build step.

Option 1: Open directly
- Double‑click index.html to view it in your browser.

Option 2: Serve locally (recommended)
- Python 3
  - python3 -m http.server 8000
  - Visit http://localhost:8000
- Node (if installed)
  - npx serve .
  - Visit the printed URL

## Contact Form
The contact form posts to a placeholder endpoint (https://example.com/form). Replace the action with your provider:
- Formspree: https://formspree.io
- Netlify Forms: https://docs.netlify.com/forms/setup/
- Static backend of your choice

## Deployment (GitHub Pages)
1. Push changes to the main branch (or use the included PR).
2. In your GitHub repository, go to Settings → Pages.
3. Set Source to “Deploy from a branch” and select:
   - Branch: main
   - Folder: / (root)
4. Save. Your site will be available at https://<your-username>.github.io/<repo-name>/

## Accessibility & SEO
- Semantic HTML, labels for form fields, and skip link included.
- Meta descriptions and descriptive link text.
- Responsive layout with mobile navigation.

## Project Structure
- index.html
- services.html
- about.html
- contact.html
- styles.css
- README.md

## Contributing
- Create a feature branch, commit your changes, and open a pull request.
