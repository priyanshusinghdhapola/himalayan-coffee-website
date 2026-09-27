# Step E — From Higgsfield exports to a live site on Vercel

Commands are shown for **Windows PowerShell** (your machine). They work unchanged in macOS/Linux terminals, apart from the ffmpeg install line.

---

## 1. One-time setup

1. **Node.js 20.9 or newer.** You have 24.x. Check with `node -v`.
2. **ffmpeg.** Only needed on your computer to process video; Vercel never needs it.
   ```powershell
   winget install Gyan.FFmpeg
   ```
   Close and reopen the terminal, then check `ffmpeg -version`.
3. **Install and run the site:**
   ```powershell
   cd "D:\project\10K website"
   npm install
   npm run dev
   ```
   Open http://localhost:3000. Every section already works, with designed fallbacks where Higgsfield media will go.

---

## 2. Drop in your Higgsfield media

Generate assets with the prompts in [`02-higgsfield-prompts.md`](./02-higgsfield-prompts.md), then save each export to **exactly** these paths inside `D:\project\10K website\`:

| What | Save your export as | Then run |
|---|---|---|
| Hero clips H1–H4 (16:9) | `media-src\hero\landscape\01.mp4` … `04.mp4` | `npm run media:hero` |
| Hero clips, phone cut (9:16, optional) | `media-src\hero\portrait\01.mp4` … `04.mp4` | `npm run media:hero` |
| Upcoming loop U1 (16:9) | `media-src\upcoming\loop.mp4` | `npm run media:loop` |
| Upcoming loop, phone cut (9:16, optional) | `media-src\upcoming\loop-portrait.mp4` | `npm run media:loop` |
| Any still (L1 → `BRAND`, S1, P1–P4, P1S–P4S, C1–C4, U2–U7) | `media-src\stills\<ID>.png` (or .jpg/.webp), e.g. `media-src\stills\P1.png` | `npm run media:stills` |

Create the folders if they don't exist yet:

```powershell
mkdir media-src\hero\landscape, media-src\hero\portrait, media-src\upcoming, media-src\stills -Force
```

What the scripts produce (you never edit these by hand):

```
public\media\hero\desktop\frame_0001.webp …   ← media:hero (also updates src\config\hero-sequence.json)
public\media\hero\mobile\frame_0001.webp …
public\media\upcoming\loop-desktop.webm / .mp4, loop-mobile.mp4, loop-poster.webp   ← media:loop
public\media\products\buransh-pack.webp …     ← media:stills (resized to the registry width)
```

Check progress at any time:

```powershell
npm run media:check
```

Useful flags:

```powershell
npm run media:hero -- --frames 160 --quality 68   # lighter desktop sequence
npm run media:hero -- --focus 0.35                # move the auto phone crop left (0–1)
npm run media:loop -- --crossfade 0               # your loop already starts and ends on the same frame
```

> `media-src\` is git-ignored because the raw masters are huge. Only the processed `public\media\` files are deployed. Keep your masters backed up elsewhere.

---

## 3. Supply your verified business details

The site ships with **no unverified business details presented as fact**. There are two mechanisms:

- **Empty until you fill them in:** these fields are not rendered at all while empty. That covers contact details, prices, sizes, grind options, checkout links, the countdown date and headline stats.
- **`placeholder: true`:** draft copy stays visible but carries a **"Placeholder" label** on the page. Placeholder product pages are also kept out of search results and the sitemap, and emit no Product structured data. Set the flag to `false` only after every detail in that record is true.

| File | Field | Currently | What to do |
|---|---|---|---|
| `src\content\brand.ts` | `contact.email`, `contact.wholesaleEmail`, `contact.address`, `contact.socials` | empty — footer contact column hidden | Add real details; each appears in the footer (and email/socials in structured data) once set |
| | `story.paragraphs` + `story.placeholder` | draft, labelled | Rewrite with your real story (sourcing, growers, process), then `placeholder: false` |
| | `story.stats` | empty — stats panel hidden | Add only figures you can stand behind |
| `src\content\products.ts` | every product's details + `placeholder` | draft lineup, labelled | Replace names, origins, altitudes, varietals, process, harvest, notes, scores, recipes — or delete coffees you won't sell |
| | `offers` (`size`, `price`, `checkoutUrl`) | empty — no price shown, button is **Notify me** | Add each real size and price; `checkoutUrl` = your payment page (Stripe Payment Link, Shopify permalink, Razorpay…) |
| | `grinds` | empty — no grind picker | List the grind options you actually offer |
| | `CURRENCY` | `"INR"` (not shown until prices exist) | Confirm or change before adding prices |
| `src\content\upcoming.ts` | each release + `placeholder` | draft concepts, labelled | Edit or delete; statuses, timing and partner/edition details must be real |
| | `nextDrop` | `null` — countdown hidden | Add `{ slug, name, date }` only for a confirmed release date |
| `src\content\craft.ts` | `craftSteps` + `craftIntro.placeholder` | draft, labelled | Describe your real process, then `placeholder: false` |

**Buy buttons** appear only for a product with `placeholder: false` **and** a checkout link: the offer's own `checkoutUrl`, or `NEXT_PUBLIC_SHOP_URL`. Every other product shows **Notify me**, which collects an email.

Before launch, search the live site for the word "Placeholder". Every label you still see marks copy that isn't verified yet.

---

## 4. Put the site in its own Git repository

`10K website` currently sits **inside the MediKiosk repository**, and they are separate projects. Give Mahvé its own repo:

```powershell
cd "D:\project\10K website"
git init -b main
git add .
git commit -m "Mahvé Coffee flagship site"
```

Then stop MediKiosk from tracking the folder, by adding this line to `D:\project\.gitignore`:

```
10K website/
```

(Or move the folder out, e.g. to `D:\mahve-coffee`. Nothing in the code depends on its location.)

Create an empty repository on GitHub (e.g. `mahve-coffee`) and push:

```powershell
git remote add origin https://github.com/<you>/mahve-coffee.git
git push -u origin main
```

---

## 5. Deploy on Vercel

### Option A — Git (recommended: every push redeploys)

1. Go to **vercel.com → Add New → Project** and import `mahve-coffee`.
2. Framework preset: **Next.js** (auto-detected). Leave the build command (`next build`) and output settings at their defaults. Root directory is `./`, or `10K website` if you pushed the parent folder instead.
3. **Environment Variables** (Settings → Environment Variables, for Production and Preview):

   | Name | Value | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | your real domain, e.g. `https://www.<your-domain>` | Canonical URL for SEO, sitemap and social cards. Optional: if unset (or invalid), the build uses Vercel's production domain automatically and warns instead of failing |
   | `NEXT_PUBLIC_MEDIA_VERSION` | `1` | Bump to `2`, `3` … whenever you **replace** media files |
   | `WAITLIST_WEBHOOK_URL` | your webhook | Where sign-ups are sent (see §6). Without it, sign-ups are only logged |
   | `NEXT_PUBLIC_SHOP_URL` | optional | Your real store URL. Used as the Buy link for verified products whose offers have no `checkoutUrl` |
   | `NEXT_PUBLIC_MEDIA_BASE_URL` | optional | Only if media is hosted on a CDN (see §7) |

4. Click **Deploy**. Every page is prerendered, so the build takes about a minute.
5. **Domains:** Settings → Domains → add `your-domain.com` and follow the DNS instructions. HTTPS is automatic.

### Option B — Vercel CLI (no Git needed)

```powershell
npm i -g vercel
cd "D:\project\10K website"
vercel          # first run links the project and makes a preview deployment
vercel --prod   # production
```

Set the environment variables with `vercel env add NEXT_PUBLIC_SITE_URL` etc., or in the dashboard.

### Updating media after launch

1. Put the new exports in `media-src\`, run the matching `npm run media:*` script, then run `npm run media:check`.
2. If files **replaced** older ones with the same names, bump `NEXT_PUBLIC_MEDIA_VERSION` in Vercel. `/media` is cached for a year, so the version is what makes browsers fetch the new files.
3. Commit and push (Option A), or run `vercel --prod` (Option B). `NEXT_PUBLIC_*` variables are baked in at build time, so changing one requires a redeploy.

---

## 6. Collecting waitlist and pre-order sign-ups

All forms (newsletter and *Notify me*) POST to `/api/waitlist`, which validates the email, drops bots via a honeypot field, and forwards JSON like this to `WAITLIST_WEBHOOK_URL`:

```json
{ "email": "a@b.com", "list": "notify:kafal", "createdAt": "2026-10-01T09:00:00.000Z", "source": "mahve-web" }
```

The quickest set-ups:

- **Google Sheets:** Zapier/Make "Catch Hook" → "Add row". Paste the hook URL as `WAITLIST_WEBHOOK_URL`.
- **Email tool:** Zapier/Make hook → add subscriber in Mailchimp, Klaviyo or ConvertKit, tagged with `list`.

---

## 7. If your media folder gets large

Vercel serves `public\` from its global CDN, which is ideal. Very large media folders make every deployment slower to upload, though, and can run into plan limits. The default budget (about 40 MB total) is comfortable. If you go well beyond it (e.g. 4K frame sequences), host the media separately:

1. Upload the **contents** of `public\` so files live at `https://cdn.example.com/media/hero/desktop/frame_0001.webp` (Vercel Blob, Cloudflare R2 or Bunny all work).
2. Set `NEXT_PUBLIC_MEDIA_BASE_URL=https://cdn.example.com` in Vercel and redeploy. `next.config.ts` automatically allows that host for image optimisation.
3. Remove the large files from `public\media` in the repo.

---

## 8. Launch checklist

- [ ] `npm run media:check` shows everything in place (or you're happy with the fallbacks)
- [ ] `npm run lint` and `npm run build` pass locally
- [ ] No "Placeholder" labels left on the site, or you've consciously decided to launch with them visible (§3)
- [ ] Contact details, prices and checkout links added only where verified, and each checkout link tested with a real purchase
- [ ] `WAITLIST_WEBHOOK_URL` set, and a test sign-up arrives in your sheet or email tool
- [ ] Tested on a real iPhone (Safari) and Android phone: hero scrub, loop autoplay, menu, dialogs
- [ ] Tested with *Reduce motion* switched on (OS accessibility settings)
- [ ] Lighthouse run on the production URL (Chrome DevTools → Lighthouse)
- [ ] Social card preview checked (paste the URL into a WhatsApp or LinkedIn message)
