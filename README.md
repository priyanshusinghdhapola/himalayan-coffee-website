# Mahvé Coffee — *Rooted in the Hills*

Flagship website for Mahvé, a Himalayan specialty coffee house. It has:

- a scroll-scrubbed cinematic hero driven by Higgsfield AI footage;
- an interactive collection explorer with purchase and pre-order;
- a glassmorphism *Upcoming releases* section over a looping Higgsfield background video;
- Pahari craft details throughout: a Kullu shawl border, a carved-rosette ornament, Devanagari accents and procedurally drawn Himalayan ridges.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · ffmpeg/sharp media pipeline.

```powershell
npm install
npm run dev          # http://localhost:3000
```

The site is complete **before any media exists**. Each missing Higgsfield asset renders a designed fallback, and the hero plays a procedural Himalayan dawn-to-dusk scrub until the real frames arrive.

## Docs

| Step | Document |
|---|---|
| A · Research, brand direction, architecture | [docs/01-research-and-architecture.md](docs/01-research-and-architecture.md) |
| B · Every Higgsfield prompt, mapped to its file | [docs/02-higgsfield-prompts.md](docs/02-higgsfield-prompts.md) |
| E · Media drop-in paths and Vercel deployment | [docs/03-deployment.md](docs/03-deployment.md) |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` / `build` / `start` | Develop / production build / serve the build |
| `npm run lint` · `npm run typecheck` | ESLint (Next + React Compiler rules) · TypeScript |
| `npm run media:hero` | `media-src/hero/**/*.mp4` → WebP frame sequences + `src/config/hero-sequence.json` |
| `npm run media:loop` | `media-src/upcoming/loop.mp4` → seamless WebM/MP4 loop + poster |
| `npm run media:stills` | `media-src/stills/<ID>.png` → sized WebP at the registry path |
| `npm run media:check` | Lists which assets are in place, missing or too heavy |

## Where things live

- **Copy and products:** `src/content/` (`brand.ts`, `products.ts`, `upcoming.ts`, `craft.ts`)
- **Asset registry (ID → path → prompt):** `src/config/media-registry.json`
- **Higgsfield renderers:** `src/components/higgsfield/` (`HiggsfieldCanvas`, `HiggsfieldBackgroundLoop`)
- **Design tokens and utilities:** `src/app/globals.css`
- **Logo:** `src/components/brand/Emblem.tsx` (vector) · supplied render at `public/media/brand/mahve-signage.webp`
