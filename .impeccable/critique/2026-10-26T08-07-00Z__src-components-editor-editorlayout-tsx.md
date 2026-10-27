---
target: src/components/editor/EditorLayout.tsx
total_score: 12
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:C:\\Users\\User\\Documents\\Rough Work\\bretscorner presents\\poster\\src\\components\\editor\\EditorLayout.tsx"
target_fingerprint: "sha256:f4de02ab27d677ac67cc1f9e32489fa604e3944ecfb2925be03c5c017e80b21c"
target_path: "C:\\Users\\User\\Documents\\Rough Work\\bretscorner presents\\poster\\src\\components\\editor\\EditorLayout.tsx"
timestamp: 2026-10-26T08-07-00Z
slug: src-components-editor-editorlayout-tsx
closed: true
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 1 | Zero visual confirmation on Save/Update; no progress indicator during canvas rendering, font loading, or multi-format export. |
| 2 | Match System / Real World | 2 | Clash of metaphors: 19th-century wooden easel and paintbrush cursor imposed on a graphic design studio; raw Cartesian coordinate jargon ("Offset X/Y", "Position Y"). |
| 3 | User Control and Freedom | 1 | No Undo/Redo (`Ctrl+Z` / `Ctrl+Y`); switching templates or clicking Auto-Theme irreversibly wipes custom styles and manual adjustments. |
| 4 | Consistency and Standards | 2 | Export settings split between sidebar and top navbar; conflicting typography hierarchies; theme tokens conflict with settings. |
| 5 | Error Prevention | 1 | Destructive actions lack confirmation; switching templates silently overwrites fine-tuned typography; clearing data uses browser `alert()`. |
| 6 | Recognition Rather Than Recall | 1 | 150+ fonts in plain-text dropdown without live typeface previews; template buttons are bare text names without visual layout thumbnail cards. |
| 7 | Flexibility and Efficiency | 1 | Zero keyboard shortcuts (`Ctrl+Z`, `Ctrl+S`, `Ctrl+E`); no bulk tracklist import/paste option (requires 36+ clicks for a 12-track album). |
| 8 | Aesthetic and Minimalist Design | 2 | Visual distraction from simulated wood easel rails and tripod legs; sidebar is an unchunked 474-line vertical dump of 30+ simultaneous inputs. |
| 9 | Error Recovery | 1 | Export errors trigger raw browser `alert()` popups; failed image or font loads fail silently to the developer console without recovery hints. |
| 10 | Help and Documentation | 0 | No onboarding tour, empty-state guidance, tooltips, or explanation of physical print dimensions, bleed (3mm), or margin safety zones. |
| **Total** | | **12/40** | **Poor (Major UX overhaul required; core experience broken)** |

---

### Design Specificity Verdict

**Verdict: Schizophrenic Metaphor & Category-Divergent Execution.**

- **LLM Assessment**: PosterMaker promises a precision graphic design tool for iconic music album posters (drawing on Swiss typography, Bauhaus minimalism, and vinyl sleeve culture). Instead, the interface wraps the digital canvas in an archaic 19th-century oil painting easel (`globals.css` defines wooden rails, tripod legs, and forces an artist's wooden paintbrush cursor across all elements). Meanwhile, the controls resemble an unstyled admin form with raw Cartesian coordinates ("Offset X", "Offset Y"). The product lacks the confident, tactile feel of a modern print and music studio (e.g. Teenage Engineering or Braun-inspired drafting aesthetics).
- **Deterministic Scan**: The automated Impeccable CLI scan (`impeccable detect --json`) ran across `src/components/editor/EditorLayout.tsx`, `Sidebar.tsx`, and `CanvasArea.tsx` and returned 0 static regex anti-pattern violations. However, the detector noted that static TSX scanning is an undercount because computed DOM rules (contrast, computed font sizes, tap targets) require a rendered page.
- **Visual Overlays**: No live dev server or browser automation session was active; live visual overlay injection was skipped.

---

### Overall Impression

PosterMaker has strong technical bones—a functional Fabric.js vector canvas, automated dominant color extraction, and real physical print dimensions (A4–A2, Letter, Tabloid with bleed guides). However, the UX is held back by an eccentric wooden easel metaphor, a daunting wall-of-inputs sidebar, zero undo/redo safety, and an agonizing manual tracklist entry flow. Stripping the faux-wood gimmick and modernizing the layout into a clean, studio-grade design workspace will instantly elevate the product to professional quality.

---

### What's Working

1. **Auto-Theme Extraction Engine**: `extractDominantColors` intelligently analyzes uploaded cover art to generate harmonious poster palettes and typography contrast.
2. **Fabric.js Canvas Engine**: Accurate vector manipulation, text scaling, alignment, and multi-format export capabilities (PNG, JPG, vector PDF via jsPDF).
3. **Print-First Foundations**: Support for standard physical paper dimensions with toggleable 3mm bleed and 10mm margin guides grounded in actual print production needs.

---

### Priority Issues

- **[P0] Absence of Undo/Redo & Zero Save Feedback**
  - **Why it matters**: In a creative tool, fear of irreversible mistakes causes user paralysis. Changing a template or clicking auto-theme irreversibly wipes custom styles. Furthermore, clicking "Save" produces no feedback, leaving users doubting whether their work is persisted.
  - **Fix**: Add undo/redo history to `posterStore.ts` hooked to `Ctrl+Z` / `Ctrl+Y` and top toolbar buttons. Add an explicit toast notification or saved-status timestamp in the toolbar.
  - **Suggested command**: `/impeccable harden src/components/editor/EditorLayout.tsx`

- **[P1] Metaphor Clash & Visual Clutter (Wooden Easel & Paintbrush Cursor)**
  - **Why it matters**: The faux-wood rails, tripod legs (`.easel-legs`), and global paintbrush cursor (`*, *::before, *::after`) in `globals.css` undermine the credibility of a modern Swiss-style graphic design tool. They also waste vertical screen real estate and distort the print preview.
  - **Fix**: Strip the wooden easel rails, legs, and global paintbrush cursor from `globals.css` and `CanvasArea.tsx`. Replace with an elevated, gallery-grade print preview framing (subtle elevation, clean drafting backdrop, precision cursor).
  - **Suggested command**: `/impeccable quieter src/app/globals.css`

- **[P1] Blind 150+ Font Selector & Text-Only Template Buttons**
  - **Why it matters**: Typography is the heart of an album poster. An unstyled native `<select>` with 150+ font names rendered in the system UI font forces blind guesswork. Similarly, templates are represented by 4 plain text buttons without visual previews of their layout.
  - **Fix**: Curate fonts into searchable music/design categories (Swiss Sans, Serif, Display, Monospace) with rendered typeface previews. Replace template text buttons with visual mini-poster thumbnail cards.
  - **Suggested command**: `/impeccable typeset src/components/editor/Sidebar.tsx`

- **[P1] Disjointed IA & Wall-of-Inputs Sidebar**
  - **Why it matters**: The 250px sidebar presents 30+ controls vertically with no progressive disclosure. Export format and quality are located in the sidebar, while the primary "Export" button is hundreds of pixels away in the top toolbar.
  - **Fix**: Restructure the sidebar into a clean progressive workflow: (1) Artwork & Colors, (2) Album Info & Tracklist, (3) Typography & Layout, (4) Print Setup. Group export settings directly with the Export action in the top bar.
  - **Suggested command**: `/impeccable layout src/components/editor/Sidebar.tsx`

- **[P2] Friction-Heavy Tracklist Entry & Developer Jargon**
  - **Why it matters**: Entering a standard 12-track album requires 36+ clicks to manually add and type each track and duration. Furthermore, technical terms like "Offset X/Y" and "Position Y" confuse non-technical music enthusiasts.
  - **Fix**: Add a "Paste Tracklist" modal that auto-parses pasted tracklists from Spotify, Bandcamp, or Apple Music. Rename Cartesian coordinates to intuitive terms ("Horizontal Shift", "Vertical Position").
  - **Suggested command**: `/impeccable clarify src/components/editor/Sidebar.tsx`

---

### Persona Red Flags

- **Alex (Power User)**: Cannot press `Ctrl+Z` to undo, `Ctrl+S` to save, `Ctrl+E` to export, or arrow keys to nudge elements. Must click 36+ times to enter a 12-song tracklist without bulk import. High risk of immediate abandonment.
- **Jordan (First-Timer)**: Confronted by an unguided 474-line sidebar with 30+ simultaneous inputs and an unstyled 150-font list with no visual previews. Clicks "Save" and sees no feedback, wondering if the poster saved.
- **Sam (Accessibility-Dependent)**: The global custom SVG paintbrush cursor overrides standard browser focus and pointer affordances. Muted labels with `opacity-60` on `--text3` fail WCAG AA contrast (2.2:1 vs 4.5:1). Delete track buttons are hidden behind hover and inaccessible via keyboard navigation.

---

### Minor Observations

1. `EditorLayout.tsx` forces `document.documentElement.setAttribute('data-theme', 'light')` on mount, overwriting user preferences from Settings.
2. `CanvasArea.tsx` hardcodes export `multiplier = 2`, decoupling export output from the DPI preset selected in settings.
3. The bottom status bar includes `bret's corner presents...` at 50% opacity, diluting professional quality.
4. Color selection uses an unvalidated native color input with no palette presets or contrast warnings.
5. Canvas frame borders in `globals.css` clip the edge of the poster, distorting the true print aspect ratio.

---

### Questions to Consider

- *What if the canvas was presented as an elevated gallery print or vinyl sleeve on a minimalist drafting table, completely ditching the wooden painter's easel and paintbrush cursor?*
- *What if adding an entire album tracklist took 3 seconds via a "Paste Tracklist" modal instead of 15 minutes of manual line-by-line input?*
- *What if typography was curated into iconic music genres and design movements ("Swiss International", "Vintage Vinyl", "Modern Brutalist") with live poster specimens instead of an unstyled 150-font dropdown?*
