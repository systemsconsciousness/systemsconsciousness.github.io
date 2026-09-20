# Zazen Scripts & Media Guide

This guide details how to develop custom client-side JavaScript and manage the `media/` asset directory in Zazen.

---

## 1. Scripts Architecture (`registry/scripts/`)

- **Location**: Client-side scripts are located in `registry/scripts/` (e.g., `registry/scripts/theme.js`).
- **Registration**: Registered in `zazen.json` under `"scripts"`:
  ```json
  "scripts": {
    "theme.js": "registry/scripts/theme.js"
  }
  ```
- **Template Tag**: Injected using `{{script:theme.js}}` or `{{script.theme.js}}`.

### A. Preview vs. Static Site Behavior
- **In Live Preview**: Zazen inlines the active draft code as `<script data-script-registry="theme.js">...</script>` inside the preview iframe.
- **In Static Export / Deployment**: Zazen produces `<script src="/registry/scripts/theme.js"></script>`.

### B. JavaScript Coding Guidelines & Safety Rules
1. **Prevent Blocking**: Wrap initialization code in `DOMContentLoaded` listeners or run in self-executing functions (IIFE):
   ```javascript
   (function() {
     // Immediate theme attribute sync to prevent flash of unstyled theme (FOUT)
     try {
       const saved = localStorage.getItem('zazen-site-theme') || localStorage.getItem('tetractys-site-theme');
       if (saved) document.documentElement.setAttribute('data-theme', saved);
     } catch (e) {}
   })();

   document.addEventListener('DOMContentLoaded', () => {
     initializeThemeToggle();
   });
   ```
2. **Defensive DOM Querying**: Elements may or may not exist on all pages. Always check existence before attaching listeners:
   ```javascript
   const themeToggle = document.getElementById('themeToggle');
   if (themeToggle) {
     themeToggle.addEventListener('click', toggleTheme);
   }
   ```
3. **Avoid Interfering with Preview Tooling**:
   - Do not attach destructive global `click` handlers with `event.stopImmediatePropagation()` that could swallow clicks meant for the editor's inline text selection or rich-text toolbar.
   - Do not wipe out elements containing `data-field` or `.zazen-editable` dynamically on load unless explicitly designed as client-side dynamic widgets.

---

## 2. Media Management (`media/`)

Zazen uses a dedicated `media/` root directory for images, photos, documents, and media uploads.

### A. Directory Structure
```text
media/
├── hero-banner.jpg
├── profile.png
├── icons/
│   └── logo.svg
└── uploads/
    └── 2026/
        └── summer-trip.webp
```

### B. Manifest Metadata (`zazen.json` -> `"media"`)
Every photo and media file uploaded through the Zazen Media Manager is recorded in the manifest:
```json
"media": {
  "hero-banner.jpg": {
    "name": "hero-banner.jpg",
    "path": "media/hero-banner.jpg",
    "url": "https://raw.githubusercontent.com/.../media/hero-banner.jpg",
    "title": "Mountain Sunset",
    "alt": "Dramatic sunset over misty mountains",
    "caption": "Photo taken in July 2026",
    "tags": "hero, landscape, header",
    "size": 284912,
    "type": "image/jpeg",
    "dimensions": "1920 × 1080",
    "uploadedAt": "2026-09-04T12:00:00.000Z"
  }
}
```

### C. Integrating Media into Schemas & Content
- In Schemas, define an `image` field:
  ```json
  {
    "name": "heroImage",
    "label": "Hero Image",
    "type": "image",
    "folder": "media"
  }
  ```
- In Templates, inject the path into `<img>` or CSS background:
  ```html
  <figure class="hero-figure">
    <img src="{{heroImage}}" alt="{{title}}" loading="lazy">
    <figcaption>{{imageCaption || ''}}</figcaption>
  </figure>
  ```

### D. Image Best Practices
- **Format**: Prefer WebP or optimized JPEG/PNG.
- **Dimensions**: Provide standard aspect ratios (16:9 for banners, 1:1 for avatars/thumbnails).
- **Lazy Loading**: Always specify `loading="lazy"` on non-hero images to optimize static site page load speed.
