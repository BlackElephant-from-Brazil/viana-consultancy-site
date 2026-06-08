# Blog Design — Viana Consultancy Site

**Date:** 2026-06-08  
**Status:** Approved

---

## Context

The Viana Consultancy site is currently a single static `index.html` file. The existing blog section in the home page contains 4 hardcoded mock cards linking to an external WordPress site (`vianaconsultancy.com`). The goal is to build a fully functional blog with CRUD admin panel, modeled after the Alttavia relocation site blog.

**Constraint:** The site will be hosted on Netlify (serverless), so file system writes are not persistent. Storage uses **Netlify Blobs** instead of the file system approach used in Alttavia.

---

## Architecture

Convert the site from pure static HTML to **Next.js 15 (App Router)**. The visual design, colors (`--navy: #011342`, `--gold: #C9973A`), fonts (Marcellus + Poppins), and all existing sections are preserved identically during the port.

### File Structure

```
viana-consultancy-site/
├── src/
│   ├── app/
│   │   ├── page.tsx                        # Home page
│   │   ├── layout.tsx                      # Shared nav + footer
│   │   ├── globals.css                     # Ported CSS from index.html
│   │   ├── blog/
│   │   │   ├── page.tsx                    # /blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx                # /blog/[slug] post
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                    # Dashboard
│   │   │   ├── posts/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [slug]/edit/page.tsx
│   │   │   └── _components/
│   │   │       ├── AdminHeader.tsx
│   │   │       ├── PostForm.tsx            # Write/Preview tabs, toolbar
│   │   │       └── PostsTable.tsx          # CRUD actions
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       ├── posts/
│   │       │   ├── route.ts                # GET all / POST create
│   │       │   └── [slug]/route.ts         # GET / PUT / DELETE
│   │       └── upload/route.ts             # Image upload
│   ├── components/
│   │   └── blog/
│   │       └── BlogCard.tsx
│   └── lib/
│       ├── posts.ts                        # CRUD via @netlify/blobs
│       ├── session.ts                      # iron-session config
│       └── auth.ts                         # bcrypt helpers
├── public/
│   └── images/blog/                        # Uploaded cover images
└── assets/                                 # Existing site images (preserved)
```

---

## Data Model

```typescript
type Post = {
  slug: string        // URL-safe identifier, auto-generated from title
  title: string
  date: string        // YYYY-MM-DD
  excerpt: string     // Short summary shown in cards
  author: string      // Default: "Patrícia Viana"
  published: boolean  // false = draft, not visible publicly
  tags: string[]      // Array of tag strings
  content: string     // Full Markdown content
  coverImage?: string // URL of cover image (optional)
}
```

---

## Storage: Netlify Blobs

All CRUD operations in `lib/posts.ts` use `@netlify/blobs` package:

- **Each post**: stored as blob with key `post:{slug}`, value = JSON-serialized Post object
- **Index**: a separate blob with key `posts:index` holds an array of all slugs for fast listing
- `getAllPosts()`: reads the index, fetches all post blobs in parallel
- `getPublishedPosts()`: filters `published: true`, sorts by date descending
- `getPostBySlug(slug)`: fetches single blob
- `createPost(data)`: writes post blob + updates index
- `updatePost(slug, updates)`: merges updates, overwrites blob
- `deletePost(slug)`: removes blob + removes slug from index

**Image uploads**: Not implemented as a runtime upload API. Cover images are entered as a URL string in the admin form (external URL or a manually committed static asset under `public/images/blog/`). This avoids the Netlify limitation where runtime file system writes are not persistent.

---

## Authentication

Identical to Alttavia:

- **Library**: `iron-session` v8 with `bcryptjs`
- **Session duration**: 8 hours, HTTPOnly cookie, Secure in production
- **Cookie name**: `viana-admin-session`
- **Session data**: `{ user?: { username: string }, isLoggedIn: boolean }`
- **Env vars**:
  - `ADMIN_USER` — admin username
  - `ADMIN_PASSWORD_HASH` — bcrypt hash of admin password
  - `SESSION_SECRET` — minimum 32 characters

All `/api/posts` and `/api/auth` routes call `requireAuth()` before executing.

---

## Pages

### Home (`/`)

All existing sections preserved: Hero, About, Services, Team, Testimonials, Quote, Contact, Footer.

**Blog section changes:**
- Replace 4 hardcoded mock `<article>` elements with dynamic rendering of `getPublishedPosts().slice(0, 3)`
- If no posts exist yet: show a placeholder message ("Articles coming soon")
- "View All" link: `href="/blog"` (internal, no longer external)
- Nav link "Blog": `href="/blog"` (internal)

### `/blog` — Blog Listing

- Hero section: "Insights" tag, "Blog" heading, subtitle
- Grid layout: 3 columns (desktop) → 2 (tablet) → 1 (mobile)
- Renders all `getPublishedPosts()` sorted by date descending
- Each card via `<BlogCard>` component: cover image (or gradient fallback), tags, title, excerpt, author, date, "Read More" link
- Empty state: "New articles on their way."
- CTA section at bottom: contact button
- `dynamic = 'force-dynamic'` to always show fresh data

### `/blog/[slug]` — Post Detail

- Cover image (full width if present)
- Title, author, date, tags
- Markdown content rendered via `next-mdx-remote` with customized HTML components (same typography as Alttavia: Marcellus headings, Poppins body)
- Back link to `/blog`
- `generateStaticParams()` for published posts

### `/admin/login`

- Simple form: username + password
- Submits to `POST /api/auth/login`
- On success: redirect to `/admin`
- Error state inline

### `/admin` — Dashboard

- `PostsTable` listing all posts (published + drafts)
- Columns: Title, Author, Date, Status, Actions
- Actions: toggle published (eye icon), edit (pencil), delete (trash with confirm dialog)
- "New Post" button → `/admin/posts/new`
- Toast notifications for success/error

### `/admin/posts/new` and `/admin/posts/[slug]/edit`

- `PostForm` component with:
  - **Write tab**: Markdown textarea with toolbar (H1, H2, H3, Bold, Italic, Blockquote)
  - **Preview tab**: Live rendered preview
  - Fields: Title (required), Slug (auto-generated), Author (default "Patrícia Viana"), Date (default today), Tags (comma-separated), Excerpt, Cover Image URL, Published toggle
- Save: POST `/api/posts` (new) or PUT `/api/posts/[slug]` (edit)
- After create: redirect to edit page
- Toast on save/error

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | — | Validate credentials, create session |
| DELETE | `/api/auth/logout` | — | Destroy session |
| GET | `/api/posts` | ✓ | List all posts (including drafts) |
| POST | `/api/posts` | ✓ | Create post |
| GET | `/api/posts/[slug]` | ✓ | Get single post |
| PUT | `/api/posts/[slug]` | ✓ | Update post |
| DELETE | `/api/posts/[slug]` | ✓ | Delete post |

Note: no `/api/upload` route — cover images are URLs, not file uploads.

Public routes (`/blog`, `/blog/[slug]`) read posts directly via lib functions, not through API.

---

## Dependencies

```json
{
  "next": "^15",
  "react": "^19",
  "react-dom": "^19",
  "iron-session": "^8",
  "bcryptjs": "^3",
  "next-mdx-remote": "^6",
  "lucide-react": "latest",
  "@netlify/blobs": "latest"
}
```

---

## Environment Variables

```
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<bcrypt hash>
SESSION_SECRET=<min 32 chars random string>
NEXT_PUBLIC_SITE_URL=https://vianaconsultancy.com
```

---

## Key Differences from Alttavia

| Aspect | Alttavia | Viana Consultancy |
|--------|----------|-------------------|
| Storage | `fs` (file system) | `@netlify/blobs` |
| Host | VPS/server | Netlify |
| i18n | Yes (en/pt/es) | No (English only) |
| Image upload | `public/blog/images/` via fs | Cover image URL field (no file upload runtime) |
| MDX components | FAQ, FAQItem | Standard markdown only (FAQ omitted for simplicity) |

---

## Out of Scope

- Multi-language support (not needed for this site)
- Newsletter signup (not in Viana Consultancy's existing design)
- SEO-specific metadata beyond title/description
- Image upload at runtime (cover images entered as URLs in admin)
