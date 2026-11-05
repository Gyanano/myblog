---
version: 1
slug: "src-pages-blog-index-astro"
primary_target: "src/pages/blog/index.astro"
related_targets: ["src/pages/blog/[...slug].astro", "src/pages/blog/tags/[tag].astro", "src/pages/blog/series/[series].astro", "src/layouts/DocsLayout.astro", "src/components/PostIndex.astro"]
---

## Scope
Blog area (visitor mode: Read). Index, post, tag and series pages share the docs skeleton the owner asked for, modelled on rig.rs/docs.

## Direction contract
THESIS: The quiet room next door. No cone, no particles, no entrance effects. Quality comes from type, code, tables and navigation.
INDEX: Posts grouped by year, with the sidebar listing tags, because the owner rejects the same content appearing twice on a page.
POST: Sidebar lists posts, centre article, right outline. Code tools are a language tag and a copy button.
MOBILE: The main nav never disappears. Outline collapses above the article.
INVARIANT: Unlisted posts stay out of the index, listed tag pages, search and the sidebar of listed posts. Their pages stay indexable, with no noindex.
