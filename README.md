# Vnoirs — Next.js Enterprise Edition (JavaScript)

High-performance, modern Next.js 15 web application for **Vnoirs** (`vnoirs.com`). Features full **WhatsApp Cloud API** solutions showcase, custom web engineering services, server-side Resend email workflows, dynamic SEO metadata, and zero fake profiles or mock portfolios.

---

## ⚡ Tech Stack

* **Framework:** Next.js 15 (App Router with React 19 & JavaScript ESM)
* **Styling:** Tailwind CSS with custom glassmorphic glow utilities and responsive mobile navigation
* **Icons:** Lucide React
* **Email System:** Official Resend SDK (`resend`) with responsive HTML templates & Zod validation
* **Branded Favicon:** Dual SVG dynamic app icon (`icon.svg`) + `favicon.ico` / `favicon.svg`
* **SEO & Metadata:** Dynamic OpenGraph, Twitter cards, JSON-LD Schema (`Organization`, `WebSite`), `sitemap.xml`, and `robots.txt`

---

## 📁 Directory Structure

```text
vnoirs-next/
├── public/
│   ├── favicon.ico          # Multi-resolution ICO favicon
│   ├── favicon.svg          # Scalable vector favicon
│   ├── banner-image.jpg     # High-resolution hero banner
│   └── grid-pattern.svg     # SVG pattern backdrop
├── src/
│   ├── app/
│   │   ├── api/contact/     # Resend email route handler with Zod validation
│   │   ├── about/           # Authentic engineering values & tech stack
│   │   ├── services/        # WhatsApp Cloud API & custom development solutions
│   │   ├── contact/         # Interactive contact desk & FAQ
│   │   ├── privacy-policy/  # Official Meta/WhatsApp compliance policy
│   │   ├── icon.svg         # App Router native branded favicon
│   │   ├── not-found.jsx    # Branded 404 page
│   │   ├── robots.js        # Dynamic robots.txt
│   │   ├── sitemap.js       # Dynamic sitemap.xml
│   │   ├── layout.jsx       # Root layout + JSON-LD Schema + favicon links
│   │   ├── page.jsx         # Hero, capabilities, workflow & live contact
│   │   └── globals.css      # Styling & glassmorphism utilities
│   ├── components/
│   │   ├── Navbar.jsx       # Responsive header with mobile drawer
│   │   ├── Footer.jsx       # Footer with contact links & capabilities
│   │   └── ContactForm.jsx  # Resend-integrated contact form with honeypot
│   └── lib/
│       ├── resend.js        # Resend SDK client instance
│       └── utils.js         # Class name merge utilities
├── .env.example             # Configuration reference
├── .env.local               # Local secrets (RESEND_API_KEY)
├── jsconfig.json            # Path alias configuration (@/* -> ./src/*)
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # PostCSS Tailwind configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` if not already created:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```ini
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Sender email:
# During development/testing before domain verification:
CONTACT_FROM_EMAIL=Vnoirs <onboarding@resend.dev>

# Once vnoirs.com is verified in your Resend dashboard:
# CONTACT_FROM_EMAIL=Vnoirs Support <cs@vnoirs.com>

# Submissions will be sent to:
CONTACT_TO_EMAIL=cs@vnoirs.com

# Canonical URL:
NEXT_PUBLIC_SITE_URL=https://vnoirs.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📧 Resend Email Integration Details

* **Route:** `/api/contact`
* **Protection:** 
  * Zod schema validation (minimum character counts, valid email syntax).
  * Honeypot field (`botCheck`) to reject spam bots automatically.
  * Graceful fallback simulation when `RESEND_API_KEY` is not yet configured, preventing local crashes.
* **Email Template:** Sends a clean, responsive HTML email with client details, subject topic, direct reply-to headers, and timestamp.
