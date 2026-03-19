---
title: "Building a Personal Website with Astro 5"
date: 2025-03-15
tags: ["Astro", "Web Development"]
excerpt: "A walkthrough of how I built this site using Astro 5, deployed to Cloudflare Workers, with a custom design system inspired by dark-mode dashboards and vintage machining aesthetics."
---

When I set out to rebuild my personal site, I wanted something that felt intentional — not another template, not another "developer portfolio" with a hero section and three cards. I wanted a site that reflected the way I think about software: systems-first, detail-oriented, a little industrial.

## Why Astro?

Astro's island architecture made the decision easy. For a content-heavy site with minimal interactivity, shipping zero JavaScript by default is exactly right. The content collections API gives me type-safe markdown handling without reaching for a CMS.

## The Design System

The visual language draws from two places: dark-mode developer tools and vintage machining interfaces. Warm amber accents against deep charcoal backgrounds. Monospace labels alongside serif headings. A dot grid overlay that suggests graph paper without overwhelming the content.

## Deployment

Cloudflare Workers handles the hosting. The build output is static, so it's just a matter of pushing the `dist/` folder. Fast, cheap, and globally distributed.

I'll write more about the specific design decisions and component patterns in future posts.
