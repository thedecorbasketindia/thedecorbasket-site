# The Decor Basket — Full Setup Guide

This is a real Next.js + Supabase e-commerce site with a built-in admin
dashboard at `/admin`. Everything — products, categories, collections,
homepage hero, site settings, images — is managed from that dashboard.
No spreadsheets, no re-uploading files for content changes.

You'll need three free accounts: **Supabase** (database + auth + image
storage), **GitHub** (holds the code), and **Netlify** (hosting — you
already have this). Do the steps in order.

---

## Part 1 — Create your Supabase project

1. Go to **https://supabase.com** → sign up free → **New project**.
2. Name it `decorbasket` (or anything), set a database password (save it
   somewhere), pick a region close to India, and create it. Takes ~2 minutes.
3. Once it's ready, open **SQL Editor** (left sidebar) → **New query**.
4. Open `supabase/schema.sql` from this project, copy its entire contents,
   paste into the SQL editor, and click **Run**. This creates every table,
   security rule, and the image storage bucket.
5. Open a second **New query**, paste in `supabase/seed.sql`, and **Run**.
   This adds your five categories and the products we already know about
   from your photos, with prices marked as placeholders for you to correct.
6. Go to **Project Settings → API**. You'll need two values from this page
   in Part 3:
   - **Project URL**
   - **anon public** key (NOT the `service_role` key — never use that one here)

### Create your admin login

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter the email and password you want to log into `/admin` with.
3. Tick **Auto Confirm User** so it's active immediately.
4. This is the only account that can manage the site — there's no public
   sign-up page, by design.

---

## Part 2 — Push the code to GitHub

1. Go to **https://github.com** → sign in → **New repository** →
   name it `thedecorbasket-site` → **Create repository** (keep it empty,
   no README/license).
2. On your computer, unzip the project folder you downloaded from this chat.
3. Open a terminal inside that folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/thedecorbasket-site.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your actual GitHub username. GitHub will
   show you this exact command on the empty repo page too.)

If you don't have `git` installed or aren't comfortable with the terminal,
GitHub also lets you drag-and-drop the folder's files directly on the
repository's web page via **Add file → Upload files** — just make sure the
folder structure (especially the `app` folder) stays intact.

---

## Part 3 — Deploy on Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub** →
   pick `thedecorbasket-site`.
2. Netlify should auto-detect Next.js. Build command: `npm run build`.
   (This is already set in `netlify.toml` in the project, so you likely
   won't need to change anything.)
3. Before deploying, click **Add environment variables** and add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL from Part 1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key from Part 1 |
4. Click **Deploy**. First build takes a few minutes.
5. Once live, go to **Domain settings → Add a domain** and connect
   `thedecorbasket.co.in` the same way as before (GoDaddy DNS records
   pointing to Netlify).

From now on: **any push to the `main` branch on GitHub automatically
redeploys the site.** You'll only touch GitHub again if you want a real
design/code change — everyday content changes all happen in `/admin`.

---

## Part 4 — Using the admin dashboard

Go to `https://thedecorbasket.co.in/admin` (or your Netlify URL + `/admin`)
and sign in with the account you created in Part 1.

### Dashboard
Quick counts of products, published items, and featured items, plus your
most recently edited products.

### Products
- **Add Product**: name, description, price, category, tags, stock status.
- **Images**: drag and drop photos directly — they upload straight to
  Supabase Storage. Click "Set primary" on the one that should show first.
- **Variants** (optional): e.g. different scents or colors, each with its
  own optional price/stock/swatch color.
- **Status checkboxes**: Published (must be checked to appear on the live
  site), Featured, Best Seller, New Arrival, On Sale.
- Editing or deleting a product updates the live site within seconds.

### Categories
Add/edit/delete categories, each with its own image and description. The
shop page's filter pills and each category's landing page are generated
from this automatically — there's nothing else to wire up.

### Collections
Group products together (e.g. "Festive", "New Arrivals") for your own
merchandising use — create a collection, then check which products belong
in it.

### Homepage
- **Announcement bar**: a thin banner across the top (e.g. a shipping note).
- **Fallback hero**: headline, subheadline, button text/link, and image —
  used only when no carousel slides are active.
- **Carousel slides**: add multiple slides with their own image, headline,
  and button; reorder by their "order" number; turn any slide on/off.

### Settings
Site title, tagline, logo (upload a transparent PNG here to replace the
current one), and your WhatsApp/email/Instagram contact details.

---

## How the storefront works day to day

- Only **Published** products appear on the site.
- The homepage shows your **Featured** products directly (no products
  marked Featured yet? It falls back to showing your most recent ones).
- There's no payment gateway. Customers add items to a cart (saved in
  their browser) and tap **Checkout via WhatsApp**, which opens a
  pre-filled message to you with their order and total — you confirm and
  arrange payment directly, same as your current process.

---

## What's intentionally simple right now

Being upfront about scope, per your original spec:

- **Brand colors in Settings** are saved for reference but not yet wired
  into the live CSS — the current maroon/gold theme is set directly in the
  code's design file. Making the color pickers actually re-theme the site
  live is a small follow-up if you want it.
- **Sub-categories** aren't implemented — categories are a single flat
  list, which matches your five current categories.
- **Inventory quantity** is stored per product but isn't decremented
  automatically (there's no checkout to trigger that) — it's informational
  for you.
- **SEO fields** (meta title/description) are supported per product but
  structured data/schema markup isn't added yet.

None of these block using the site day-to-day — they're the parts of the
original spec that go beyond what a WhatsApp-order storefront needs right
now. Happy to build any of them out further whenever you want.

## If something goes wrong

- **Can't log into /admin:** double check the user was created with
  "Auto Confirm User" ticked in Supabase, and that you're using that exact
  email/password.
- **Images won't upload:** confirm `schema.sql` ran successfully — it
  creates the `media` storage bucket and its permissions. Re-run it if unsure
  (it's safe to run more than once).
- **Site shows a blank/error page:** check Netlify's **Deploys** tab for
  the build log, and confirm both environment variables from Part 3 are
  set exactly as shown (no extra spaces, no quotes).
- **Changes in /admin don't show up:** hard-refresh the page
  (Ctrl/Cmd+Shift+R) — some pages cache briefly for speed.
