# Card Markdown Rendering & Explicit Links — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render markdown properly in project/game-jam card descriptions and replace the full-card link with discrete pill-style "GitHub" and "Visit ↗" links.

**Architecture:** Two parallel changes to `projects.astro` and `game-jams.astro`: (1) switch from raw `body` text to Astro's `render()` API for markdown, (2) unwrap the card `<a>` into a `<div>` and replace SVG icons with labeled pill links. Clean up dead CSS in `global.css` afterward.

**Tech Stack:** Astro 5 (Content Collections, `render()` from `astro:content`), scoped CSS with `:global()`.

**Spec:** `docs/superpowers/specs/2026-03-20-card-markdown-and-links-design.md`

---

### Task 1: Update projects.astro — markdown rendering + card structure

**Files:**
- Modify: `src/pages/projects.astro`

- [ ] **Step 1: Update frontmatter to pre-render markdown**

Replace the frontmatter (lines 1–16) with:

```astro
---
import Base from '../layouts/Base.astro';
import SiteHeader from '../components/SiteHeader.astro';
import { getCollection, render } from 'astro:content';

const projects = (await getCollection('projects'))
  .sort((a, b) => {
    // Active before archived
    if (a.data.status !== b.data.status) return a.data.status === 'active' ? -1 : 1;
    // Then by sortOrder (lower first), then alphabetical
    const aOrder = a.data.sortOrder ?? 999;
    const bOrder = b.data.sortOrder ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.data.name.localeCompare(b.data.name);
  });

const rendered = await Promise.all(
  projects.map(async (project) => {
    const { Content } = await render(project);
    return { project, Content };
  })
);
---
```

- [ ] **Step 2: Replace card template — unwrap `<a>`, add pill links, use `<Content />`**

Replace the card list markup (lines 25–59) with:

```astro
    <div class="card-list">
      {rendered.map(({ project, Content }) => (
        <div class="card">
          <div class="card-thumb" style={project.data.thumbnail ? `background-image: url(${project.data.thumbnail})` : ''}>
            {!project.data.thumbnail && <span class="card-thumb-fallback">{project.data.name.charAt(0)}</span>}
          </div>
          <div class="card-body">
            <h2 class="card-name">{project.data.name}</h2>
            <span class={`card-status ${project.data.status}`}>
              <span class="status-dot" />
              {project.data.status}
            </span>
            <div class="card-desc"><Content /></div>
            <div class="card-footer">
              {project.data.tech.length > 0 && (
                <div class="card-tech">
                  {project.data.tech.map((t) => (
                    <span class="tag-pill">{t}</span>
                  ))}
                </div>
              )}
              <div class="card-links">
                {project.data.repo && (
                  <a href={project.data.repo} target="_blank" rel="noopener noreferrer" class="link-pill">GitHub</a>
                )}
                <a href={project.data.url} target="_blank" rel="noopener noreferrer" class="link-pill link-pill-accent">Visit ↗</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
```

- [ ] **Step 3: Update scoped styles**

Replace the `<style>` block (lines 64–200) with the updated version. Key changes:
- `.card`: remove `text-decoration: none` and `color: inherit`
- Remove `.card:hover` block entirely (no hover glow on non-clickable div)
- `.card-desc`: keep existing styles, add `:global()` rules for inner markdown elements
- Add `.link-pill` and `.link-pill-accent` styles

```css
<style>
  main {
    position: relative;
    z-index: 1;
    padding-bottom: 120px;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    display: flex;
    background: var(--bg-surface);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .card-thumb {
    width: 180px;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface));
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-thumb-fallback {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2.5rem;
    color: var(--text-dim);
    opacity: 0.3;
  }

  .card-body {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .card-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-weight: 400;
    font-size: 1.3rem;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .card-status {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-status.active {
    color: var(--accent-secondary);
  }

  .card-status.archived {
    color: var(--text-dim);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  .card-status.active .status-dot {
    background: var(--accent-secondary);
  }

  .card-status.archived .status-dot {
    background: var(--text-dim);
  }

  .card-desc {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
    flex: 1;
  }

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

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-tech {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .card-links {
    display: flex;
    gap: 8px;
    align-items: center;
  }

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

  @media (max-width: 640px) {
    .card {
      flex-direction: column;
    }

    .card-thumb {
      width: 100%;
      height: 160px;
    }
  }
</style>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat: render markdown in project cards and replace full-card link with pill links"
```

---

### Task 2: Update game-jams.astro — markdown rendering + card structure

**Files:**
- Modify: `src/pages/game-jams.astro`

- [ ] **Step 1: Update frontmatter to pre-render markdown**

Replace the frontmatter (lines 1–8) with:

```astro
---
import Base from '../layouts/Base.astro';
import SiteHeader from '../components/SiteHeader.astro';
import { getCollection, render } from 'astro:content';

const jams = (await getCollection('game-jams'))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const rendered = await Promise.all(
  jams.map(async (jam) => {
    const { Content } = await render(jam);
    return { jam, Content };
  })
);
---
```

- [ ] **Step 2: Replace card template — unwrap `<a>`, add pill links, use `<Content />`**

Replace the card list markup (lines 17–41) with:

```astro
    <div class="card-list">
      {rendered.map(({ jam, Content }) => (
        <div class="card">
          <div class="card-thumb" style={jam.data.thumbnail ? `background-image: url(${jam.data.thumbnail})` : ''}>
            {!jam.data.thumbnail && <span class="card-thumb-fallback">{jam.data.name.charAt(0)}</span>}
          </div>
          <div class="card-body">
            <h2 class="card-name">{jam.data.name}</h2>
            <span class="card-context">{jam.data.jam}</span>
            <div class="card-desc"><Content /></div>
            <div class="card-footer">
              {jam.data.tech.length > 0 && (
                <div class="card-tech">
                  {jam.data.tech.map((t) => (
                    <span class="tag-pill">{t}</span>
                  ))}
                </div>
              )}
              <div class="card-links">
                <a href={jam.data.url} target="_blank" rel="noopener noreferrer" class="link-pill link-pill-accent">Visit ↗</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
```

Note: Added `.card-links` wrapper (was missing in the original) and replaced the bare SVG with a pill link.

- [ ] **Step 3: Update scoped styles**

Replace the `<style>` block (lines 46–150) with the updated version. Same changes as projects: remove anchor styles, remove hover glow, add `:global()` markdown styles, add pill styles, add `.card-links`.

```css
<style>
  main {
    position: relative;
    z-index: 1;
    padding-bottom: 120px;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    display: flex;
    background: var(--bg-surface);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .card-thumb {
    width: 180px;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface));
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-thumb-fallback {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2.5rem;
    color: var(--text-dim);
    opacity: 0.3;
  }

  .card-body {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .card-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-weight: 400;
    font-size: 1.3rem;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .card-context {
    font-family: 'Source Code Pro', monospace;
    font-size: 0.72rem;
    color: var(--accent);
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }

  .card-desc {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
    flex: 1;
  }

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

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-tech {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .card-links {
    display: flex;
    gap: 8px;
    align-items: center;
  }

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

  @media (max-width: 640px) {
    .card {
      flex-direction: column;
    }

    .card-thumb {
      width: 100%;
      height: 160px;
    }
  }
</style>
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/game-jams.astro
git commit -m "feat: render markdown in game jam cards and replace full-card link with pill links"
```

---

### Task 3: Clean up dead `.external-link-icon` CSS

**Files:**
- Modify: `src/styles/global.css:137-149`

- [ ] **Step 1: Verify no other template usages remain**

Run: `grep -r "external-link-icon" src/pages/ src/components/` — should return zero matches (since Tasks 1 and 2 removed the SVG icons from both pages).

- [ ] **Step 2: Remove dead CSS from global.css**

Remove lines 137–149 from `src/styles/global.css`:

```css
/* DELETE these two blocks: */

.external-link-icon {
  width: 14px;
  height: 14px;
  stroke: var(--text-dim);
  stroke-width: 2;
  fill: none;
  transition: stroke 0.2s ease;
  flex-shrink: 0;
}

a:hover .external-link-icon {
  stroke: var(--accent);
}
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "chore: remove unused .external-link-icon CSS"
```
