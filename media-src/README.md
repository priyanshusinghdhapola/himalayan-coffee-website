# media-src — raw Higgsfield exports (not deployed)

Everything in this folder except this README is git-ignored. Put your original Higgsfield downloads here, then run the scripts that turn them into web-ready files in `public/media/`.

```
media-src/
├─ hero/
│  ├─ landscape/01.mp4 … 04.mp4   H1–H4, 16:9      → npm run media:hero
│  └─ portrait/01.mp4 … 04.mp4    H1–H4, 9:16 (optional)
├─ upcoming/
│  ├─ loop.mp4                    U1, 16:9         → npm run media:loop
│  └─ loop-portrait.mp4           U1, 9:16 (optional)
└─ stills/
   └─ P1.png, C2.jpg, BRAND.png …  named by prompt ID → npm run media:stills
```

Prompts: `docs/02-higgsfield-prompts.md` · Full workflow: `docs/03-deployment.md`
