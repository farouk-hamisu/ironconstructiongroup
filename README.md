# Iron Construction Group

Marketing website for **Iron Construction Group** — a full-service American construction and renewable-energy contractor. The site is a fast, dependency-free, static multi-page site covering commercial/residential construction, solar energy, and turnkey solutions.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no frameworks, no build step, no dependencies
- **Vercel** — static hosting with clean URLs (`/about` instead of `/about.html`)
- **[Google Fonts](https://fonts.google.com/)** — Barlow Condensed (display) + Barlow (body)
- **[Tawk.to](https://www.tawk.to/)** — live chat widget on every page

## Pages

| Page              | Route          | Description                                        |
| ----------------- | -------------- | -------------------------------------------------- |
| Home              | `/`            | Hero, stats, services overview, projects, testimonials |
| About             | `/about`       | Company history, founding, values, team process    |
| Construction      | `/construction`| Commercial & residential building, general contracting |
| Solar Energy      | `/solar`       | Solar panel systems, battery storage, maintenance  |
| Solutions         | `/solutions`   | Full renewable-energy solutions sub-page           |
| Projects          | `/projects`    | Filterable portfolio (construction / solar / commercial / residential) |
| Contact           | `/contact`     | Quote request form, contact details, map           |

## Project Structure

```
.
├── index.html          # Home page
├── about.html
├── construction.html
├── solar.html
├── solutions.html
├── projects.html
├── contact.html
├── css/
│   └── style.css       # Complete design system & all layouts
├── js/
│   └── main.js         # All interactions (no dependencies)
├── assets/
│   ├── images/         # Reserved for self-hosted images
│   └── icons/
└── vercel.json         # Clean URLs, caching & security headers
```

## Features

- Fully responsive, mobile-first layout (header nav collapses to a slide-in drawer)
- Sticky header with scroll state, animated counters, and scroll-reveal effects
- Project portfolio with client-side filtering
- FAQ accordion, testimonial slider, and news ticker
- Contact/quote form with a front-end confirmation notice
- Live chat (Tawk.to) embedded on every page
- Accessibility touches: skip targets, ARIA states, `prefers-reduced-motion` support

## Customization

**Contact details** (`(225) 451-0091`, `4800 Industrial Parkway, Los Angeles, CA 90058`) and the Tawk.to widget ID are referenced in the HTML on every page. To change them, search and replace across the `*.html` files.

**Images** currently load from the Unsplash CDN. To self-host, add files to `assets/images/` and swap the `https://images.unsplash.com/...` URLs in the HTML.

## Local Development

The site is pure static files — open any page directly in a browser, or serve the folder:

```bash
cd ironconstructiongroup
python3 -m http.server 8123
# → http://localhost:8123
```

No build, install, or run scripts are required.

## Deployment (Vercel)

Two options:

**1. Vercel CLI**

```bash
npx vercel            # preview deployment
npx vercel --prod     # production deployment
```

**2. Git integration**

Push to your linked GitHub repo — Vercel builds automatically. Framework preset: **Other** (static). No build command or environment variables are needed.

### Caching note

`css/*` and `js/*` are served with `Cache-Control: public, max-age=0, must-revalidate` (see `vercel.json`). After a code change, either push a fingerprint bump on the `?v=` query in the HTML (e.g. `style.css?v=2`) or change the assets directly — do **not** cache these files as `immutable` unless the filenames are content-hashed, or old versions will be served for up to a year.

## License

© Iron Construction Group. All rights reserved.