# Hot Beans Web

A responsive, multi-page recruitment website for **Hot Beans Web**, a fictional web development studio in London. Visitors can browse open roles, filter recommended training courses, meet the team and apply through a validated application form.

**Live site:** https://n4staa.github.io/HBW/

![Home page on desktop](docs/screenshot-desktop.jpg)

## Features

- **Responsive layout** built with CSS Grid and Flexbox, from 320px phones to wide desktops, with a collapsible navigation menu on small screens
- **Application form with client-side validation** in JavaScript: UK phone number and email format checks, a minimum age of 16 calculated from the date of birth, an error summary that links to each problem field, and messages that clear as the user corrects them
- **Role pre-selection**: each "Apply for this role" button passes the role in the URL (`apply.html?role=it-technician`), and the form selects it automatically
- **Course filter** by level (beginner, intermediate, advanced) with a live result count announced to screen readers
- **Personalised confirmation page** using `sessionStorage`, so applicant details never appear in the URL and are cleared when the tab closes
- **Accessibility**: semantic HTML landmarks, a skip link, labelled form controls, `aria-invalid` and `aria-describedby` on errors, visible keyboard focus, sufficient colour contrast and support for reduced motion
- **Performance**: images resized and compressed from about 95 MB to about 1.3 MB, lazy-loaded below the fold, with no CSS or JavaScript frameworks

<img src="docs/screenshot-mobile-form.jpg" alt="Application form on mobile showing validation errors" width="300">

## Built with

- HTML5
- CSS3 (custom properties, Grid, Flexbox, media queries)
- JavaScript (ES6, no libraries)
- Hosted on GitHub Pages

## Project structure

```
├── index.html          Home page
├── careers.html        Open roles and requirements
├── courses.html        Recommended courses with level filter
├── team.html           Team profiles
├── apply.html          Application form
├── thank-you.html      Personalised confirmation
├── 404.html            Custom not-found page
├── assets/
│   ├── css/style.css   All styles, organised by tokens, layout, components and pages
│   ├── js/main.js      Navigation, course filter, form validation, confirmation
│   └── img/            Optimised photos, team portraits and favicon
└── docs/               README screenshots
```

## Run it locally

No build step is needed. Clone the repository and open `index.html` in a browser, or serve the folder:

```bash
git clone https://github.com/N4staa/HBW.git
cd HBW
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Background

I first built this site for the Website Development unit of my BTEC Level 3 Extended Diploma in IT (2023–2025). In 2026 I rebuilt it to a professional standard: a new responsive design, accessible markup, JavaScript validation and interactivity, optimised images and fixes for the broken form and links in the original version.

Hot Beans Web is a fictional company. Team names and photos are placeholders, and course links point to real third-party providers.

## Author

**Anastasia Spiner**, BSc Computer Science student at City St George's, University of London
