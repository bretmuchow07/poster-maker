# PosterMaker Design System & Architecture Specification

> **Document Version**: 2.0.0  
> **Target**: Physical Print, Gallery Displays, and In-Browser High-DPI Poster Rendering  
> **Philosophy**: Grounded in authentic vinyl sleeve, tour print, and Swiss modernist drafting traditions. Zero generic AI clichés, zero rigid template traps, zero celebrity/real-people demo dependencies.

---

## 1. Visual Identity & Design Principles

### A. Subject-Matter Grounding
PosterMaker is an archival music print atelier. The interface and output are treated as physical press proofing surfaces:
- **Paper Canvas**: Uncoated, warm off-white, matte studio stocks (`#F5F3EE`, `#0E0E10`, `#F5A8B8`, `#141416`).
- **Tactile Ink Hierarchy**: High-contrast grotesks paired with functional monospaces and human cursive autographs.
- **Museum Mount**: 4-side framing borders, bleed/margin registration guides, and authentic Swiss grid alignment.
- **No Marketing Slop**: Truthful to actual system capabilities (in-browser canvas processing, bulk track parsing, client-side color quantization, 300 DPI exports).

---

## 2. Core Color Tokens & Theme System

The design system shares an identical, unified atelier palette across both the **Landing Page** and the **Studio Editor**, supporting **Darkroom Studio Mode** (default) and **Gallery Light Mode** via master CSS variables on `[data-theme="dark"]` and `[data-theme="light"]`.

### Unified Master Atelier Palette
| Token | Dark Mode (`[data-theme="dark"]`) | Light Mode (`[data-theme="light"]`) | Role |
| :--- | :--- | :--- | :--- |
| `--bg` | `#121214` | `#f6f5f0` | Main drafting viewport & page background |
| `--surface` | `#18181b` | `#ffffff` | Inspector dock, sticky header, cards, modals |
| `--surface2` | `#242428` | `#eeebe2` | Hover elevations, secondary buttons, input backgrounds |
| `--surface3` | `#323238` | `#e2ded4` | Subtle container borders and chip fills |
| `--border-color` | `rgba(255, 255, 255, 0.09)` | `rgba(0, 0, 0, 0.08)` | Structural layout dividers and card outlines |
| `--border-hover` | `rgba(255, 255, 255, 0.18)` | `rgba(0, 0, 0, 0.16)` | Interactive hover borders |
| `--accent` | `#f59e0b` | `#f59e0b` | Unified studio amber primary brand color |
| `--accent-hover` | `#fbbf24` | `#d97706` | Interactive hover accent |
| `--accent-foreground` | `#2a1700` | `#2a1700` | High-contrast WCAG AAA text on amber buttons |
| `--text` | `#f4f4f5` | `#18181b` | Primary display typography & titles |
| `--text2` | `#a1a1aa` | `#52525b` | Secondary descriptions, subheadings, metadata |
| `--text3` | `#71717a` | `#71717a` | Technical specs, registration marks, subtle labels |
| `--landing-text-muted` | `#d8c3ad` | `#44403c` | Explanatory subheadlines |
| `--landing-text-subtle` | `#a08e7a` | `#78716c` | Card descriptions, specs, footer links |
| `--landing-header-bg` | `rgba(18, 19, 21, 0.92)` | `rgba(249, 248, 245, 0.92)` | Backdrop-blur sticky navigation bar |

### Print Stock Presets
- **Natural Cream Archive**: `#F5F3EE` (Default for Swiss Modern & Palette Grid)
- **Studio Matte Black**: `#0E0E10` (High contrast vinyl sleeve)
- **Millennial Editorial Pink**: `#F5A8B8` (Monochromatic newsprint archetype)
- **Modern Studio Noir**: `#141416` (Deep black edge-to-edge finish)

---

## 3. Typographic Scale & Font Roles

1. **Primary Headline & Display**:
   - *Space Grotesk*, *Inter*, *Oswald*, *Syne*.
   - Used for giant stacked album titles, uppercase artist banners, and brutalist impact.
2. **Technical & Archival Metadata**:
   - *JetBrains Mono*, *Space Mono*.
   - Used for catalog numbers, runtimes, tracklist indices, release dates, and inline slashed track streams.
3. **Editorial & Human Layer**:
   - *Caveat*, *Alex Brush*, *Reenie Beanie*.
   - Used for artist cursive signatures, autographs, and personal liner notes.
4. **Body & Liner Credits**:
   - Clean, neutral sans-serif with tracked caps (`letter-spacing: 0.1em`).
   - Used for producer credits (`ALL COMPOSITIONS WRITTEN, PRODUCED AND ARRANGED BY...`) and record label publishing blocks.

---

## 4. Poster Archetype Specifications & Wireframes

All layouts use abstract or neutral project names (*Echo Velocity*, *Studio Recordings*, *Solene Grey*, *KALEIDOSCOPE*) to eliminate reliance on celebrity/real-people names.

### Archetype 1: Swiss Palette Grid (`palette`)
* **Inspiration**: Asymmetric 2-Column Swiss Modernist Grid.
* **Structure**: Framed 4:3 or 1:1 artwork occupying the upper 55% of the sheet. Lower 45% divided into an asymmetric 2-column grid featuring 5 extracted color swatches, ordered tracklist, label/runtime metadata, and artist signature layer.
* **Layout Grid**:
```
+---------------------------------------------+
| SWISS COLOR SWATCH   | PROJECT • 2024       |
| +-----------------------------------------+ |
| |                                         | |
| |           [ FRAMED ARTWORK ]            | |
| |                                         | |
| +-----------------------------------------+ |
| [TRACKLIST COLUMN]    | [TITLE & SWATCHES]  |
| 01. TRACK ONE  03:45  | [S1][S2][S3][S4][S5]|
| 02. TRACK TWO  04:12  | ARTIST NAME         |
| 03. TRACK THREE 02:58 | ALBUM TITLE         |
| ...                   | STACKED DISPLAY     |
|                       | Artist Signature    |
| LABEL: APERTURE DISCS |                     |
| LENGTH: 58:14         | RELEASED: OCT 2024  |
+---------------------------------------------+
```

---

### Archetype 2: Brutalist Inset Rule (`minimal`)
* **Inspiration**: Fine Hairline Inset & Slashed Monospace Typography.
* **Structure**: Monochromatic dyed paper stock framed by an inset hairline border rule (15–20mm from edge). Inline slashed tracklist above centered artwork; high-impact grotesque typography and liner notes below.
* **Layout Grid**:
```
+---------------------------------------------+
|  +---------------------------------------+  |
|  | TRACK 01 / TRACK 02 / TRACK 03 / ...  |  |
|  |                                       |  |
|  |          [ CENTERED ARTWORK ]         |  |
|  |                                       |  |
|  |              ALBUM TITLE              |  |
|  |              ARTIST NAME              |  |
|  |                                       |  |
|  |    ALL COMPOSITIONS WRITTEN & ...     |  |
|  |    EDITORIAL PRESS • 2024             |  |
|  +---------------------------------------+  |
+---------------------------------------------+
```

---

### Archetype 3: Cinematic Split (`split`)
* **Inspiration**: Photographic Edge Fade & Kinetic Blur Echo.
* **Structure**: Upper photographic bleed blending into deep tone paper via baked alpha gradient. Kinetic ghost blur title echo, balanced 2-column tracklist with feature credits and record label publishing block.
* **Layout Grid**:
```
+---------------------------------------------+
| CINEMATIC SPLIT      | PROJECT • 2024       |
| +-----------------------------------------+ |
| | [ BLEED ARTWORK WITH ALPHA BOTTOM FADE ]| |
| |                                         | |
| |        KINETIC BLUR TITLE ECHO          | |
| +-----------------------------------------+ |
| ALBUM TITLE                  PARENTAL       |
| ARTIST NAME                  ADVISORY       |
|                                             |
| COL 1 (Tracks 1-6)    | COL 2 (Tracks 7-12) |
| 01. TRACK TITLE       | 07. TRACK TITLE     |
|                                             |
| [ LABEL PUBLISHING: APERTURE DISCS ]        |
+---------------------------------------------+
```

---

### Archetype 4: Modern Studio (`modern`)
* **Inspiration**: Edge-to-Edge Vinyl Sleeve Edition.
* **Structure**: Dominant edge-to-edge album artwork taking center stage, accompanied by bold stacked artist titles, an optional scannable streaming QR code, and a parental advisory badge.
* **Layout Grid**:
```
+---------------------------------------------+
| +-----------------------------------------+ |
| |                                         | |
| |        [ EDGE-TO-EDGE ARTWORK ]         | |
| |                                         | |
| +-----------------------------------------+ |
| ARTIST NAME                                 |
| ALBUM TITLE DISPLAY                         |
|                                             |
| [ 2-COLUMN TRACKLIST ]   | [ QR CODE &      |
| 01. SONG ONE     03:30   |   LABEL MARKS ]  |
| 02. SONG TWO     04:15   |                  |
+---------------------------------------------+
```

---

## 5. Canvas Engine & Graphics Architecture

1. **Fabric.js 7.1 Multi-Layer Pipeline**:
   - Background canvas color and substrate texture.
   - Draggable & scalable album artwork object.
   - Non-destructive bottom edge fade: `applyImageEdgeFade()` bakes an alpha transparency gradient directly into an off-screen canvas, melting the bottom edge seamlessly into the poster background without floating overlays.
   - Movable Swatch Group: Extracted 5-color palette rendered as an interactive Fabric.js group (square, rounded, or circle shapes).
2. **Median-Cut Color Extraction**:
   - Client-side ColorThief palette sampling returns 5 dominant swatches.
   - Auto-theming calculates harmonious background and typography color pairings.
3. **Bulk Tracklist Auto-Parser**:
   - Ingests raw text copied from Spotify, Apple Music, Bandcamp, or Wikipedia.
   - Regex-based extraction auto-detects track numbers, titles, and timestamps (`01. Song Title 3:45`) and generates clean two-column layouts.
4. **Deep-Link State Ingestion**:
   - `/editor?template={id}&artist={name}&album={title}` reads URL query parameters inside `<Suspense>` to load any archetype directly into the canvas.

---

## 6. HyperFrames Animation Integration

The landing page implements the motion craft rules from the `hyperframes-animation` skill:
- **`ambient-glow-bloom`**: Soft, un-triggered radial amber glow behind the hero triptych (`opacity: 0.25–0.40`) giving depth and studio atmosphere.
- **`split-tilt-cards`**: 3D perspective viewport (`perspective: 1200px`) with opposing perspective balance on outer cards and center elevation on the primary archetype.
- **`press-release-spring`**: Tactile button compression on tap (`scale: 0.96`) and spring release recovery (`[0.16, 1, 0.3, 1]`) on all conversion CTAs.
- **Capped Staggers**: Entrance sequences capped to $\le 0.5\text{s}$ total to preserve punchy single-beat cadence without sluggishness.
- **Transform-Only Motion**: Animations strictly avoid mutating `width`, `height`, `top`, or `left` to prevent DOM layout thrashing.

---

## 7. Print & Export Calibrations

- **ISO Standard Formats**: A4 ($210 \times 297\text{ mm}$), A3 ($297 \times 420\text{ mm}$), A2 ($420 \times 594\text{ mm}$).
- **US Gallery Formats**: $12 \times 12″$ ($305 \times 305\text{ mm}$ vinyl sleeve), $18 \times 24″$ ($457 \times 610\text{ mm}$ standard retail frame), $24 \times 36″$ ($610 \times 914\text{ mm}$ tour poster).
- **Export Formats**: PNG, JPG, and Vector PDF.
- **DPI Modes**: 72 DPI (Web preview), 150 DPI (Desk proof), 300 DPI (Archival press print).
- **Guides**: Toggleable $3\text{ mm}$ bleed box and $10\text{ mm}$ safe margins.
