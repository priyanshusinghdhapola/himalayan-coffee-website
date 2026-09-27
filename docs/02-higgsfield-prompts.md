# Step B — Higgsfield prompt book

Every visual on the site has an ID. The ID ties together **the prompt below**, **the file path the code expects** (`src/config/media-registry.json`) and **the component that shows it**. Until a file exists, the site renders a designed fallback, so you can ship in any order.

```
Prompt ID  →  generate in Higgsfield  →  drop export in media-src/  →  npm run media:*  →  public/media/…  →  rebuild
```

| Group | IDs | What | Script |
|---|---|---|---|
| Hero keyframes | HK0–HK4 | 5 stills that anchor the scroll film | — (inputs for H1–H4) |
| Hero clips | H1–H4 | 4 × 5 s start→end-frame clips, one continuous shot | `npm run media:hero` |
| Background loop | U1 (+ UK) | 10 s seamless loop behind *Upcoming releases* | `npm run media:loop` |
| Brand & story | L1, S1 | Signage plate, village establishing shot | `npm run media:stills` |
| Products | P1–P4, P1S–P4S | Packshots + product-page scenes | `npm run media:stills` |
| Craft | C1–C4 | Bento tiles | `npm run media:stills` |
| Upcoming | U2–U7 | Concept blend + object cards | `npm run media:stills` |

---

## 0. Before you start

### Models

Higgsfield hosts many models and the line-up changes often, so pick by capability rather than by name:

- **Stills:** a photoreal image model with good text rendering for the packshots (the label must read **MAHVÉ** correctly). Check every packshot's spelling at 100 % zoom.
- **Hero clips (H1–H4):** a video model that accepts **both a start frame and an end frame**. At the time of writing, Kling 3.0 and Wan support this on Higgsfield. The end-frame lock is what makes four separate clips join into one unbroken shot.
- **Loop (U1):** the same start+end-frame model. Use **the same image as start and end** and the clip loops by construction.
- **Camera:** where a prompt names a move ("dolly in", "crane down"), choose the matching Higgsfield camera-control preset if your model offers one.

### Style lock — append to **every** prompt

> Cinematic photorealism, natural Himalayan light, deep warm shadows, colour palette of charcoal stone black, antique temple-brass gold, parchment cream and rhododendron rust with touches of deodar green, subtle 35 mm film grain, shallow depth of field, high dynamic range, premium editorial quality. No text, no logos, no watermarks, no visible faces.

(Packshots P1–P4 are the one exception to "no text / no logos"; their prompts override it.)

### Negative prompt (where the model has a field for it)

> text, letters, watermark, logo, signature, cartoon, illustration, 3D render look, plastic textures, oversaturated, HDR halos, extra fingers, deformed hands, low resolution, blurry, jpeg artifacts

For video, add:

> cuts, scene changes, jump cut, flicker, strobing, fast motion, whip pan, camera shake, speed ramp, morphing faces

### Consistency trick

Generate **L1** (the brand plate) first and attach it as a **style/reference image** to every other still. It sets the brass, stone and golden-hour look for the whole shoot. For the packshots, also attach a screenshot of the bag the site renders today (Collection section, before P1–P4 exist). That bag is the packaging design brief.

---

## 1. Hero scroll film — HK0–HK4 → H1–H4

The hero is one continuous camera move from **above the clouds** down to **the pour**, scrubbed by scroll. It maps onto the four on-screen chapters:

| Scroll | Chapter | Clip | From → to |
|---|---|---|---|
| 0–25 % | I · Above the clouds | H1 | HK0 → HK1 |
| 25–50 % | II · Where the road ends | H2 | HK1 → HK2 |
| 50–75 % | III · Fire & brass | H3 | HK2 → HK3 |
| 75–100 % | IV · Brewed for the soul | H4 | HK3 → HK4 |

### Rules that make footage scrub well

1. **One direction of travel.** Forward and down, always. Scrolling back up then reads as the camera flying back.
2. **Constant speed.** No speed ramps and no ease-in/ease-out inside a clip. Scroll speed is the only speed.
3. **Low motion blur.** Scrubbing shows individual frames; smeared frames look broken. Add "crisp, fast shutter, minimal motion blur".
4. **No flicker, no cuts, no text.** Lighting changes slowly across the whole film, not inside a clip.
5. **Joins are keyframes.** Each clip's end frame is the next clip's start frame, so the four clips meet invisibly.
6. **Format.** 16:9, 1080p or higher, 24–30 fps, about 5 s each (up to 8 s is fine), MP4.

### Keyframes (stills, 16:9, 2560 × 1440 or the largest your model allows)

**HK0 — Above the clouds**
> Pre-dawn aerial view high above a sea of clouds in the Indian Himalaya. A single immense snow-covered peak rises through the cloud layer, its summit catching the very first pink-gold alpenglow while the valleys beneath the clouds are still in deep blue shadow. A thin crescent moon and the last fading stars. Camera at cloud level looking toward the peak with a slight downward tilt. Epic scale, silent, serene. Darker lower third.

**HK1 — Where the road ends**
> Low aerial view just below the cloud line at sunrise over a Pahari hill village: Kath-Kuni houses built from alternating layers of deodar timber and grey stone with slate roofs, clinging to steep terraced slopes, ringed by dark deodar forest. Rows of coffee shrubs with glossy dark-green leaves on the terraces in the foreground. Low golden sunlight raking across the terraces, wisps of mist in the valley, snow peaks glowing behind. Camera slightly above the terraces, looking forward and down.

**HK2 — The cherry**
> Extreme macro close-up of a cluster of ripe crimson coffee cherries on a branch, beaded with morning dew, glossy dark-green leaves. Warm sunrise backlight makes the cherries glow like rubies. Very shallow depth of field; in the soft bokeh far behind, the terraced village and snow peaks. Crisp detail, fast shutter.

**HK3 — Fire & brass**
> Macro close-up inside a dim Pahari kitchen: freshly roasted dark-brown coffee beans tumbling in a hand-beaten brass pan over glowing wood embers. Thin wisps of smoke curl upward and catch a single shaft of window light. A carved deodar-wood window frame softly blurred in the background. Warm amber glow, a few floating sparks, crisp beans, minimal motion blur.

**HK4 — The pour**
> A slow, glossy stream of espresso pouring into a clear double-walled glass cup standing on a slab of dark Himalayan slate. Thick hazel crema blooming and swirling. Beside it, a small hand-beaten brass bowl of roasted beans and the folded edge of a Kullu shawl with a geometric border in rust, saffron, brass-gold and deodar green. Behind, a carved wooden window opens onto snow-capped Himalayan peaks at golden hour. Macro, shallow depth of field. Leave calm darker space on the left for text.

### Clips (start frame + end frame, 16:9, about 5 s)

**H1 — HK0 → HK1** · camera: *crane down / slow FPV descent*
> One continuous, smooth aerial descent. The camera glides forward and down through sunlit clouds and emerges above terraced hills and a Pahari village as the sun rises. Constant speed, single unbroken shot, no cuts, no speed ramps, crisp frames.

**H2 — HK1 → HK2** · camera: *dolly in / super dolly*
> A seamless forward glide low over the coffee terraces toward a single coffee shrub, pushing in continuously until a cluster of ripe red coffee cherries fills the frame in macro. Constant speed, single unbroken shot, shallow depth of field, crisp frames.

**H3 — HK2 → HK3** · camera: *push in*
> The camera keeps pushing forward into the glowing red cherries; as it passes through them the scene flows in one continuous match-move into roasted coffee beans tumbling in a hand-beaten brass pan over embers. The red of the cherries becomes the ember glow. Fluid, continuous, no hard cut, crisp frames.

**H4 — HK3 → HK4** · camera: *crane up + slow track*
> The camera rises gently from the brass roasting pan and drifts across a dark slate table to a clear glass cup as a slow stream of espresso pours into it, crema blooming. The carved window and the snow peaks behind come into focus. Slow motion, continuous single shot, constant speed.

**Export:** download each clip as MP4 and save as
`media-src/hero/landscape/01.mp4`, `02.mp4`, `03.mp4`, `04.mp4` (H1→H4 in order).

### Optional: portrait cut for phones (9:16)

Re-generate HK0–HK4 at **9:16** with "vertical composition, subject centred in the frame" added, then H1–H4 at 9:16 from those, and save them to `media-src/hero/portrait/01.mp4 … 04.mp4`. If you skip this, the script centre-crops the landscape clips for phones (`--focus 0.35` shifts the crop left, `0.65` right).

Then run `npm run media:hero`.

---

## 2. Upcoming background loop — UK → U1

This loop plays behind the glass cards, so it must be **calm, dark in the lower two-thirds and slow**.

**UK — loop keyframe (still, 16:9)**
> Blue-hour view across a deep Himalayan valley: layer after layer of deodar-forested ridges fading into drifting mist, snow peaks under a rising full moon in the upper third of the frame, a few warm lamp-lit windows of a distant hill village. Deep indigo and silver palette with tiny warm amber accents. Wide, still, meditative. The lower two-thirds of the frame is dark and uncluttered.

**U1 — loop clip (start frame = UK, end frame = UK, 16:9, about 10 s)** · camera: *static / very slow drift right*
> Nearly static wide shot of a Himalayan valley at blue hour. Mist rolls slowly through the valley, thin clouds drift past the moonlit peaks, distant lamp lights flicker softly. Extremely slow, gentle, hypnotic motion. Seamless loop: the final frame matches the first.

Save as `media-src/upcoming/loop.mp4`. For phones, optionally generate a 9:16 version from a 9:16 UK and save it as `media-src/upcoming/loop-portrait.mp4`.

Run `npm run media:loop`. If your clip already loops perfectly, use `npm run media:loop -- --crossfade 0`.

---

## 3. Brand & story stills

Save each export as `media-src/stills/<ID>.png` (or .jpg/.webp), then run `npm run media:stills`.

**L1 — Enhanced brand plate** · 1:1 · → `public/media/brand/mahve-signage.webp`
Attach your original logo image as the reference.
> Refined brand signage for "MAHVÉ COFFEE". A gold monogram M sits under a line of Himalayan peaks with a small rising sun; a single coffee bean rests in the valley of the M; an eight-petal Pahari rosette hangs from a thin stem beside it. Everything is cast in brushed antique brass and mounted on a dark, hand-chiselled slate wall. Below the mark, the wordmark "MAHVÉ", then "COFFEE" flanked by thin rules, then "ROOTED IN THE HILLS · BREWED FOR THE SOUL" in small spaced capitals. To one side, a carved Kath-Kuni deodar window frame with a hanging brass temple bell opens onto snow peaks at golden hour; on the ledge, a hand-woven Kullu shawl with a rust, saffron and deodar-green geometric border and a brass bowl of roasted beans. Symmetrical, crisp lettering, luxurious, warm raking light.

> Your current supplied image is already installed at this path. L1 is only needed if you want the refined mark in the scene.

**S1 — Village establishing shot** · 16:9 · → `public/media/story/himalaya-village.webp`
> Wide establishing landscape at dawn: a Pahari hill village of Kath-Kuni houses with grey slate roofs on terraced slopes, thin woodsmoke rising from chimneys, dense deodar forest around it, and the snow-covered Dhauladhar range glowing pink behind. Soft mist in the valley. The lower third is darker and calm (statistics sit over it).

---

## 4. Products — packshots P1–P4 (4:5) and scenes P1S–P4S (16:9)

### Packshot template (fill in the brackets)

> The coffee names and colours below belong to the **placeholder lineup** in `src/content/products.ts`. Use your real product names on the packs. A generated label is artwork, not product information.

> Premium studio packshot of a single matte stand-up coffee pouch in deep [COLOUR], standing on a slab of dark slate. Across the upper part of the pouch runs a printed band of hand-woven Kullu shawl pattern: rust rails, saffron sawtooth and brass-gold and deodar-green diamond lozenges. Below it, a brushed-brass foil emblem (Himalayan peaks, a small sun and a monogram M), the word "MAHVÉ" in small widely spaced capitals, and "[NAME]" in an elegant italic serif. A few [PROPS] scattered at the base. Background pure charcoal black (#0b0907) with a soft warm rim light from behind and a faint [COLOUR] glow. Centred, the pouch filling about 70 % of the frame height, 4:5 vertical, photoreal, perfectly legible label.

| ID | [NAME] | [COLOUR] | [PROPS] | Output |
|---|---|---|---|---|
| P1 | Buransh | rhododendron crimson | fresh red rhododendron blossoms and light-roasted beans | `products/buransh-pack.webp` |
| P2 | Kafal | dark wild-berry wine | wild red-purple kafal berries and roasted beans | `products/kafal-pack.webp` |
| P3 | Deodar | deep deodar-forest green | deodar cones, cedar sprigs, a piece of dark jaggery, dark-roasted beans | `products/deodar-pack.webp` |
| P4 | Dhauladhar | dark bronze with gold | roasted beans, whole almonds, a curl of orange peel, a small brass cup | `products/dhauladhar-pack.webp` |

### Product-page scenes (16:9, keep the left half calm and dark for text)

**P1S — Buransh** → `products/buransh-scene.webp`
> Dawn on a Himalayan hillside of blooming red rhododendron (buransh) trees. A V60 pour-over brews on a flat stone ledge, steam curling into cold air; petals scattered on the stone; soft pink first light; snow peaks far behind.

**P2S — Kafal** → `products/kafal-scene.webp`
> A dappled oak-and-pine forest trail in May. A small woven basket of wild kafal berries sits beside an AeroPress and an enamel cup on a mossy rock. Shafts of sunlight through the canopy, rich red and green tones.

**P3S — Deodar** → `products/deodar-scene.webp`
> A winter evening inside a Kath-Kuni home: a moka pot steams on a cast-iron bukhari wood stove, deodar logs stacked beside it, snow falling beyond a carved wooden window, warm firelight and deep shadows.

**P4S — Dhauladhar** → `products/dhauladhar-scene.webp`
> A café window in the Kangra valley at golden hour: an espresso and a flat white with latte art on a dark slate counter, the white-capped Dhauladhar range framed in the window, tea gardens rolling below.

---

## 5. Craft bento — C1–C4

**C1 — Picked at first light** · 1:1 · → `craft/harvest.webp`
> Close-up of weathered hands (no face) picking ripe red coffee cherries into a woven bamboo basket at first light on a misty terraced hillside, dew on the leaves, warm backlight.

**C2 — Dried on bamboo** · 2:1 · → `craft/drying.webp`
> Raised bamboo drying beds on a Himalayan hillside covered with red and burgundy coffee cherries drying in the sun, a wooden rake resting across one bed, terraced slopes and snow peaks behind. Wide, high-angle shot.

**C3 — Roasted slow** · 1:1 · → `craft/roasting.webp`
> A small-batch drum coffee roaster with brass fittings in a stone-walled roastery; freshly roasted beans pour into the round cooling tray as the stirring arms turn, steam and warm light rising.

**C4 — Brewed with care** · 1:1 · → `craft/brewing.webp`
> Overhead view of a pour-over brewing through a hand-beaten brass dripper into a brass cup on a slate board, the edge of a Kullu shawl, a handwritten recipe card and a scatter of beans. Calm, warm, orderly.

---

## 6. Upcoming releases — U2–U7 (4:3 cards)

**U2 — Kinnaur Apple Cask** → `upcoming/kinnaur-apple-cask.webp`
> Green coffee beans spilling from a small hand-made cask of weathered apple wood in a stone cellar, red Kinnauri apples and curls of cinnamon bark beside it, apple orchards and snow peaks glimpsed through a small window.

**U3 — Bugyal Reserve** → `upcoming/bugyal-reserve.webp`
> A high alpine meadow (bugyal) above the treeline in full bloom with tiny wildflowers at dawn. A single numbered glass jar of pale green coffee beans rests on a lichen-covered rock, snow peaks and mist behind.

**U4 — Kesar Kahwa** → `upcoming/kesar-kahwa.webp`
> A brass kettle pouring golden saffron-infused coffee into small glass cups on a carved walnut-wood tray, with saffron threads, green cardamom pods and slivered almonds, warm festive lamplight.

**U5 — The Brass Dripper** → `upcoming/brass-dripper.webp`
> A hand-beaten brass pour-over dripper with a rich hammered texture standing on a slate slab, coffee dripping into a brass cup below, traditional Chamba metal-craft detailing along its rim, dramatic side light.

**U6 — Kullu Weave Brew Kit** → `upcoming/kullu-brew-kit.webp`
> A travel coffee kit (hand grinder, dripper, two enamel cups, a coffee pouch) unrolled from a hand-loomed wool wrap with a Kullu geometric border, laid on a mountain rock beside a trekking trail in morning light.

**U7 — Deodar & Slate Set** → `upcoming/deodar-slate-set.webp`
> A hand-carved deodar-wood coffee scoop resting on a rectangular grey Kangra slate board with a small mound of roasted beans and a few fragrant cedar shavings. Minimal, tactile, top-light.

---

## 7. Export checklist

| ID | Aspect | Save your export as | Final file (created by the script) |
|---|---|---|---|
| H1–H4 | 16:9 video | `media-src/hero/landscape/01–04.mp4` | `public/media/hero/desktop/frame_####.webp` |
| H1–H4 (opt.) | 9:16 video | `media-src/hero/portrait/01–04.mp4` | `public/media/hero/mobile/frame_####.webp` |
| U1 | 16:9 video | `media-src/upcoming/loop.mp4` | `public/media/upcoming/loop-desktop.{webm,mp4}`, `loop-poster.webp` |
| U1 (opt.) | 9:16 video | `media-src/upcoming/loop-portrait.mp4` | `public/media/upcoming/loop-mobile.mp4` |
| L1 | 1:1 | `media-src/stills/BRAND.png` | `public/media/brand/mahve-signage.webp` |
| S1 | 16:9 | `media-src/stills/S1.png` | `public/media/story/himalaya-village.webp` |
| P1–P4 | 4:5 | `media-src/stills/P1.png` … | `public/media/products/*-pack.webp` |
| P1S–P4S | 16:9 | `media-src/stills/P1S.png` … | `public/media/products/*-scene.webp` |
| C1–C4 | 1:1 / 2:1 | `media-src/stills/C1.png` … | `public/media/craft/*.webp` |
| U2–U7 | 4:3 | `media-src/stills/U2.png` … | `public/media/upcoming/*.webp` |

`npm run media:check` shows what is still missing at any point.
