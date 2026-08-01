# GARVIND Website — Setup Guide (Step by Step)

This is a complete, ready-to-use website for GARVIND. You don't need to know
how to code to get it live — just follow these steps in order.

## What's inside this folder

```
garvind-website/
├── index.html          → the page itself (structure)
├── css/style.css        → all colors, spacing, fonts, animations
├── js/data.js           → EDIT THIS for products, reviews, FAQs, Instagram tiles
├── js/main.js           → the interactive behavior (3D hero, filters, form, etc.)
└── README.md             → this file
```

**You will mostly only ever need to touch `js/data.js`.**

---

## STEP 1 — Preview it on your computer (before doing anything else)

1. Find the folder `garvind-website` you unzipped.
2. Double-click `index.html`.
3. It opens in your browser (Chrome/Edge/Firefox) — that's the live site, running locally.

If the 3D hero animation doesn't load, it's because your browser blocked internet
access for a local file. This is fixed automatically once the site is hosted online (Step 4).

---

## STEP 2 — Put in your real WhatsApp number

The whole site is wired to send orders straight to WhatsApp. Right now it uses a
placeholder number: `910000000000`. Replace it everywhere:

1. Open the folder in any text editor (Notepad, TextEdit, or better — free tool [VS Code](https://code.visualstudio.com/)).
2. Use "Find and Replace" (Ctrl+F / Cmd+F) across the project for: `910000000000`
3. Replace it with your real number in international format, no `+` or spaces.
   Example: for an Indian number `98765 43210`, use `919876543210`.
4. Files it appears in: `index.html`, `js/main.js`.
5. Also update the footer email in `index.html` — search for `hello@garvind.in` and replace with the real email.

---

## STEP 3 — Add your real products & content (`js/data.js`)

Open `js/data.js` in a text editor. It's plain English content, no code logic to break.

### Products
Each product looks like this:
```js
{
  name: "Anime Keychain Set",
  category: "keychain",        // must be one of: keychain, figure, decor, prop, custom
  price: "₹149",
  blurb: "Pick any character silhouette, we print it in your colorway.",
  gradient: ["#3a2410", "#FF6B35"],   // background color of the card (leave as-is, or pick 2 hex colors)
  shape: "keychain"             // built-in icon — options: dragon, keychain, planter, armor, grid, chibi, tag, helmet, question
}
```
- Copy one block, paste it, and edit the text to add a new product.
- Delete a block to remove a product.
- To use a REAL PHOTO instead of the built-in icon, see Step 3B below.

### Reviews, FAQs, Instagram tiles
Same idea — copy/edit/delete the blocks under `REVIEWS`, `FAQS`, and `INSTA_TILES`.

---

## STEP 3B — Using real product photos (from Instagram) instead of icons

The built-in shapes are placeholders so the site works immediately with zero setup.
To swap in real photos from `@garv_ind`:

1. Save the product photos from Instagram to your computer (open the post → the
   three dots or share icon → save, or just screenshot and crop it square).
2. Put the images in a new folder: `garvind-website/images/products/`
   (create this folder if it isn't there).
3. Name them simply, e.g. `dragon.jpg`, `keychain-1.jpg`.
4. In `index.html`, find this line inside `js/main.js`'s `renderProducts` function:
   ```
   <div class="product-thumb" data-tilt style="background: linear-gradient(...)">
   ```
   Replace the `style="background: linear-gradient(...)"` part with:
   ```
   style="background-image:url('images/products/dragon.jpg'); background-size:cover; background-position:center;"
   ```
   (using the actual filename for that product).
5. Save, refresh the browser tab to check it.

Same approach works for the Instagram strip tiles — put screenshots in
`images/instagram/` and swap the gradient background the same way inside
`js/main.js` under `instaGrid.innerHTML`.

**Tip:** if this step feels fiddly, you can literally just message this project
back to Claude along with a few product photos and ask for them to be wired in —
that's a five-minute job for an AI assistant.

---

## STEP 4 — Put the site online (free options)

Pick ONE of these. Netlify is the easiest for a non-developer.

### Option A — Netlify Drop (easiest, 2 minutes, free)
1. Go to https://app.netlify.com/drop
2. Drag the whole `garvind-website` folder onto the page.
3. Netlify gives you a live link instantly (like `garvind.netlify.app`).
4. Later, under **Site settings → Domain management**, you can connect a real
   domain name like `garvind.in` if you buy one.

### Option B — GitHub Pages (free, good if you already use GitHub)
1. Create a free account at https://github.com
2. Create a new repository, e.g. `garvind-website`.
3. Upload all the files in this folder to that repository.
4. Go to **Settings → Pages**, set source to the `main` branch, root folder.
5. GitHub gives you a link like `yourusername.github.io/garvind-website`.

### Option C — Vercel (free, similar to Netlify)
1. Go to https://vercel.com/new
2. Drag/import the folder or connect it via GitHub.
3. Deploy — you get a live link immediately.

---

## STEP 5 — Get a real domain name (optional but recommended)

1. Buy `garvind.in` or `garvind.com` (or similar) from a registrar — GoDaddy,
   Namecheap, or Hostinger all work, usually ₹500–1500/year for `.in` or `.com`.
2. In your Netlify/Vercel/GitHub Pages dashboard, look for "Add custom domain"
   and follow the on-screen steps (it will ask you to add a couple of DNS records
   at your domain registrar — the hosting dashboard walks you through it).
3. Within a few hours to a day, `garvind.in` (or whatever you bought) will point
   straight at your site.

---

## STEP 6 — Ongoing edits

Every time you want to:
- Add/remove a product → edit `js/data.js`, re-upload/redeploy.
- Change a color → open `css/style.css`, look at the top for a section called
  `:root` — those are the main colors (orange, violet, mint) used everywhere.
- Change any wording on the page (headlines, section titles) → edit the text
  directly inside `index.html`, it's plain readable text between the HTML tags.

If you're using Netlify Drop, redeploying is just dragging the updated folder
onto https://app.netlify.com/drop again. If you're on GitHub, it's uploading
the changed files again.

---

## What's already built in

- **3D rotating hero object** (built with Three.js, no external 3D model needed)
- **"Printed layer by layer" headline reveal** on page load
- **3D tilt effect** on product cards when you hover over them
- **Filterable shop grid** (All / Keychains / Figurines / Desk Decor / Cosplay Props / Custom)
- **Custom order form** that opens WhatsApp with the customer's details pre-filled
- **FAQ accordion**, **testimonial carousel**, **scrolling filament-type marquee**
- **Custom cursor**, scroll-reveal animations, animated stats counter
- Fully responsive — works on mobile, tablet, and desktop
- Respects "reduce motion" accessibility settings automatically

---

## Need help?

If any step above trips you up, come back to this conversation and describe
exactly where you're stuck (screenshot helps) — happy to walk through it or
make the edit directly.
