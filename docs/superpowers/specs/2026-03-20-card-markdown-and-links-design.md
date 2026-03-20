# Card Markdown Rendering & Explicit Links

## Problem

The projects and game jams pages have three related issues:

1. **Markdown not rendered** — Card descriptions use `{project.body}` / `{jam.body}` which outputs raw text. Line breaks, bold, italic, and links in the markdown source are ignored.
2. **GitHub link not clickable** — The GitHub SVG icon is decorative only, with no wrapping `<a>` tag pointing to the repo URL.
3. **Entire card is one link** — The full card is wrapped in `<a href={url}>`, making the whole surface clickable. The user wants discrete, labeled links instead.

Issues 2 and 3 are resolved together — once the card is no longer a single `<a>`, the GitHub and external links become independent clickable elements.

## Changes

### 1. Render markdown in card descriptions

**Files:** `src/pages/projects.astro`, `src/pages/game-jams.astro`

- Use Astro's `render()` API on each collection entry to produce a `<Content />` component instead of raw `body` text.
- Replace `<p class="card-desc">{project.body}</p>` with `<div class="card-desc"><Content /></div>` (and likewise for jams).
- `render()` is async, so the map callback must be updated accordingly. Astro supports `await` inside the frontmatter and component expressions — render all entries in the frontmatter and pass the rendered content into the template.

**Scoped styles for `.card-desc`:**

Add styles for the light subset of markdown elements that may appear inside card descriptions:

- `p` — inherit existing font/color/line-height, add bottom margin between paragraphs
- `a` — accent color, underline
- `strong`, `em` — inherit color, use appropriate font-weight/style

No styles needed for headings, lists, code blocks, blockquotes, or images inside `.card-desc`. These may render unstyled if someone puts them in a description, but that's acceptable — descriptions are intended to be short prose.

### 2. Replace full-card link with explicit button-style links

**Files:** `src/pages/projects.astro`, `src/pages/game-jams.astro`

**Structure change:**

- Replace the outer `<a class="card" href={url}>` with `<div class="card">`.
- Remove `text-decoration: none` and `color: inherit` from `.card` (no longer an anchor).
- Keep the card hover effect (border-color and box-shadow transition) on the `<div>`.

**Footer link replacement:**

Remove the bare SVG icons from the card footer. Replace with labeled pill-style `<a>` tags:

- **"GitHub"** pill (projects only, conditional on `repo` field existing):
  - `<a href={project.data.repo} target="_blank" rel="noopener noreferrer" class="link-pill">GitHub</a>`
  - Style: monospace font, subtle background (`rgba(255,255,255,0.08)`), subtle border, neutral text color.
- **"Visit ↗"** pill (always present on both projects and jams):
  - `<a href={project.data.url} target="_blank" rel="noopener noreferrer" class="link-pill link-pill-accent">Visit ↗</a>`
  - Style: monospace font, accent-colored background tint, accent-colored border, accent text color.

Both pills use the same base `.link-pill` class with a `.link-pill-accent` modifier for the Visit link.

**Pill styles:**

```
.link-pill {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 4px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-secondary);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.link-pill:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.link-pill-accent {
  color: var(--accent);
  background: rgba(200, 128, 56, 0.1);
  border-color: rgba(200, 128, 56, 0.25);
}

.link-pill-accent:hover {
  background: rgba(200, 128, 56, 0.18);
  border-color: var(--accent);
}
```

Light theme: pill backgrounds and borders should adapt via CSS variables or `rgba()` values that read well on both themes. The existing `--accent` and `--text-secondary` variables already handle theme switching, so the pills should work as-is. The only concern is the hardcoded `rgba(255,255,255,...)` values for the neutral pill — these should use theme-aware values (e.g., `var(--card-border)` for the border, and a semi-transparent version of the text color for the background).

## Scope

- **In scope:** The two changes above, applied to both `projects.astro` and `game-jams.astro`.
- **Out of scope:** Extracting a shared Card component (both pages are ~200 lines with small differences — not worth the indirection), adding new markdown features beyond light prose, changing the content schema.

## Files Modified

- `src/pages/projects.astro`
- `src/pages/game-jams.astro`
