# South Wales Tutoring

Static, responsive website for South Wales Tutoring, part of [North Wales Tutoring Group](https://nwttutoring.com/). The site provides online one-to-one tutoring for South Wales students and is published by GitHub Pages.

**Live preview:** https://cleandesignuk.github.io/south-wales-tutoring/

## Current offer (11 November 2026)

- GCSE tutoring from **£23/hr** and A-Level tutoring from **£28/hr**. Individual specialist tutors can charge more. Confirm the actual rate and availability before booking.
- Maths, Further Maths, Physics, Chemistry, Biology, Combined Science, English and other subjects, as well as selected 11+, 13+, SATs, TMUA and UCAT preparation subject to tutor availability.
- WJEC, Eduqas, AQA, Edexcel, OCR and CAIE; Welsh-medium Maths matching where available.
- Online lessons for Cardiff, Swansea, Newport, Bridgend, the Valleys and surrounding South Wales areas. No local walk-in address or phone-call service is advertised.
- WhatsApp: +44 7480 231362; email: southwales@nwttutoring.com.

## Structure

- `index.html`, `about.html`, `subjects.html`, `our-tutors.html`, `contact.html` and subject pages: static, crawlable SEO-first HTML.
- `areas/*.html`: South Wales locality landing pages.
- `blog.html`, `blog/*.html`, `assets/css/blog.css`, `assets/js/blog.js`, `data/posts.json`: articles and blog index.
- `assets/js/components.js`: shared header, navigation dropdown, footer, review/testimonial section, cookie banner and floating WhatsApp button. Each page uses `<site-header>`, `<site-footer>` and `<cookie-consent>`; marketing pages also use `<site-testimonials>`.
- `assets/css/global.css`: single source of truth for layout primitives, colours, typography, navigation, forms, reviews, footer and cookie banner.
- `assets/css/pages.css`: page-specific styles.
- `assets/vendor/`: locally hosted Bootstrap CSS and JavaScript. Bootstrap Icons and Google Fonts are loaded from their public CDNs.
- `assets/brand/nwt-shield.png`: provided transparent NWT Group shield for navbar/footer; `assets/brand/nwt-shield-favicon.jpg`: provided non-transparent JPG favicon.
- `data/tutors.json`: November 2026 tutor snapshot compiled from the [current parent-site directory](https://northwalestutoring.com/find-tutors-north-wales-uk.html); individual tutor cards are static HTML in `our-tutors.html` and the homepage, so update both when changing the list. Portraits reference the parent website's public images.
- `site-config.json`, `sitemap.xml`, `robots.txt` and `llms.txt`: settings and machine-readable discovery files.

## Editing and deployment

1. Edit the HTML, global/page CSS, shared component JS or blog JSON as needed.
2. Maintain the current prices, availability claims and tutor snapshots after verifying against the active group directory. Do not publish removed tutors, old price lists or invented local addresses.
3. Run `python tools/validate_site.py` before every commit. Test navigation, responsive widths, cookies, form validation and successful/error Web3Forms responses in a browser.
4. Commit changes to `main`. GitHub Actions checks the static site and then deploys it to GitHub Pages.

This site is maintained as **static HTML**. There is **no required build step**. The original legacy site generator was retired because it would overwrite the updated copy and design. 

## Web3Forms and privacy

- Forms only ask for name, email, WhatsApp/phone number and message. They include an invisible honeypot/`botcheck` and basic input validation; no visible spam checkbox.
- `assets/js/site.js` sends to Web3Forms using `fetch`, shows a SweetAlert success confirmation in the same page and never redirects upon a successful JavaScript submission.
- Web3Forms access keys are meant to appear in client-side HTML; restrict and verify the destination email in the Web3Forms dashboard. Test one genuine live submission before promoting the site.
- Client-side spam checks are not a substitute for server-side rate limits or domain-level email validation. Enable Web3Forms domain restrictions/spam features where available.
- Update `privacy-policy.html` if your processing, provider list or retention policy changes.

## Custom domain

The current canonicals, JSON-LD, sitemap, `robots.txt` and social URLs use the GitHub Pages preview URL. When the custom domain becomes active, change them consistently, configure the Pages CNAME and test HTTPS. Do not add a physical address simply for local SEO.

## Safeguarding and registration (November 2026)
- A dedicated `/safeguarding.html` page uses the safeguarding policy framework supplied with the North Wales Tutoring site source.
- Designated Safeguarding Lead: Jesse. Direct safeguarding email: safeguarding@nwttutoring.com.
- The safeguarding Web3Forms access key is separate from the usual tutoring enquiry Web3Forms key. Form submissions are AJAX and show an in-page status / SweetAlert, without redirecting visitors.
- Tutor directory excludes Howard and Mahima. Their records must not be silently restored during future synchronisation.
- Shared mobile carousel controls are in `assets/js/carousels.js` and `assets/css/carousels.css`. They progressively enhance card grids and course/exam directories at widths below 768px. Desktop remains a grid.
- About page uses two distinct, previously unused photos from the provided North Wales Tutoring source archive.
- Before relying on safeguarding email delivery, send a non-sensitive test form submission and confirm delivery to the designated safeguarding mailbox. Never use a real child safeguarding concern as a test payload.
