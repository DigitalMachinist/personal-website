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

Use the Astro 5 standalone `render()` function (not the deprecated `entry.render()` method) to convert each entry's markdown body into a `<Content />` component. Since `render()` is async and cannot be awaited inside JSX, pre-render all entries in the frontmatter:

```astro
---
import { getCollection, render } from 'astro:content';

const projects = (await getCollection('projects')).sort(...);
const rendered = await Promise.all(
  projects.map(async (project) => {
    const { Content } = await render(project);
    return { project, Content };
  })
);
---

{rendered.map(({ project, Content }) => (
  <div class="card">
    <!-- ... -->
    <div class="card-desc"><Content /></div>
    <!-- ... -->
  </div>
))}
```

Replace `<p class="card-desc">{project.body}</p>` with `<div class="card-desc"><Content /></div>` (and likewise for jams).

**Scoped styles for `.card-desc`:**

Add styles for the light subset of markdown elements that may appear inside card descriptions. Because `<Content />` renders as a child component, Astro's scoped styles won't penetrate it — use the `:global()` modifier:

```css
.card-desc :global(p) {
  margin-bottom: 0.5em;
}
.card-desc :global(p:last-child) {
  margin-bottom: 0;
}
.card-desc :global(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.card-desc :global(strong),
.card-desc :global(em) {
  color: inherit;
}
```

No styles needed for headings, lists, code blocks, blockquotes, or images inside `.card-desc`. These may render unstyled if someone puts them in a description, but that's acceptable — descriptions are intended to be short prose.

### 2. Replace full-card link with explicit button-style links

**Files:** `src/pages/projects.astro`, `src/pages/game-jams.astro`

**Structure change:**

- Replace the outer `<a class="card" href={url}>` with `<div class="card">`.
- Remove `text-decoration: none` and `color: inherit` from `.card` (no longer an anchor).
- Remove the card hover effect (border-color glow). A glowing hover on a non-clickable div is a misleading affordance. The pill links have their own hover states, which is sufficient.

**Footer link replacement:**

Remove the bare SVG icons from the card footer. Replace with labeled pill-style `<a>` tags:

- **"GitHub"** pill (projects only, conditional on `repo` field existing):
  - `<a href={project.data.repo} target="_blank" rel="noopener noreferrer" class="link-pill">GitHub</a>`
  - Style: monospace font, theme-aware subtle background and border, neutral text color.
- **"Visit ↗"** pill (always present on both projects and jams — `url` is a required field in both schemas):
  - `<a href={project.data.url} target="_blank" rel="noopener noreferrer" class="link-pill link-pill-accent">Visit ↗</a>`
  - Style: monospace font, accent-colored background tint, accent-colored border, accent text color.

Both pills use the same base `.link-pill` class with a `.link-pill-accent` modifier for the Visit link.

Note: The game jams page currently places the external link SVG directly in the footer without a `.card-links` wrapper (unlike `projects.astro` which has one). Add a `.card-links` wrapper in game jams for consistency.

**Pill styles (theme-aware):**

```css
.link-pill {
  font-family: 'Source Code Pro', monospace;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 4px;
  text-decoration: none;
  background: var(--accent-subtle);
  border: 1px solid var(--card-border);
  color: var(--text-secondary);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.link-pill:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.link-pill-accent {
  color: var(--accent);
  background: var(--accent-subtle);
  border-color: var(--divider);
}

.link-pill-accent:hover {
  border-color: var(--accent);
}
```

All colors reference existing CSS custom properties, so both dark and light themes work without hardcoded RGBA values.

**Cleanup:**

After removing the SVG icons, the `.external-link-icon` styles in `src/styles/global.css` may be dead CSS. Check if they're used elsewhere; if not, remove them.

## Scope

- **In scope:** The two changes above, applied to both `projects.astro` and `game-jams.astro`. Cleanup of dead `.external-link-icon` CSS if no longer used.
- **Out of scope:** Extracting a shared Card component (both pages are ~200 lines with small differences — not worth the indirection), adding new markdown features beyond light prose, changing the content schema.

## Files Modified

- `src/pages/projects.astro`
- `src/pages/game-jams.astro`
- `src/styles/global.css` (cleanup only, if `.external-link-icon` is unused elsewhere)
