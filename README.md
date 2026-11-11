# South Wales Tutoring | Complete static website

A deployable, responsive Bootstrap 5.3 website for **South Wales Tutoring**, part of **North Wales Tutoring Group**.

**Vision:** Delivering a better future.

## Folder structure

```text
index.html                               SEO-focused homepage and quick enquiry
about.html                               Brand and group story
subjects.html                            Subject directory
maths-tutoring-south-wales.html           Dedicated subject landing page
physics-tutoring-south-wales.html         Dedicated subject landing page
science-tutoring-south-wales.html         Biology, Chemistry, Physics
english-tutoring-south-wales.html         English Language & Literature
gcse-tutoring-south-wales.html            GCSE and resits
a-level-tutoring-south-wales.html         AS and A-Level
primary-ks3-tutoring-south-wales.html     Primary and KS3
wjec-tutoring-south-wales.html            Welsh qualifications
our-tutors.html                          Regular tutor cards, no profile pages
locations.html                           Major and additional South Wales areas
areas/                                   Cardiff, Swansea, Newport, Bridgend, Valleys
contact.html                             Web3Forms enquiry form
thank-you.html                           Conversion destination (noindex)
blog.html                                Blog listing with category filters
blog/                                    Four complete, crawlable article pages
assets/css/global.css                    All global styles, header, footer, cookies, forms
assets/css/pages.css                     Page and service-specific styles
assets/css/blog.css                      Blog-specific styles
assets/js/components.js                  Reusable header, footer and cookie Web Components
assets/js/site.js                        Form validation, anti-spam and submissions
assets/js/blog.js                        Blog category filter
assets/brand/                             Logo, dark-footer variant, favicon
assets/images/                            Optimised imagery from supplied project sources
site-config.json                         Brand/contact/key reference configuration
data/posts.json                          Separate editorial blog manifest
data/site-pages.json                      SEO page manifest
sitemap.xml, robots.txt                   SEO discovery
404.html                                  Custom error page
tools/build_site.py                       Rebuild static pages and structured data
```

## Start locally

Extract the ZIP and open `index.html` for a quick look, or preferably run a local server to approximate deployment:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Deploy **the contents of this folder** (not the parent folder) to a static hosting provider such as GitHub Pages, Netlify, Cloudflare Pages or another static web host. No Node, Python or server-side runtime is required for ordinary visitors.

## Important: verify the final domain before launch

The build **assumes `https://cleandesignuk.github.io/south-wales-tutoring/`** as the public domain because a URL wasn't specified. Ownership was not confirmed. This affects canonical URLs, the sitemap, social previews, JSON-LD and `site-config.json`.

If the domain is different, change `BASE` in `tools/build_site.py`, change `siteUrl` in `site-config.json`, then run `python tools/build_site.py`. Update any DNS and host custom-domain configuration separately. The project does **not** create DNS records or register a domain.

## Web3Forms and spam protection

The provided access key is already configured on the homepage and contact forms. This is a **public Web3Forms access key**, not a private server password. Forms use:

- email, phone, name, subject and message fields (plus level and area on the full form);
- native HTML validation and additional JavaScript validation;
- hidden `botcheck` honeypot and hidden text trap (no visible checkbox);
- a minimum human fill-time check;
- Web3Forms server-side spam filtering;
- user-visible failure messaging and a success destination.

**A live submission was deliberately not sent** to avoid emailing the real business during development. Submit a real test form after deploying and confirm that the Web3Forms key forwards messages to the intended inbox. Form submissions should be visible in the network tab and sent to `https://api.web3forms.com/submit` from the visitor's browser.

Web3Forms warns that a honeypot on its own is less effective than CAPTCHA. Stronger bot protection such as managed hCaptcha/Turnstile and domain restriction should be considered if spam becomes significant, but the default implementation purposely has **no visible checkbox**.

## Shared components and styling

All pages contain `<site-header>`, `<site-footer>` and `<cookie-consent>` elements; their markup is maintained once in `assets/js/components.js`. Styles for these components, buttons and forms live in **`assets/css/global.css`**. Global HTML/CSS/JS files are not duplicated across page templates.

The footer year updates automatically. The cookie banner is designed after the NWT Group pink/yellow/white style and saves a simple `localStorage` preference. No Analytics or Meta Pixel is installed in this release. If you add tracking, add a proper consent-gated loader and update privacy/cookie policies.

## SEO / AEO / GEO

- 26 indexable, static HTML pages with unique headings, descriptions and canonicals.
- WJEC and South Wales subject-specific content, including Maths and Physics.
- Five locally differentiated area pages, plus a larger service-area hub. All pages clearly describe **online lessons**, never unverified physical locations.
- EducationalOrganization, WebSite, WebPage, BreadcrumbList, Service, BlogPosting and visible-FAQ-aligned FAQPage JSON-LD.
- Social share image, proper Open Graph and Twitter metadata, sitemap and robots.txt.
- Relevant internal links, original practical FAQs and substantive blog articles.

Search engine indexing, ranking and inclusion in AI answers **cannot be guaranteed**. Submit the final `sitemap.xml` to Google Search Console and Bing Webmaster Tools once the domain is live. Search engines may not display FAQ rich results even with valid markup.

## Updating the blog

Blog articles are **individual HTML files** in `blog/`, and the listing is `blog.html`. The editorial index is also provided at `data/posts.json` for integration into future publishing workflows. To add content consistently, edit `ARTICLES` inside `tools/build_site.py` and run `python tools/build_site.py`; this will regenerate the blog listing, article pages and sitemap. Existing CSS, JavaScript and images remain unchanged.

## Source and accuracy notes

The brand palette, cookie-banner direction, group logo and image assets were derived from the two user-provided NWT Group and North Wales Tutoring source archives. Tutor photos and descriptions are examples from the **wider group network** and do not promise immediate availability. Prices match the current published starting rates: KS3/GCSE from £20/hour and A-Level from £25/hour; the final rate depends on the tutor.

WJEC content reflects publicly available WJEC and Qualifications Wales guidance on phased Made-for-Wales qualifications as of 11 November 2026. Content must be reviewed when specifications or teaching periods change. No unverified review ratings, awards or exam results have been invented.

## Recommended launch checklist

1. Confirm the canonical domain and update generated links if necessary.
2. Make a test submission from the final live domain and confirm receipt in `southwales@nwttutoring.com` or the Web3Forms-connected inbox.
3. Confirm tutors have permitted use of their photos/details on the new South Wales website, and check availability.
4. Review safeguarding, pricing, cancellations, GDPR policy, form processing and retention statements against current operations.
5. Test menu, forms, cookie controls and layout on real iPhone, Android, tablet and desktop browsers after hosting.
6. Connect analytics **only after** implementing any required consent controls. Set up Search Console and Bing Webmaster Tools.
7. Replace placeholder assumptions or details that no longer match operations before publicly advertising the website.

**Contact:** `southwales@nwttutoring.com` | `+44 7480 231362`  
**Parent:** https://nwttutoring.com/  
**Design credit:** https://cleandesignuk.com/
