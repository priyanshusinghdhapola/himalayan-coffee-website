# Step A — Research, brand direction and architecture

## 1. What the best premium coffee sites do

Specialty roasters that win design awards (Ceremony Coffee Roasters was an Awwwards Site of the Day; La Cabra, Onyx, Sey and Tim Wendelboe set the tone for the category) share a small set of habits:

- **Controlled minimalism.** Few elements, generous space and one confident typeface pairing. The product and the story carry the page, not decoration.
- **Origin is the product.** Every coffee is sold through its place: region, altitude, varietal, process and harvest window, then tasting notes. Buyers at this price point read the spec sheet.
- **Recipes and rituals.** A recommended brew recipe per coffee turns a bag into a practice and justifies the premium.
- **Scarcity and seasonality.** Limited lots, numbered releases and waitlists create anticipation between purchases.
- **Motion with restraint.** Parallax, masked text reveals and one signature scroll moment. Motion that fights the reader is the fastest way to look cheap.

### Scroll-driven video: why an image sequence, not an MP4

Scrubbing `video.currentTime` makes the browser seek to the nearest keyframe and decode forward. Scrubbing backwards is especially bad, because every step re-decodes from an earlier keyframe, so reverse scroll stutters. The approach Apple popularised, and GSAP documents as a helper, is to **export the clip as numbered images and draw the current one to a `<canvas>`**. Frame N is always frame N, in either direction.

This build adds three refinements on top:

1. **Coarse-to-fine loading.** About 24 evenly spaced key frames load first, so the whole timeline is scrubbable within a second or two. Intermediate frames stream in behind, and the renderer always draws the nearest loaded frame.
2. **Pixel ratio capped at 1.5×.** On moving footage it is indistinguishable from 3×, at roughly a quarter of the pixels.
3. **Separate portrait sequence** for phones, so a 16:9 film isn't cropped to a sliver.

Sources: [GSAP — image sequence scrub helper](https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/) · [Scroll-scrubbed video with Next.js + GSAP + canvas](https://dev.to/pratham7711/how-i-made-a-scroll-scrubbed-video-portfolio-fast-nextjs-15-gsap-canvas-1mj6) · [Builder.io — 3D scroll animation with GSAP and Veo](https://www.builder.io/blog/3d-gsap) · [Ceremony Coffee Roasters on Awwwards](https://www.awwwards.com/sites/ceremony-coffee-roasters)

### Himalayan coffee — grounding the story

Coffee does grow in the Himalaya: across the eastern foothills of **Nagaland, Arunachal Pradesh and Meghalaya**. Naga arabica is grown up to about 1,800 m and micro-lots cup at 84–87 SCA points, which is specialty grade. The western Himalaya (Himachal, Uttarakhand) hasn't adopted coffee at scale. Mahvé's copy therefore sources from the east and borrows its **culture and craft** from the Pahari west. That is honest and still distinctive.

Sources: [Grey Soul — Nagaland specialty coffee](https://greysoul.coffee/en-us/blogs/news/a-new-terroir-nagaland-specialty-coffe) · [Coffee regions of India](https://www.indiancoffeebeans.com/learn/coffee-regions-of-india-complete-guide) · [Higgsfield — model guide](https://higgsfield.ai/creator-hub/help-center/ai-models/which-ai-model-should-i-use) · [Higgsfield camera controls](https://higgsfield.ai/camera-controls)

> All origins, altitudes, varietals and prices in `src/content/` are **placeholders written to be plausible**. Replace them with your real sourcing before launch.

---

## 2. Brand direction — the Pahari touch

Everything is derived from the Mahvé signage you supplied.

| Element | Source in the logo | On the site |
|---|---|---|
| **Palette** | Brass lettering on dark stone | `ink #0b0907`, `gold #c9a46a`, `cream #f3ead9`; accents from the Kullu shawl: `kullu #a8412c`, `saffron #d98e32`, `deodar #4f6b58` |
| **Emblem** | Peaks + sun + M + bean + rosette | Redrawn as a vector (`src/components/brand/Emblem.tsx`); draws itself stroke by stroke in the preloader and hero |
| **Typography** | Roman capitals of the wordmark | **Cinzel** for the wordmark and tracked labels, **Cormorant Garamond** for editorial headlines, **Manrope** for reading text, **Tiro Devanagari Hindi** for Hindi accents |
| **Kullu border** | The shawl in the scene | A CSS pattern band (`kullu-band`): rust rails, saffron teeth, brass and deodar lozenges. Used on packaging, section edges and the preloader progress bar |
| **Rosette** | The ornament beside the M | Bullet and divider throughout |
| **Himalaya** | The window view | Seeded, procedurally generated ridgelines with terrain-following snow. The same data draws the SVG art and the hero's canvas fallback |
| **Language** | — | Pahari words as product names (*Buransh, Kafal, Deodar, Dhauladhar, Bugyal*) with their Devanagari spellings, and quiet Hindi accents (पहाड़ी कॉफ़ी, पहाड़) |

### What was enhanced in the logo

The supplied mark is a 3D render, which can't be used as a site logo. The vector redraw keeps every symbol but:

- rebuilds the **M as a Didone letter** (hairline and shaded strokes), so it stays crisp from 16 px favicon to full-screen;
- adds a **snow line** to the summit, making the peak read as Himalayan rather than generic;
- sets the **bean in the valley of the M**, so the mark reads "coffee grown in the valley";
- simplifies to peaks + M + bean for the favicon (`src/app/icon.svg`), where fine ornaments would blur.

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.3** (App Router, Turbopack) | Static prerender of every page, file-based metadata/OG, image optimisation, first-class on Vercel |
| UI | **React 19.3** + **TypeScript 6** | Server Components keep sections zero-JS where possible; client islands only where there's interaction |
| Styling | **Tailwind CSS 4.3** | CSS-first `@theme` tokens, custom utilities (`glass`, `eyebrow`, `kullu-band`) in `globals.css` |
| Animation | **GSAP 3.15** + ScrollTrigger + SplitText, via `@gsap/react` | Industry standard for scrubbed timelines; all plugins are now free; `useGSAP` handles cleanup |
| Smooth scroll | **Lenis 1.3** | Advanced from GSAP's ticker, so scroll, scrubs and canvas draws land in the same frame |
| Media | **ffmpeg** + **sharp** scripts | Turn Higgsfield exports into frame sequences, seamless loops and sized WebPs |

---

## 4. Directory structure

```
10K website/
├─ docs/                          ← you are here (A, B, E)
├─ media-src/                     raw Higgsfield exports (git-ignored)
│  ├─ hero/landscape/01–04.mp4
│  ├─ hero/portrait/01–04.mp4     optional
│  ├─ upcoming/loop.mp4 (+ loop-portrait.mp4)
│  └─ stills/P1.png, C2.jpg …     named by prompt ID
├─ public/media/                  processed, web-ready files (committed, CDN-cached 1 year)
│  ├─ brand/  hero/desktop/  hero/mobile/  story/  products/  craft/  upcoming/
├─ scripts/
│  ├─ extract-hero-frames.mjs     npm run media:hero
│  ├─ encode-loop.mjs             npm run media:loop
│  ├─ process-stills.mjs          npm run media:stills
│  └─ check-media.mjs             npm run media:check
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               fonts, metadata, Lenis + page-transition providers
│  │  ├─ page.tsx                 home: Hero → Marquee → Story → Collection → Craft → Upcoming
│  │  ├─ coffee/[slug]/page.tsx   product pages (static, JSON-LD Product)
│  │  ├─ api/waitlist/route.ts    waitlist / pre-order / newsletter endpoint
│  │  ├─ opengraph-image.tsx      generated social card
│  │  └─ icon.svg, apple-icon.png, sitemap.ts, robots.ts, manifest.ts, not-found.tsx
│  ├─ components/
│  │  ├─ higgsfield/
│  │  │  ├─ HiggsfieldCanvas.tsx          scroll-scrub renderer (image sequence → canvas)
│  │  │  ├─ HiggsfieldBackgroundLoop.tsx  lazy, visibility-aware background video
│  │  │  ├─ frame-loader.ts               coarse-to-fine frame preloader
│  │  │  └─ fallback-scene.ts             procedural Himalaya shown until frames exist
│  │  ├─ sections/   Hero, Marquee, Story, Collection(+Explorer), Craft, Upcoming(+Content)
│  │  ├─ product/    BagFallback, ProductMeta, PurchasePanel
│  │  ├─ brand/      Emblem, Wordmark, Rosette, HimalayaRidges
│  │  ├─ layout/     Nav, Footer, FooterRidges, Preloader
│  │  ├─ providers/  SmoothScroll (Lenis↔GSAP), PageTransition (+ TransitionLink)
│  │  └─ ui/         Button, Magnetic, Dialog, WaitlistForm, Countdown, MediaImage, motion
│  ├─ config/
│  │  ├─ media-registry.json      every asset: ID → path, spec, prompt
│  │  └─ hero-sequence.json       frame counts (written by media:hero)
│  ├─ content/                    ALL copy: brand.ts, products.ts, upcoming.ts, craft.ts
│  ├─ hooks/useMediaQuery.ts
│  └─ lib/                        gsap.ts, media.ts, media-server.ts, ridge.ts, cn.ts
├─ next.config.ts                 image formats, /media immutable caching, security headers
├─ postcss.config.mjs  eslint.config.mjs  tsconfig.json  .env.example
```

---

## 5. How it fits together

### Rendering

Every page is **prerendered at build time**. During the build, `mediaAvailability()` checks which Higgsfield files exist in `public/media`. Present files render as optimised `next/image`; missing ones render designed fallbacks: a rendered Mahvé pouch, Himalaya ridge art, drifting mist, or the procedural hero scene. The site is never visibly "missing" anything, and adding a file plus rebuilding swaps it in.

### The hero (core mechanic)

```
scroll ─▶ Lenis (smoothing) ─▶ ScrollTrigger(scrub 0.6) ─┬─▶ HiggsfieldCanvas.setProgress(p) ─▶ rAF ─▶ drawImage(nearest loaded frame)
                                                        └─▶ chapter timeline (I–IV copy, progress rail)
```

- The section is `420svh` (phones) / `520svh` (desktop) tall with a `position: sticky` stage. Pure CSS pinning means no pin-spacer layout shifts.
- One trigger drives both the frames and the copy, so they can never drift apart in either direction.
- Frame 1 is also a real `<img fetchPriority="high">` under the canvas, so first paint doesn't wait for JavaScript.
- The preloader's counter and Kullu progress band track the **real** priming-frame progress, with a 7 s safety cap.

### Background loop

`HiggsfieldBackgroundLoop` attaches `<source>`s only when the section is about one viewport away, plays only while visible, pauses off-screen, prefers VP9 WebM, falls back to H.264, and fades in over its poster. It honours reduced motion and Data Saver by showing the poster only. The stage is CSS-sticky while the glass UI scrolls over it.

### Performance budget

| Asset | Target |
|---|---|
| Hero desktop sequence | ~200 frames × 1600 px WebP ≈ 15–20 MB (first ~24 frames ≈ 2 MB gate the preloader) |
| Hero mobile sequence | ~150 frames × 720 px ≈ 5–7 MB |
| Background loop | ≤ 8 MB WebM/MP4, loaded only near the section |
| Stills | ≤ 300 KB each, served as AVIF/WebP by `next/image` |
| JS | Sections are Server Components; client islands for motion and commerce only |

Data Saver visitors get only the priming frames. All `/media` responses are `Cache-Control: public, max-age=31536000, immutable`, and cache-busting uses `?v=NEXT_PUBLIC_MEDIA_VERSION`.

### Accessibility

Semantic landmarks and a skip link. Tabs follow the ARIA tab pattern with arrow-key navigation. Dialogs are native `<dialog>` (focus trap, Esc). `prefers-reduced-motion` disables smooth scroll, reveals, loops and the marquee. All copy in the DOM is real text, and body text clears WCAG AA contrast by a wide margin (about 6.9:1 or better on the ink background).
