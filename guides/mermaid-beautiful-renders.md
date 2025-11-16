# Mermaid Diagrams — Beautiful Render Spec (for implementation)

This document specifies exactly how to produce consistently beautiful Mermaid diagram renders in this project. It is written for another coding agent to implement without guesswork.

Status: approved spec
Owner: doc-builder
Repo touchpoints: `doc-builder.config.js`, `assets/js/main.js`, `html/`, `html-static/`, `cli.js`, `lib/`

---

## Goals

- High-quality visuals across light/dark themes with Notion-like aesthetics
- Consistent typography, spacing, and legibility on all diagrams
- Smooth client-side UX (zoom, fullscreen, copy SVG/source)
- Optional pre-render to SVG/PNG/PDF for static output and print/PDF workflows
- Safe, deterministic, cacheable rendering with clear error handling

## Inputs and Outputs

- Input: Markdown code fences labeled `mermaid` or `mermaid` directives in HTML containers.
- Client output: In-page rendered SVGs with enhanced theme and controls.
- Build output (optional pre-render):
  - Inline SVG embedded into HTML
  - Or external assets in `html/diagrams/` (and `html-static/diagrams/`) with hashed filenames
  - Additional export variants: PNG @2x and PDF for select diagrams

## Rendering Approaches

We support two complementary approaches:

1) Client-side render (already present, refine only)
   - Uses Mermaid runtime in browser.
   - Enhanced theme and UX are configured in `assets/js/main.js`.
   - Pros: No build-time dependency; interactive features (zoom/fullscreen/copy).
   - Cons: Requires JS at runtime; print/PDF can be inconsistent; static export less ideal.

2) Pre-render during build (to implement)
   - Use `@mermaid-js/mermaid-cli` (mmdc) via Puppeteer (headless Chromium) to produce SVG/PNG/PDF.
   - Embed inline SVG (preferred) or link external assets; keep client-side controls optionally enabled.
   - Pros: Deterministic, fast load, great for static exports and print/PDF.
   - Cons: Adds a build dependency and caching logic.

We will keep client-side rendering as default and add an opt-in pre-render step. If a diagram is pre-rendered, the client-side script must skip re-rendering (detection by `data-prerendered="true"`).

## Visual Design

- Base: Mermaid `theme: 'base'` with custom `themeVariables`.
- Typography: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` (system UI stack).
- Font size: `16px` for readability; allow diagram-specific overrides via `%%{init: { 'themeVariables': { 'fontSize': '14px' }}}%%` when needed.
- Colors:
  - Light: primaryColor `#F7F6F3`, text `#37352F`, border `#E3E2E0`, lines `#787774`, background `#FFFFFF`.
  - Dark: primaryColor `#2F2F2F`, text `#E3E2E0`, border `#454545`, lines `#9B9A97`, background `#1A1A1A`.
- Layout:
  - Flowcharts: `curve: 'basis'`, `padding: 20`, `nodeSpacing: 50`, `rankSpacing: 50`, `marginX/Y: 20`.
  - Sequence: actorMargin 50, messageMargin 35, etc.
  - Gantt: tuned paddings and font sizes.
- Responsiveness: SVG must have `viewBox` + `preserveAspectRatio` set for scale-up without blur.
- Accessibility: SVG must include a `title` and `desc` if provided; set role `img` via `aria-label` or `aria-labelledby`.

Note: The client code in `assets/js/main.js` already sets the theme and wraps diagrams with controls. Preserve these behaviors and extend where noted below.

## Safety

- Set Mermaid `securityLevel: 'strict'` and `htmlLabels: false` by default.
- Sanitize code blocks (no raw HTML; no script execution).
- Do not trust diagram IDs—normalize or hash if emitting external assets.

## Implementation Plan

1) Client-side polish (quick wins)
   - Ensure theme config in `assets/js/main.js` includes `securityLevel: 'strict'` and `htmlLabels: false`.
   - After `mermaid.run()`, ensure every diagram SVG gets:
     - `class="mermaid-svg"`
     - `preserveAspectRatio="xMidYMid meet"`
     - `width: 100%` via CSS; intrinsic size via `viewBox`.
   - Add optional title/desc: look for preceding heading or `data-title`, `data-desc` on the `.mermaid` container; inject into SVG.
   - Mark pre-rendered diagrams with `data-prerendered="true"` so `mermaid.run()` skips them.

2) Pre-render pipeline (Node, opt-in)
   - Add config flags to `doc-builder.config.js` (under `features`):
     - `mermaidPrerender: false` (default)
     - `mermaidPrerenderFormats: ["svg"]`
     - `mermaidPrerenderScale: 2` (for PNG)
     - `mermaidPrerenderInlineSvg: true`
   - Implement a Node module `lib/mermaid-prerender.js` that:
     - Scans Markdown AST for code fences with `lang === 'mermaid'`.
     - Computes a cache key: SHA1 of diagram source + theme JSON + mermaid version.
     - If cache hit, reuse rendered assets; else render via `@mermaid-js/mermaid-cli`.
     - Rendering command examples:
       - SVG: `mmdc -i temp.mmd -o out.svg --theme base --themeVariables theme.json --scale 1 --backgroundColor transparent`
       - PNG: `mmdc -i temp.mmd -o out.png --theme base --themeVariables theme.json --scale 2`
       - PDF: `mmdc -i temp.mmd -o out.pdf --theme base --themeVariables theme.json`
     - Use a persistent cache directory: `.cache/mermaid/` (gitignored).
     - Place assets under `html/diagrams/` (and `html-static/diagrams/` when building static).
     - For inline SVG: read the SVG and embed directly; annotate container with `data-prerendered="true"` and original source in `data-mermaid-source`.
   - Provide a shared theme JSON on disk (e.g., `assets/mermaid-theme.json`) generated from the same values used in `assets/js/main.js` for parity.

3) Build integration
   - In `cli.js` or the build runner, add a phase before HTML emission:
     - If `features.mermaidPrerender` is true, run `lib/mermaid-prerender.js` on all Markdown files in `docs/`.
     - Replace each ` ```mermaid` fence with either inline SVG or a reference to the generated asset.
   - Ensure `features.staticOutput` works with pre-rendered assets without requiring runtime Mermaid.
   - When `features.mermaidPrerender` is false, keep existing client-side flow unchanged.

4) CSS and UX
   - Keep toolbar/fullscreen/zoom/copy features. For pre-rendered SVGs, the controls still apply.
   - Ensure `.mermaid-container` respects aspect ratio and scrolls gracefully at large zooms.
   - Add CSS: `.mermaid-svg { max-width: 100%; height: auto; }`.

5) Error handling and fallbacks
   - Client: if parsing/rendering fails, show a styled error block with the error message and a “copy source” button.
   - Build: if `mmdc` fails, emit a warning and leave the original code fence for client-side render at runtime.
   - Always preserve the original Mermaid source in `data-mermaid-source` to enable “Copy Source”.

6) Testing
   - Add sample diagrams in `test-docs/` covering: flowchart, sequence, class, state, ER, Gantt, pie.
   - Visual QA: ensure light/dark parity, spacing, arrowhead clarity, label wrapping.
   - Print/PDF: generate a sample page with 3–5 diagrams and export to PDF—verify no clipped edges and readable text.
   - Cache: re-run build twice; second run should skip renders (compare timings/logs).

## Detailed Steps (Do This)

1) Add config toggles
   - Update `doc-builder.config.js` under `features` with:
     - `mermaidPrerender` (boolean)
     - `mermaidPrerenderFormats` (array: `"svg"`, `"png"`, `"pdf"`)
     - `mermaidPrerenderScale` (number)
     - `mermaidPrerenderInlineSvg` (boolean)

2) Extract theme variables
   - Create `assets/mermaid-theme.json` from the theme objects in `assets/js/main.js`.
   - Export both a `light` and `dark` set. Use the active theme based on build option `--theme` or default to `light`.

3) Implement `lib/mermaid-prerender.js`
   - Dependencies: `@mermaid-js/mermaid-cli`, `tmp`, `fs/promises`, `crypto`, `path`, `globby`.
   - Steps per diagram:
     - Create temp `*.mmd` file with the diagram source. Prepend an init block with the chosen theme variables if needed.
     - Compute cache key `sha1(JSON.stringify({src, theme, version: require('@mermaid-js/mermaid-cli/package.json').version}))`.
     - If cached, reuse outputs. If not, run `mmdc` for each requested format.
     - For SVG inline mode: load SVG, inject `role="img"` and `aria-label` if available; ensure `viewBox` present; set `preserveAspectRatio`.
     - Write artifacts to `html/diagrams/<hash>.<ext>`.
   - Return a transform function that takes Markdown AST and outputs HTML with either inline SVG or `<img src="...">`/`<object data="...">`.

4) Hook into build
   - In the build pipeline, before Markdown → HTML conversion finalization, replace Mermaid fences with pre-rendered output when enabled.
   - Add logging: `Rendered Mermaid (svg,png) for N diagrams; skipped M via cache`.

5) Update client script `assets/js/main.js`
   - Ensure Mermaid init includes `securityLevel: 'strict'` and `htmlLabels: false`.
   - Skip `mermaid.run()` for any `.mermaid` element with `data-prerendered="true"`.
   - After rendering, normalize SVG attributes as noted in “Client-side polish”.

6) Docs and examples
   - Add a `docs/examples/mermaid.md` showcasing all diagram types with recommended patterns (labels, long text wrapping with `<br/>`, etc.).
   - Include guidance on using init blocks to locally tweak spacing: `%%{init: { 'flowchart': { 'nodeSpacing': 60 }}}%%`.

## Acceptance Criteria

- Theme parity: Pre-rendered SVGs and client-rendered SVGs visually match for both light and dark themes.
- Static build produces no runtime JS dependency for diagrams when prerender is enabled.
- PNG exports are crisp on Retina (`--scale 2`).
- PDFs render without clipped edges and with selectable text (SVG → PDF path preferred).
- Caching prevents re-render of unchanged diagrams.
- Error cases are visible and actionable; original source is always copyable.

## Developer Notes

- Performance: Batched `mmdc` invocations are fine; parallelize moderately (e.g., 4 workers) to avoid Chrome overload.
- Security: Keep `securityLevel: 'strict'` unless an explicit opt-out is added. Never allow arbitrary HTML.
- ID stability: When embedding multiple diagrams per page, ensure unique IDs (Mermaid typically handles this, but verify when inlining multiple SVGs).
- Fonts: If you later ship non-system fonts, update Puppeteer to load them by injecting a CSS file via `--css` or `--puppeteerConfig` that registers `@font-face`.

## Quick Command Cheatsheet (reference)

- Render one diagram to SVG:
  - `npx @mermaid-js/mermaid-cli -i example.mmd -o out.svg --theme base --themeVariables assets/mermaid-theme.json`
- Render PNG @2x:
  - `npx @mermaid-js/mermaid-cli -i example.mmd -o out.png --scale 2`
- Render PDF:
  - `npx @mermaid-js/mermaid-cli -i example.mmd -o out.pdf`

## Where to Edit

- Client theme/UX: `assets/js/main.js`
- Config toggles: `doc-builder.config.js`
- Prerenderer: `lib/mermaid-prerender.js` (new)
- Output dirs: `html/diagrams/`, `html-static/diagrams/`
- Examples: `docs/examples/mermaid.md`

