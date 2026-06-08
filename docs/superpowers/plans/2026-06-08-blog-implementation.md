# Blog System — Viana Consultancy Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Viana Consultancy static HTML site to Next.js 15 and build a complete blog system with CRUD admin panel, Netlify Blobs storage, iron-session auth, and dynamic public blog pages.

**Architecture:** Next.js 15 App Router. CSS from `index.html` ported to `globals.css`. Blog posts stored in Netlify Blobs. Auth via iron-session + bcrypt. Admin panel at `/admin`. Public blog at `/blog` and `/blog/[slug]`. Home page blog section replaced with dynamic latest-3 posts.

**Tech Stack:** Next.js 15, React 19, TypeScript, `@netlify/blobs`, `iron-session@8`, `bcryptjs`, `next-mdx-remote@6`, `lucide-react`, Jest + ts-jest (tests)

---

## File Map

**Created:**
- `package.json`, `next.config.ts`, `tsconfig.json`, `netlify.toml`, `.env.local`
- `src/app/globals.css` — all CSS ported from `index.html`
- `src/app/layout.tsx` — root layout with Nav + Footer
- `src/app/page.tsx` — home page (all sections)
- `src/app/blog/page.tsx` — public blog listing
- `src/app/blog/[slug]/page.tsx` — public post detail
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx` — dashboard
- `src/app/admin/posts/new/page.tsx`
- `src/app/admin/posts/[slug]/edit/page.tsx`
- `src/app/admin/_components/AdminHeader.tsx`
- `src/app/admin/_components/PostsTable.tsx`
- `src/app/admin/_components/PostForm.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/posts/route.ts`
- `src/app/api/posts/[slug]/route.ts`
- `src/components/Nav.tsx`
- `src/components/Footer.tsx`
- `src/components/blog/BlogCard.tsx`
- `src/lib/posts.ts`
- `src/lib/session.ts`
- `src/lib/auth.ts`
- `src/__tests__/lib/posts.test.ts`
- `src/__tests__/lib/auth.test.ts`

**Preserved:** `assets/`, `docs/`, `index.html` (keep until site confirmed working, then delete)

---

## Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `src/app/globals.css` (empty), `src/app/layout.tsx` (empty)

- [ ] **Step 1: Scaffold Next.js in the existing repo**

Run from `/home/guilherme-kodenvis/Documentos/BlackElephant/Parceiros/Patrícia Soares Viana/Viana Consultancy/viana-consultancy-site`:

```bash
npx create-next-app@latest . \
  --typescript \
  --no-tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

When prompted "The directory contains files that could conflict" → choose **Continue**.
When asked "Would you like to use Turbopack?" → **No**.

- [ ] **Step 2: Install blog-specific dependencies**

```bash
npm install iron-session bcryptjs next-mdx-remote lucide-react @netlify/blobs
npm install --save-dev @types/bcryptjs jest ts-jest @types/jest jest-environment-node
```

- [ ] **Step 3: Delete create-next-app boilerplate**

```bash
rm -f src/app/page.tsx src/app/globals.css public/next.svg public/vercel.svg
```

- [ ] **Step 4: Add Jest config to `package.json`**

Open `package.json` and add a `jest` key and update `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "testPathPattern": "src/__tests__"
  }
}
```

- [ ] **Step 5: Verify Next.js boots**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` (will show 404 — that's fine, no pages yet).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project"
```

---

## Task 2: Create netlify.toml and next.config.ts

**Files:**
- Create: `netlify.toml`
- Modify: `next.config.ts`

- [ ] **Step 1: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[dev]
  command = "next dev"
  targetPort = 3000
```

- [ ] **Step 2: Install Netlify plugin**

```bash
npm install --save-dev @netlify/plugin-nextjs
```

- [ ] **Step 3: Write `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Commit**

```bash
git add netlify.toml next.config.ts package.json package-lock.json
git commit -m "feat: add Netlify config and next.config"
```

---

## Task 3: Port global CSS

**Files:**
- Create: `src/app/globals.css`

- [ ] **Step 1: Write `src/app/globals.css`**

Copy all CSS from `index.html` lines 13–878 (the `<style>` block content) and paste into `globals.css`. Then append the admin-specific styles below:

```css
/* ── (paste entire <style> block content from index.html here, without the <style> tags) ── */

/* ══════════════════════════════════
   ADMIN PANEL
══════════════════════════════════ */
.admin-layout {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Poppins', sans-serif;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navy);
  padding: 14px 0;
  box-shadow: 0 2px 12px rgba(0,0,0,.25);
}

.admin-header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
}

.admin-header__logo { height: 32px; filter: brightness(0) invert(1); }

.admin-header__nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.admin-header__nav a {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,.7);
  padding: 6px 14px;
  border-radius: 6px;
  transition: all var(--transition);
}

.admin-header__nav a:hover,
.admin-header__nav a.active {
  background: rgba(255,255,255,.1);
  color: var(--white);
}

.admin-content { padding: 40px 0; }

.admin-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  overflow: hidden;
}

.admin-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.admin-card__title {
  font-family: 'Marcellus', serif;
  font-size: 1.2rem;
  color: var(--navy);
}

/* Posts table */
.posts-table { width: 100%; border-collapse: collapse; }

.posts-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: rgba(0,0,0,.4);
  border-bottom: 2px solid var(--border);
}

.posts-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.posts-table tr:hover td { background: rgba(0,0,0,.01); }

.posts-table__title { font-weight: 500; color: var(--navy); }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge--published { background: #d1fae5; color: #065f46; }
.status-badge--draft     { background: #fef3c7; color: #92400e; }

.table-actions { display: flex; gap: 8px; align-items: center; }

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text);
  transition: all var(--transition);
}

.icon-btn:hover { background: var(--bg); color: var(--navy); }
.icon-btn--danger:hover { background: #fee2e2; color: #dc2626; }
.icon-btn--success:hover { background: #d1fae5; color: #059669; }

/* Post editor */
.post-editor { padding: 24px; }

.form-group { margin-bottom: 20px; }

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--navy);
  margin-bottom: 6px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: var(--navy);
  background: var(--white);
  transition: border-color var(--transition);
  outline: none;
}

.form-input:focus,
.form-textarea:focus { border-color: var(--gold); }

.form-textarea { min-height: 420px; resize: vertical; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.editor-tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 20px; }

.editor-tab {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all var(--transition);
}

.editor-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.toolbar-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--white);
  cursor: pointer;
  color: var(--navy);
  transition: all var(--transition);
}

.toolbar-btn:hover { border-color: var(--gold); color: var(--gold); }

.preview-content {
  min-height: 420px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
}

.toggle-wrap { display: flex; align-items: center; gap: 12px; }

.toggle {
  position: relative;
  width: 42px;
  height: 24px;
  cursor: pointer;
}

.toggle input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--border);
  border-radius: 24px;
  transition: background var(--transition);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform var(--transition);
}

.toggle input:checked + .toggle-slider { background: var(--gold); }
.toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

/* Toast */
.toast-container {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
  animation: slideUp 200ms ease;
}

.toast--success { background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; }
.toast--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Login page */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--navy);
}

.login-card {
  background: var(--white);
  border-radius: 12px;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 64px rgba(0,0,0,.4);
}

.login-card__logo { height: 40px; margin: 0 auto 32px; display: block; }

.login-card h1 {
  font-family: 'Marcellus', serif;
  font-size: 1.5rem;
  color: var(--navy);
  text-align: center;
  margin-bottom: 28px;
}

.login-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 16px;
}

/* Blog post content typography */
.post-content h1 { font-family: 'Marcellus', serif; font-size: 2.4rem; color: var(--navy); margin: 2rem 0 1rem; line-height: 1.2; }
.post-content h2 { font-family: 'Marcellus', serif; font-size: 1.8rem; color: var(--navy); margin: 2rem 0 .75rem; }
.post-content h3 { font-family: 'Marcellus', serif; font-size: 1.35rem; color: var(--navy); margin: 1.5rem 0 .5rem; }
.post-content p  { margin: 1rem 0; line-height: 1.8; font-size: 15px; color: var(--text); }
.post-content ul, .post-content ol { margin: 1rem 0 1rem 1.5rem; }
.post-content li { margin-bottom: .4rem; line-height: 1.7; color: var(--text); }
.post-content blockquote { border-left: 3px solid var(--gold); padding-left: 20px; margin: 1.5rem 0; font-style: italic; color: var(--navy); font-size: 1.1rem; }
.post-content a  { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
.post-content strong { color: var(--navy); font-weight: 600; }
.post-content code { background: var(--bg); padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: 'Courier New', monospace; }
.post-content pre { background: var(--navy); color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
.post-content img { border-radius: 8px; margin: 1.5rem auto; max-width: 100%; }
.post-content hr  { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: port global CSS from index.html"
```

---

## Task 4: Create shared components — Nav and Footer

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMobileOpen(false)

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav" role="navigation" aria-label="Site navigation">
      <div className="container">
        <div className="nav__inner">
          <Link href="/" className="nav__logo" aria-label="Patrícia Viana — Home">
            <Image src="/images/logo.png" alt="Patrícia Viana Law Firm logo" width={120} height={38} priority />
          </Link>

          <ul className="nav__menu" role="list">
            <li><Link href="/#home">Home</Link></li>
            <li><Link href="/#sobre">About Us</Link></li>
            <li><Link href="/#areasdeatuacao">Services</Link></li>
            <li><Link href="/#equipe">Team</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/#contato">Contact</Link></li>
          </ul>

          <div className="nav__socials" aria-label="Social media">
            <a href="https://www.instagram.com/patricia_viana_lawyer" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
            <a href="http://wa.me/351960174940" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100087269040601" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
            </a>
          </div>

          <button
            className="nav__toggle"
            id="navToggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <nav className={`nav__mobile${mobileOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        <Link href="/#home" onClick={close}>Home</Link>
        <Link href="/#sobre" onClick={close}>About Us</Link>
        <Link href="/#areasdeatuacao" onClick={close}>Services</Link>
        <Link href="/#equipe" onClick={close}>Team</Link>
        <Link href="/blog" onClick={close}>Blog</Link>
        <Link href="/#contato" onClick={close}>Contact</Link>
      </nav>
    </nav>
  )
}
```

- [ ] **Step 2: Write `src/components/Footer.tsx`**

```typescript
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Image src="/images/logo.png" alt="Patrícia Viana Law Firm" className="footer__logo" width={120} height={36} />
            <p className="footer__tagline">If it&apos;s important to you, it&apos;s important to us!</p>
            <div className="footer__socials" aria-label="Social media links">
              <a href="https://www.facebook.com/profile.php?id=100087269040601" className="footer__social" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
              </a>
              <a href="https://www.instagram.com/patricia_viana_lawyer/" className="footer__social" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </a>
              <a href="http://wa.me/351960174940" className="footer__social" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer__col-title">Institutional</h4>
            <ul className="footer__links" role="list">
              <li><Link href="/#home">Home</Link></li>
              <li><Link href="/#sobre">About us</Link></li>
              <li><Link href="/#areasdeatuacao">Services</Link></li>
              <li><Link href="/#equipe">Team</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/#contato">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__col-title">Services</h4>
            <ul className="footer__links" role="list">
              <li><Link href="/#areasdeatuacao">Consultation</Link></li>
              <li><Link href="/#areasdeatuacao">Legal Residency Permits</Link></li>
              <li><Link href="/#areasdeatuacao">Certified Translations</Link></li>
              <li><Link href="/#areasdeatuacao">Litigations</Link></li>
              <li><Link href="/#areasdeatuacao">Visa Application Assistance</Link></li>
              <li><Link href="/#areasdeatuacao">Company Incorporation</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">Patrícia Viana Lawyer Copyright ® 2024 - All rights reserved.</p>
          <nav className="footer__legal" aria-label="Legal links">
            <a href="https://vianaconsultancy.com/politica-de-privacidade/" target="_blank" rel="noopener">Privacy Policy</a>
            <a href="https://vianaconsultancy.com/terms-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a>
            <a href="https://vianaconsultancy.com/politica-de-privacidade/" target="_blank" rel="noopener">Cookie Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Copy logo to public**

```bash
cp "/home/guilherme-kodenvis/Documentos/BlackElephant/Parceiros/Patrícia Soares Viana/Viana Consultancy/viana-consultancy-site/assets/images/logo.png" \
   "/home/guilherme-kodenvis/Documentos/BlackElephant/Parceiros/Patrícia Soares Viana/Viana Consultancy/viana-consultancy-site/public/images/logo.png"
```

Create `public/images/` dir first if needed: `mkdir -p public/images`

- [ ] **Step 4: Commit**

```bash
git add src/components/ public/images/
git commit -m "feat: add Nav and Footer components"
```

---

## Task 5: Create root layout and copy public assets

**Files:**
- Create: `src/app/layout.tsx`
- Modify: copy all site images to `public/images/`

- [ ] **Step 1: Copy all site images to public**

```bash
cp assets/images/* public/images/
```

- [ ] **Step 2: Write `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Patrícia Viana — Lawyer',
  description: 'Patrícia Viana Law Firm — Expert Portuguese immigration attorneys helping you build a new life in Portugal.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <a className="wa-btn" href="http://wa.me/351960174940" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx public/images/
git commit -m "feat: root layout with Nav, Footer, WhatsApp button"
```

---

## Task 6: Create home page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/_components/TestimonialsSlider.tsx`

- [ ] **Step 1: Write `src/app/_components/TestimonialsSlider.tsx`**

```typescript
'use client'

import { useRef, useState } from 'react'

const CARD_W = 340 + 24

const testimonials = [
  { initial: 'H', name: 'Hendranus Vermeulen', source: 'Google Review', text: "I highly recommend Patricia, an exceptional immigration lawyer who impressed me with her professionalism, warmth, and extensive expertise. She went above and beyond to assist me, helping me obtain my NIF number and open a bank account. Patricia's deep knowledge of Portuguese immigration laws was invaluable, guiding me through the process with clarity and ease." },
  { initial: 'G', name: 'Gala Oussama', source: 'Google Review', text: 'Excellent lawyer. She helped me obtain the residence card within 25 days. I will never forget your kindness. Thank you very much.' },
  { initial: 'N', name: 'Nazim Uddin', source: 'Google Review', text: 'From the beginning, very helpful, a unique professional, I recommend his work. We need more professionals like this, of excellence! Very satisfied.' },
  { initial: 'R', name: 'Rabah Touamen', source: 'Google Review', text: 'Muito obrigado, consegui minha residência de volta, graças a você.' },
  { initial: 'R', name: 'Rehan Khan', source: 'Google Review', text: 'Excellent service.. really I recommend for others.. Thank you very much.' },
  { initial: 'D', name: 'Dja Mel', source: 'Google Review', text: 'I had the honor to work with you as my lawyer, all the best for you.' },
]

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 15, height: 15, fill: 'var(--gold)' }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export default function TestimonialsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const scrollL = useRef(0)

  const goTo = (i: number) => {
    sliderRef.current?.scrollTo({ left: i * CARD_W, behavior: 'smooth' })
    setActive(i)
  }

  const onScroll = () => {
    if (!sliderRef.current) return
    setActive(Math.round(sliderRef.current.scrollLeft / CARD_W))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    startX.current = e.pageX - (sliderRef.current?.offsetLeft ?? 0)
    scrollL.current = sliderRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !sliderRef.current) return
    e.preventDefault()
    sliderRef.current.scrollLeft = scrollL.current - (e.pageX - (sliderRef.current.offsetLeft) - startX.current)
  }

  return (
    <div className="testimonials__wrap">
      <div
        ref={sliderRef}
        className={`testimonials__slider${dragging ? ' dragging' : ''}`}
        role="list"
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={() => setDragging(false)}
        onMouseMove={onMouseMove}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="tcard" role="listitem">
            <div className="tcard__stars" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, j) => <Star key={j} />)}
            </div>
            <p className="tcard__text">{t.text}</p>
            <div className="tcard__author">
              <div className="tcard__avatar" aria-hidden="true">{t.initial}</div>
              <div>
                <div className="tcard__name">{t.name}</div>
                <div className="tcard__source">{t.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonials__nav" aria-label="Testimonials navigation" role="group">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testimonials__dot${active === i ? ' active' : ''}`}
            aria-label={`Review ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/app/page.tsx`**

This is an async server component that fetches the latest 3 published posts.

```typescript
import Image from 'next/image'
import Link from 'next/link'
import TestimonialsSlider from './_components/TestimonialsSlider'
import { getPublishedPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const dynamic = 'force-dynamic'

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

export default async function HomePage() {
  let posts: Post[] = []
  try {
    posts = (await getPublishedPosts()).slice(0, 3)
  } catch {
    // Blobs not available in local dev without netlify dev — show empty state
  }

  return (
    <>
      {/* HERO */}
      <section className="hero" id="home" aria-label="Hero">
        <div className="hero__content">
          <h1 className="hero__title">A Worry-Free Future Awaits You</h1>
          <p className="hero__sub">Our mission is to simplify the immigration process, ensuring you can focus on starting your new life in Portugal without stress.</p>
          <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Your Consultation
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section section--white" id="sobre" aria-label="About us">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <div className="section-tag">About Us</div>
              <h2 className="section-title">Patrícia Viana<br/>Law Firm</h2>
              <p><strong>Was established in 2022 with a mission to simplify the immigration process for clients worldwide.</strong> As a team of qualified Portuguese attorneys, we specialize in providing personalized legal support to help you navigate the complexities of moving to Portugal.</p>
              <p>At Patrícia Viana Law Firm, we pride ourselves on our deep understanding of Portuguese immigration law, allowing us to offer accurate and efficient solutions tailored to your unique needs. Our clients trust us for our dedication, professionalism, and commitment to making their dreams of living in Portugal a reality.</p>
            </div>
            <div className="about__image">
              <Image src="/images/patricia-photo.jpg" alt="Patrícia Viana, founding attorney" width={683} height={1024} loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section" id="areasdeatuacao" aria-label="Our services">
        <div className="container">
          <div className="services__header">
            <div className="section-tag">What We Do</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Drawing from our extensive experience working with clients of diverse nationalities, we&apos;ve been able to develop new strategies and services tailored to meet their unique needs.</p>
          </div>
          <div className="services__grid" role="list">
            {[
              { icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>, title: 'Consultations', desc: 'Receive expert advice on planning your move to Portugal, tailored to your individual needs and goals.' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>, title: 'Legal Residency Permits', desc: 'Comprehensive guidance and support to help you obtain your legal residency permit in Portugal.' },
              { icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>, title: 'Certified Translations', desc: 'Our team delivers precise and legally recognized translations for official documents.' },
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: 'Litigations', desc: 'We handle litigation cases with expertise, safeguarding your rights and striving for the best possible outcomes in court.' },
              { icon: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, title: 'Visa Application Assistance', desc: 'We streamline the visa application process, ensuring accuracy and efficiency every step of the way.' },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>, title: 'Company Incorporation', desc: 'We assist in incorporating your company, ensuring legal compliance and maximizing tax benefits.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="service-card" role="listitem">
                <svg className="service-card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
                <h3 className="service-card__title">{title}</h3>
                <p className="service-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog section section--white" id="blog" aria-label="Blog">
        <div className="container">
          <div className="blog__header">
            <div className="section-tag">Insights</div>
            <h2 className="section-title">Blog</h2>
            <p className="section-sub">Be sure to check out the latest posts on our blog</p>
          </div>
          {posts.length > 0 ? (
            <div className="blog__grid">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text)', padding: '40px 0' }}>Articles coming soon.</p>
          )}
          <div className="blog__cta">
            <Link href="/blog" className="btn btn-outline-gold">View All</Link>
          </div>
        </div>
      </section>

      {/* TEAM HEADER */}
      <div className="team-header" aria-label="Team section header">
        <div className="container">
          <div className="section-tag">Our People</div>
          <h2 className="section-title">Our Team</h2>
          <p className="section-sub">We have a professional team that is specialized in what it does</p>
        </div>
      </div>

      {/* TEAM */}
      <section className="team section" id="equipe" aria-label="Meet the team">
        <div className="container">
          <div className="team__grid">
            {[
              { img: '/images/patricia-viana-profile.png', name: 'Patrícia Viana', role: 'Founder & Lead Attorney', bio: "Patricia Viana has a bachelor's degree in law from the Pontifical Catholic University and is an attorney licensed in Portugal and Brazil. She does have great experience in Administrative Litigation. In 2023, she did the course of Administrative Litigation applied to Portuguese nationality and concluded the postgraduate studies in Administrative and Fiscal Litigation in Portugal. In the year 2024, she has already participated in over one hundred judicial cases about foreign nationals. She speaks fluent Portuguese, English, and Spanish and is now studying French." },
              { img: '/images/bruna-xavier-profile.png', name: 'Bruna Xavier', role: 'Assistant Attorney', bio: 'Bruna Xavier is also an attorney enrolled with the Portuguese Bar Association, specializing in Administrative and Criminal Law. She has contributed quite actively to the procedural management of our firm.' },
            ].map(({ img, name, role, bio }) => (
              <div key={name} className="team-card">
                <div className="team-card__photo">
                  <Image className="team-card__img" src={img} alt={`${name} — ${role}`} width={600} height={380} loading="lazy" />
                  <div className="team-card__overlay">
                    <h3 className="team-card__name">{name}</h3>
                    <div className="team-card__role">{role}</div>
                  </div>
                </div>
                <div className="team-card__body">
                  <p className="team-card__bio">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials section" aria-label="Client testimonials">
        <div className="container">
          <div className="section-tag">What Clients Say</div>
          <h2 className="section-title">Feedback</h2>
          <p className="section-sub">Check out what our clients have to say about their experience with us.</p>
          <TestimonialsSlider />
        </div>
      </section>

      {/* QUOTE */}
      <div className="quote" aria-label="Quote">
        <div className="container">
          <blockquote>
            &ldquo;Immigration is not just about moving to a new country; it&apos;s about building a new life and embracing new possibilities.&rdquo;
          </blockquote>
          <cite>–</cite>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact section section--white" id="contato" aria-label="Contact">
        <div className="container">
          <div className="contact__header">
            <div className="section-tag">Get in Touch</div>
            <h2 className="section-title">Contact</h2>
          </div>
          <div className="contact__grid">
            <div className="contact__map">
              <iframe
                src="https://maps.google.com/maps?q=Av.%20Elias%20Garcia%2C%20123-A%2C%201050-098%2C%20Lisboa&t=m&z=16&output=embed&iwloc=near"
                title="Av. Elias Garcia, 123-A, 1050-098, Lisboa"
                aria-label="Office location map"
                loading="lazy"
              />
            </div>
            <div className="contact__right">
              <h3>Get in Touch</h3>
              <p>We&apos;re here to help you start your new chapter in Portugal.</p>
              <div role="list">
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.8 12.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.71 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div className="contact__item-body">
                    <a href="tel:+351960174940">+351 960 174 940</a><br/>
                    <span style={{ fontSize:12, color:'var(--text)' }}>Call to national mobile network</span>
                  </div>
                </div>
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div className="contact__item-body">
                    <a href="mailto:enquiries@vianaconsultancy.com">enquiries@vianaconsultancy.com</a>
                  </div>
                </div>
                <div className="contact__item" role="listitem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width:18, height:18, color:'var(--gold)', flexShrink:0, marginTop:2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div className="contact__item-body">
                    <a href="https://www.google.com/maps/dir//Av.+Elias+Garcia+123A,+1050-031+Lisboa" target="_blank" rel="noopener">
                      Av. Elias Garcia, 123-A, 1050-098, Lisboa.
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/app/_components/TestimonialsSlider.tsx
git commit -m "feat: home page — all sections ported to Next.js"
```

---

## Task 7: Create lib/auth.ts with tests

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/__tests__/lib/auth.test.ts`
- Create: `src/lib/session.ts`

- [ ] **Step 1: Write failing tests `src/__tests__/lib/auth.test.ts`**

```typescript
import { verifyPassword, hashPassword } from '@/lib/auth'

describe('auth', () => {
  it('hashPassword returns a bcrypt hash', async () => {
    const hash = await hashPassword('mypassword')
    expect(hash).toMatch(/^\$2b\$/)
  })

  it('verifyPassword returns true for correct password', async () => {
    const hash = await hashPassword('correct')
    expect(await verifyPassword('correct', hash)).toBe(true)
  })

  it('verifyPassword returns false for wrong password', async () => {
    const hash = await hashPassword('correct')
    expect(await verifyPassword('wrong', hash)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=auth
```

Expected: FAIL — module `@/lib/auth` not found.

- [ ] **Step 3: Write `src/lib/auth.ts`**

```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=auth
```

Expected: 3 tests PASS.

- [ ] **Step 5: Write `src/lib/session.ts`**

```typescript
import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export type SessionData = {
  user?: { username: string }
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? 'placeholder-replace-with-32-char-secret-minimum',
  cookieName: 'viana-admin-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function requireAuth(): Promise<boolean> {
  const session = await getSession()
  return session.isLoggedIn === true
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/lib/session.ts src/__tests__/lib/auth.test.ts
git commit -m "feat: auth and session lib with tests"
```

---

## Task 8: Create lib/posts.ts with tests (Netlify Blobs)

**Files:**
- Create: `src/lib/posts.ts`
- Create: `src/__tests__/lib/posts.test.ts`

- [ ] **Step 1: Write failing tests `src/__tests__/lib/posts.test.ts`**

```typescript
// Mock @netlify/blobs with an in-memory store
const store = new Map<string, string>()

jest.mock('@netlify/blobs', () => ({
  getStore: () => ({
    get: async (key: string, opts?: { type?: string }) => {
      const val = store.get(key)
      if (val === undefined) return null
      return opts?.type === 'json' ? JSON.parse(val) : val
    },
    set: async (key: string, value: string) => { store.set(key, value) },
    delete: async (key: string) => { store.delete(key) },
  }),
}))

import { createPost, getAllPosts, getPublishedPosts, getPostBySlug, updatePost, deletePost } from '@/lib/posts'

beforeEach(() => store.clear())

describe('posts CRUD', () => {
  it('createPost saves a post and returns it with a slug', async () => {
    const post = await createPost({ title: 'Hello World', content: '# Hi', excerpt: 'short', author: 'Patrícia', published: true, tags: ['visa'], date: '2026-06-08' })
    expect(post.slug).toBe('hello-world')
    expect(post.title).toBe('Hello World')
  })

  it('getAllPosts returns all created posts', async () => {
    await createPost({ title: 'Post A', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' })
    await createPost({ title: 'Post B', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-02' })
    const all = await getAllPosts()
    expect(all).toHaveLength(2)
  })

  it('getPublishedPosts returns only published posts sorted by date desc', async () => {
    await createPost({ title: 'Old', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-01-01' })
    await createPost({ title: 'New', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-01' })
    await createPost({ title: 'Draft', content: '', excerpt: '', author: '', published: false, tags: [], date: '2026-06-05' })
    const pub = await getPublishedPosts()
    expect(pub).toHaveLength(2)
    expect(pub[0].title).toBe('New')
  })

  it('getPostBySlug returns post or null', async () => {
    await createPost({ title: 'Find Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' })
    const found = await getPostBySlug('find-me')
    expect(found?.title).toBe('Find Me')
    const missing = await getPostBySlug('no-such-post')
    expect(missing).toBeNull()
  })

  it('updatePost merges changes', async () => {
    await createPost({ title: 'Original', content: 'old', excerpt: '', author: '', published: false, tags: [], date: '2026-06-08' })
    const updated = await updatePost('original', { published: true, content: 'new' })
    expect(updated?.published).toBe(true)
    expect(updated?.content).toBe('new')
    expect(updated?.title).toBe('Original')
  })

  it('deletePost removes the post and returns true', async () => {
    await createPost({ title: 'Delete Me', content: '', excerpt: '', author: '', published: true, tags: [], date: '2026-06-08' })
    const ok = await deletePost('delete-me')
    expect(ok).toBe(true)
    expect(await getPostBySlug('delete-me')).toBeNull()
    expect(await getAllPosts()).toHaveLength(0)
  })

  it('deletePost returns false for non-existent slug', async () => {
    const ok = await deletePost('ghost')
    expect(ok).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=posts
```

Expected: FAIL — module `@/lib/posts` not found.

- [ ] **Step 3: Write `src/lib/posts.ts`**

```typescript
import { getStore } from '@netlify/blobs'

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  published: boolean
  tags: string[]
  content: string
  coverImage?: string
}

function store() {
  return getStore('posts')
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getIndex(): Promise<string[]> {
  const s = store()
  const idx = await s.get('index', { type: 'json' }) as string[] | null
  return idx ?? []
}

async function saveIndex(index: string[]): Promise<void> {
  await store().set('index', JSON.stringify(index))
}

export async function getAllPosts(): Promise<Post[]> {
  const s = store()
  const index = await getIndex()
  const posts = await Promise.all(
    index.map(slug => s.get(`post:${slug}`, { type: 'json' }) as Promise<Post | null>)
  )
  return posts.filter((p): p is Post => p !== null)
}

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getAllPosts()
  return all
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await store().get(`post:${slug}`, { type: 'json' }) as Post | null
  return post
}

export async function createPost(
  data: Omit<Post, 'slug'> & { slug?: string }
): Promise<Post> {
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title)
  const post: Post = {
    slug,
    title: data.title,
    date: data.date || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt ?? '',
    author: data.author ?? 'Patrícia Viana',
    published: data.published ?? false,
    tags: data.tags ?? [],
    content: data.content ?? '',
    ...(data.coverImage ? { coverImage: data.coverImage } : {}),
  }
  await store().set(`post:${slug}`, JSON.stringify(post))
  const index = await getIndex()
  if (!index.includes(slug)) {
    await saveIndex([...index, slug])
  }
  return post
}

export async function updatePost(
  slug: string,
  updates: Partial<Omit<Post, 'slug'>>
): Promise<Post | null> {
  const existing = await getPostBySlug(slug)
  if (!existing) return null
  const updated: Post = { ...existing, ...updates }
  await store().set(`post:${slug}`, JSON.stringify(updated))
  return updated
}

export async function deletePost(slug: string): Promise<boolean> {
  const existing = await getPostBySlug(slug)
  if (!existing) return false
  await store().delete(`post:${slug}`)
  const index = await getIndex()
  await saveIndex(index.filter(s => s !== slug))
  return true
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=posts
```

Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/posts.ts src/__tests__/lib/posts.test.ts
git commit -m "feat: blog CRUD lib using Netlify Blobs with tests"
```

---

## Task 9: Create API routes — auth and posts

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/posts/route.ts`
- Create: `src/app/api/posts/[slug]/route.ts`

- [ ] **Step 1: Write `src/app/api/auth/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const validUser = username === process.env.ADMIN_USER
  const validPass = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? '')
  if (!validUser || !validPass) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const session = await getSession()
  session.isLoggedIn = true
  session.user = { username }
  await session.save()
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Write `src/app/api/auth/logout/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function DELETE() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 3: Write `src/app/api/posts/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/posts'
import { requireAuth } from '@/lib/session'

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const posts = await getAllPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  if (!data.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
```

- [ ] **Step 4: Write `src/app/api/posts/[slug]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, updatePost, deletePost } from '@/lib/posts'
import { requireAuth } from '@/lib/session'

type Ctx = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const updates = await req.json()
  const post = await updatePost(slug, updates)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const ok = await deletePost(slug)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/
git commit -m "feat: auth and posts API routes"
```

---

## Task 10: Create BlogCard component and public blog pages

**Files:**
- Create: `src/components/blog/BlogCard.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Write `src/components/blog/BlogCard.tsx`**

```typescript
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/posts'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="blog-card">
      <div className="blog-card__img-wrap">
        {post.coverImage ? (
          <Image
            className="blog-card__img"
            src={post.coverImage}
            alt={post.title}
            width={600}
            height={175}
            style={{ objectFit: 'cover', height: 175, width: '100%' }}
          />
        ) : (
          <div className="blog-card__img" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--gold) 100%)', height: 175 }} />
        )}
      </div>
      <div className="blog-card__body">
        <div className="blog-card__cat">
          {post.tags.slice(0, 2).join(' · ') || 'Blog'}
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        {post.excerpt && <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 12, lineHeight: 1.6 }}>{post.excerpt}</p>}
        <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 10 }}>
          {post.author} · {formatDate(post.date)}
        </div>
        <Link href={`/blog/${post.slug}`} className="blog-card__link" aria-label={`Read ${post.title}`}>
          Read More <ArrowRight />
        </Link>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Write `src/app/blog/page.tsx`**

```typescript
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog — Patrícia Viana Law Firm',
  description: 'Insights on Portuguese immigration law, residency, visas and more.',
}

export default async function BlogPage() {
  let posts = await getPublishedPosts()

  return (
    <>
      <section style={{ paddingTop: 120, paddingBottom: 60, background: 'var(--navy)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Insights</div>
          <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: 16 }}>Blog</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
            Expert insights on Portuguese immigration law, residency permits, visas, and building your new life in Portugal.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog__grid">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text)', padding: '60px 0', fontSize: 15 }}>
              New articles are on their way.
            </p>
          )}
        </div>
      </section>

      <section className="section section--white" style={{ textAlign: 'center' }}>
        <div className="container">
          <div className="section-tag" style={{ justifyContent: 'center' }}>Ready to start?</div>
          <h2 className="section-title" style={{ marginBottom: 20 }}>Book Your Consultation</h2>
          <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Write `src/app/blog/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post || !post.published) notFound()

  return (
    <>
      {post.coverImage && (
        <div style={{ width: '100%', height: 380, position: 'relative', marginTop: 72 }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(1,19,66,.4)' }} />
        </div>
      )}

      <section className="section section--white" style={{ paddingTop: post.coverImage ? 48 : 120 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gold)', marginBottom: 32 }}>
            ← Back to Blog
          </Link>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {post.tags.map(tag => (
              <span key={tag} className="blog-card__cat" style={{ background: 'var(--gold-pale)', padding: '2px 10px', borderRadius: 20 }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: 'Marcellus, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>

          <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 40 }}>
            By <strong style={{ color: 'var(--navy)' }}>{post.author}</strong> · {formatDate(post.date)}
          </p>

          <div className="post-content">
            <MDXRemote source={post.content} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 60, paddingTop: 32, textAlign: 'center' }}>
            <p style={{ color: 'var(--text)', marginBottom: 20 }}>Need legal assistance with your move to Portugal?</p>
            <a href="https://vianaconsultancy.com/contact/" className="btn btn-gold" target="_blank" rel="noopener">
              Book a Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/ src/app/blog/
git commit -m "feat: BlogCard component and public blog pages"
```

---

## Task 11: Admin login page

**Files:**
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Write `src/app/admin/login/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        setError('Invalid username or password.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Image src="/images/logo.png" alt="Patrícia Viana" className="login-card__logo" width={160} height={40} />
        <h1>Admin Panel</h1>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/login/
git commit -m "feat: admin login page"
```

---

## Task 12: Admin components — AdminHeader and PostsTable

**Files:**
- Create: `src/app/admin/_components/AdminHeader.tsx`
- Create: `src/app/admin/_components/PostsTable.tsx`

- [ ] **Step 1: Write `src/app/admin/_components/AdminHeader.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <header className="admin-header">
      <div className="container">
        <div className="admin-header__inner">
          <Image src="/images/logo.png" alt="Patrícia Viana" className="admin-header__logo" width={120} height={32} />
          <nav className="admin-header__nav">
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
            <Link href="/admin/posts/new" className={pathname === '/admin/posts/new' ? 'active' : ''}>New Post</Link>
            <button
              onClick={logout}
              disabled={loading}
              style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: 'rgba(255,255,255,.7)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            >
              {loading ? '…' : 'Logout'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Write `src/app/admin/_components/PostsTable.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Pencil, Trash2, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/posts'

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className="toast-container">
      <div className={`toast toast--${type}`}>{msg}</div>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const togglePublished = async (post: Post) => {
    setLoadingSlug(post.slug)
    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    setLoadingSlug(null)
    if (res.ok) {
      setPosts(prev => prev.map(p => p.slug === post.slug ? { ...p, published: !p.published } : p))
      showToast(post.published ? 'Post unpublished.' : 'Post published.', 'success')
    } else {
      showToast('Failed to update post.', 'error')
    }
  }

  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setLoadingSlug(post.slug)
    const res = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' })
    setLoadingSlug(null)
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.slug !== post.slug))
      showToast('Post deleted.', 'success')
    } else {
      showToast('Failed to delete post.', 'error')
    }
  }

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ overflowX: 'auto' }}>
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text)' }}>No posts yet. <Link href="/admin/posts/new" style={{ color: 'var(--gold)' }}>Create the first one →</Link></td></tr>
            ) : posts.map(post => (
              <tr key={post.slug}>
                <td className="posts-table__title">{post.title}</td>
                <td>{post.author}</td>
                <td>{formatDate(post.date)}</td>
                <td>
                  <span className={`status-badge status-badge--${post.published ? 'published' : 'draft'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className={`icon-btn icon-btn--success`}
                      onClick={() => togglePublished(post)}
                      disabled={loadingSlug === post.slug}
                      title={post.published ? 'Unpublish' : 'Publish'}
                    >
                      {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    {post.published && (
                      <a className="icon-btn" href={`/blog/${post.slug}`} target="_blank" rel="noopener" title="View post">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <Link className="icon-btn" href={`/admin/posts/${post.slug}/edit`} title="Edit">
                      <Pencil size={15} />
                    </Link>
                    <button
                      className="icon-btn icon-btn--danger"
                      onClick={() => deletePost(post)}
                      disabled={loadingSlug === post.slug}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/_components/
git commit -m "feat: AdminHeader and PostsTable components"
```

---

## Task 13: Admin PostForm component

**Files:**
- Create: `src/app/admin/_components/PostForm.tsx`

- [ ] **Step 1: Write `src/app/admin/_components/PostForm.tsx`**

```typescript
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

type PostFormProps = {
  initialPost?: Post
  mode: 'create' | 'edit'
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function PostForm({ initialPost, mode }: PostFormProps) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [slug, setSlug] = useState(initialPost?.slug ?? '')
  const [author, setAuthor] = useState(initialPost?.author ?? 'Patrícia Viana')
  const [date, setDate] = useState(initialPost?.date ?? new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(initialPost?.tags.join(', ') ?? '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '')
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? '')
  const [published, setPublished] = useState(initialPost?.published ?? false)
  const [content, setContent] = useState(initialPost?.content ?? '')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (mode === 'create') setSlug(slugify(v))
  }

  const insertAt = (before: string, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  const toolbar = [
    { label: 'H1', action: () => insertAt('# ') },
    { label: 'H2', action: () => insertAt('## ') },
    { label: 'H3', action: () => insertAt('### ') },
    { label: 'B', action: () => insertAt('**', '**') },
    { label: 'I', action: () => insertAt('_', '_') },
    { label: '"', action: () => insertAt('\n> ') },
  ]

  const handleSave = async () => {
    setError('')
    if (!title.trim()) { setError('Title is required.'); return }
    setSaving(true)
    const payload = {
      title, slug, author, date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt, coverImage, published, content,
    }
    const url = mode === 'create' ? '/api/posts' : `/api/posts/${initialPost!.slug}`
    const method = mode === 'create' ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) {
      const saved = await res.json()
      showToast(mode === 'create' ? 'Post created!' : 'Post updated!')
      if (mode === 'create') router.push(`/admin/posts/${saved.slug}/edit`)
    } else {
      const err = await res.json().catch(() => ({}))
      setError(err.error ?? 'Failed to save post.')
    }
  }

  return (
    <div className="post-editor">
      {toast && (
        <div className="toast-container">
          <div className="toast toast--success">{toast}</div>
        </div>
      )}

      {error && <div className="login-error" style={{ marginBottom: 20 }}>{error}</div>}

      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">Title *</label>
        <input id="title" type="text" className="form-input" value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
      </div>

      {/* Slug + Author row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="slug">Slug</label>
          <input id="slug" type="text" className="form-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="url-slug" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="author">Author</label>
          <input id="author" type="text" className="form-input" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
      </div>

      {/* Date + Tags row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input id="date" type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" type="text" className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="visa, residency, Portugal" />
        </div>
      </div>

      {/* Excerpt */}
      <div className="form-group">
        <label className="form-label" htmlFor="excerpt">Excerpt</label>
        <input id="excerpt" type="text" className="form-input" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown in blog cards" />
      </div>

      {/* Cover image */}
      <div className="form-group">
        <label className="form-label" htmlFor="coverImage">Cover Image URL</label>
        <input id="coverImage" type="url" className="form-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://example.com/image.jpg" />
      </div>

      {/* Published toggle */}
      <div className="form-group">
        <div className="toggle-wrap">
          <label className="toggle" htmlFor="published">
            <input id="published" type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <span className="form-label" style={{ marginBottom: 0 }}>Published</span>
        </div>
      </div>

      {/* Content editor */}
      <div className="form-group">
        <label className="form-label">Content (Markdown)</label>
        <div className="editor-tabs">
          <button className={`editor-tab${tab === 'write' ? ' active' : ''}`} onClick={() => setTab('write')}>Write</button>
          <button className={`editor-tab${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>Preview</button>
        </div>

        {tab === 'write' && (
          <>
            <div className="editor-toolbar">
              {toolbar.map(t => (
                <button key={t.label} className="toolbar-btn" onClick={t.action} type="button">{t.label}</button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post in Markdown..."
            />
          </>
        )}

        {tab === 'preview' && (
          <div className="preview-content post-content" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(content) }} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={() => router.push('/admin')} className="btn btn-outline-gold" type="button">Cancel</button>
        <button onClick={handleSave} className="btn btn-gold" disabled={saving} type="button">
          {saving ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Update Post'}
        </button>
      </div>
    </div>
  )
}

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h1-6ulbp])/gm, '')
    || '<p>' + md + '</p>'
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/_components/PostForm.tsx
git commit -m "feat: PostForm component with markdown editor and live preview"
```

---

## Task 14: Admin dashboard and post pages

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/posts/new/page.tsx`
- Create: `src/app/admin/posts/[slug]/edit/page.tsx`
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Write `src/app/admin/layout.tsx`**

This layout wraps all admin pages and redirects unauthenticated users.

```typescript
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import AdminHeader from './_components/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await requireAuth()
  if (!authed) redirect('/admin/login')
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/app/admin/page.tsx`**

```typescript
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostsTable from './_components/PostsTable'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let posts = await getAllPosts()
  posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Posts ({posts.length})</h2>
          <Link href="/admin/posts/new" className="btn btn-gold" style={{ padding: '9px 20px', fontSize: 13 }}>
            + New Post
          </Link>
        </div>
        <PostsTable initialPosts={posts} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `src/app/admin/posts/new/page.tsx`**

```typescript
import PostForm from '../../_components/PostForm'

export default function NewPostPage() {
  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">New Post</h2>
        </div>
        <PostForm mode="create" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `src/app/admin/posts/[slug]/edit/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import PostForm from '../../../_components/PostForm'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Edit: {post.title}</h2>
        </div>
        <PostForm mode="edit" initialPost={post} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/
git commit -m "feat: admin dashboard, new/edit post pages with auth guard"
```

---

## Task 15: Set up environment variables and generate admin credentials

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Generate a bcrypt hash for the admin password**

Choose a strong password (e.g., `VianaAdmin2026!`). Run:

```bash
node -e "const b = require('bcryptjs'); b.hash('YOUR_PASSWORD_HERE', 10).then(h => console.log(h))"
```

Copy the output hash — it will look like `$2b$10$...`.

- [ ] **Step 2: Generate a SESSION_SECRET (min 32 chars)**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **Step 3: Write `.env.local`**

```bash
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<paste bcrypt hash here>
SESSION_SECRET=<paste random hex string here>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Verify `.env.local` is in `.gitignore`**

```bash
grep ".env.local" .gitignore
```

Expected: line exists. If not: `echo ".env.local" >> .gitignore`

- [ ] **Step 5: Commit `.gitignore` only (never commit `.env.local`)**

```bash
git add .gitignore
git commit -m "chore: ensure .env.local is git-ignored"
```

---

## Task 16: Smoke test the full site locally

- [ ] **Step 1: Build the project**

```bash
npm run build
```

Expected: build completes with no errors. (Netlify Blobs calls may fail gracefully — that's expected without `netlify dev`.)

- [ ] **Step 2: Start the server**

```bash
npm run start
```

Visit `http://localhost:3000`. Verify:
- Home page renders with all sections (Hero, About, Services, Team, Testimonials, Quote, Contact)
- Blog section shows "Articles coming soon." (no posts yet)
- Nav links work: Home, About, Services, Team, Blog (→ `/blog`), Contact
- `/blog` page loads
- `/admin/login` page loads and shows the login form

- [ ] **Step 3: Test admin login**

Go to `http://localhost:3000/admin/login`. Enter the credentials from `.env.local`. Verify redirect to `/admin` dashboard.

- [ ] **Step 4: Create a test post**

Click "New Post". Fill in title, excerpt, content (any Markdown). Toggle "Published". Click "Create Post". Verify redirect to edit page.

- [ ] **Step 5: Verify post appears in home and blog pages**

Go to `http://localhost:3000`. Verify the blog section now shows the post card. Go to `/blog`. Verify post card is listed. Click "Read More". Verify post detail page renders.

Note: steps 4 and 5 require running `netlify dev` instead of `next dev`/`next start` to use Netlify Blobs locally. If `netlify dev` is not set up, mock responses are expected.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete blog system — Next.js conversion, admin panel, public blog"
```

---

## Self-Review Checklist

| Spec Requirement | Task |
|-----------------|------|
| Convert HTML → Next.js | Tasks 1–6 |
| Netlify Blobs storage | Task 8 |
| iron-session + bcrypt auth | Task 7, 9, 11, 14 |
| POST/GET/PUT/DELETE API routes | Task 9 |
| Public `/blog` listing | Task 10 |
| Public `/blog/[slug]` post | Task 10 |
| Home page blog section (dynamic, 3 posts) | Task 6 |
| Remove home page mocks | Task 6 (page.tsx replaces hardcoded cards) |
| `/admin` dashboard | Task 14 |
| Admin login | Task 11 |
| PostForm with write/preview | Task 13 |
| PostsTable with CRUD actions | Task 12 |
| `.env.local` setup | Task 15 |
| Netlify build config | Task 2 |
| Tests for posts and auth lib | Tasks 7, 8 |
| Nav "Blog" link → `/blog` (internal) | Task 4 |
