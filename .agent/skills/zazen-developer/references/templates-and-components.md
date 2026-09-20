# Zazen Templates & Components Guide

This guide details how to build and modify templates, components, and layout structures for Zazen sites without breaking live preview, inline rich editing, or static deployments.

---

## 1. Overview & Directory Structure

- **Templates**: Page-level HTML layouts stored in `registry/templates/` (e.g., `registry/templates/default.html`, `registry/templates/article.html`, `registry/templates/stream.html`).
- **Components**: Reusable HTML partials stored in `registry/components/` (e.g., `registry/components/header.html`, `registry/components/footer.html`).
- **Registration**: All templates and components must be registered in `zazen.json` under `"templates"` and `"components"`.

---

## 2. Placeholder Injection & Syntax Rules

Zazen uses a regex-based template evaluation engine (`generateFinalHTML`). Always adhere to the following syntax:

### A. Field Variables
- `{{fieldName}}`: Injects the value of `fieldName` defined in the active page or post schema content.
- `{{pageTitle}}`: Page title.
- `{{postTitle}}`: Post title.
- `{{streamTitle}}`: Stream container title.
- `{{publishedDate}}` / `{{formattedPublishedAt}}`: Formatted date string (e.g. `Sep 4, 2026`).

### B. Global & Site Settings Tags
Injected from `settings` in `zazen.json`:
- `{{siteTitle}}`: Site title.
- `{{siteUrl}}`: Canonical site URL (defaults to `/`).
- `{{siteGithubRepoLink}}`: Link to the GitHub repository.
- `{{siteLatestCommitMessage}}`: Latest deployment commit message.
- `{{anyUniversalTag}}`: Any custom universal key defined under `settings.universalTags`.

### C. Fallback Values
Provide a default if the key is empty or undefined:
```html
<a href="{{ctaUrl || '/'}}">{{ctaText || 'Learn More'}}</a>
```
Syntax pattern: `{{key || 'default'}}` or `{{key || "default"}}`.

### D. Conditionals (Truthiness)
Toggle classes, content, or inline attributes based on boolean or truthy field values:
```html
<div class="card {{isFeatured ? 'featured' : ''}}">
  <span class="{{!isPublished ? 'badge-draft' : 'badge-live'}}">Status</span>
</div>
```
> [!IMPORTANT]
> **CRITICAL**: Always wrap ternary string values in quotes (e.g. `'active'` or `''`). Do not use unquoted strings. Both positive (`{{key ? 'a' : 'b'}}`) and negated (`{{!key ? 'a' : 'b'}}`) conditions are supported.

---

## 3. Modular Inclusions (Components, Styles, Scripts, Navigation)

### A. Components
Include reusable components anywhere in a template:
```html
{{component:header}}
<main>
  ...
</main>
{{component:footer}}
```
Alternative syntax: `{{component.header}}`.
Component files are resolved from `registry/components/<name>.html` or the `"components"` mapping in `zazen.json`.

### B. Navigation
Render the dynamic navigation menu:
- Primary menu: `{{navigation}}`
- Specific named menu: `{{navigation:primary}}` or `{{navigation:footer_links}}`

Generates an HTML `<ul>` list with `active` classes on matching links.

### C. Styles & Scripts
- Link a stylesheet: `{{style:main.css}}` or `{{style:theme.css}}`
  - In Preview Mode: Rendered as an inline `<style>` tag populated from the live draft editor for instantaneous CSS updates.
  - In Static Build: Rendered as `<link rel="stylesheet" href="/registry/styles/main.css">`.
- Link a script: `{{script:theme.js}}`
  - In Preview Mode: Rendered as `<script data-script-registry="theme.js">...</script>`.
  - In Static Build: Rendered as `<script src="/registry/scripts/theme.js"></script>`.

---

## 4. Stream & Post Loops

### A. Stream Pages (`stream.html`)
On a stream page (e.g. `/blog`), use `{{streamPosts}}`:
```html
<section class="stream-feed">
  <h1>{{streamTitle}}</h1>
  <div class="posts-grid">
    {{streamPosts}}
  </div>
</section>
```
Zazen automatically expands `{{streamPosts}}` into semantic article cards with title, date, excerpt, hero image, and link.

### B. Post Pages (`article.html` / `post.html`)
On a single post page, use `{{nextPosts}}` to display related or chronological next articles:
```html
<article class="post-content">
  <header>
    <h1>{{title}}</h1>
    <time>{{publishedDate}}</time>
  </header>
  <div class="post-body">
    {{body}}
  </div>
</article>

<aside class="related-posts">
  <h3>More from {{streamTitle}}</h3>
  <div class="next-posts-grid">
    {{nextPosts}}
  </div>
</aside>
```

---

## 5. Live Preview & Inline Editing Safety

To ensure that in-browser live editing functions seamlessly without corrupting HTML:

1. **Tag Preserving**: When wrapping editable text placeholders in structural tags (e.g. `<h1>{{title}}</h1>`, `<p>{{body}}</p>`), Zazen automatically attaches `contenteditable="true"` and `data-field="title"` to the parent element in the preview iframe.
2. **Never Put HTML into Attributes**: For attributes like `<img src="{{heroImage}}" alt="{{altText}}">`, Zazen safely escapes attributes and never inserts editable DOM wrappers inside tag attributes.
3. **Rich Text / Blocks Fields**: When a schema field is marked as rich text or blocks, format container elements with standard semantic tags so that formatting buttons (bold, italic, links, lists) work cleanly.
