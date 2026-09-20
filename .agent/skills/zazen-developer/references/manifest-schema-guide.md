# Zazen Manifest & Schema Reference Guide

This document defines the complete specification of the `zazen.json` manifest and its schemas.

---

## 1. `zazen.json` Top-Level Structure

```json
{
  "schemas": { ... },
  "templates": { ... },
  "components": { ... },
  "styles": { ... },
  "scripts": { ... },
  "media": { ... },
  "pages": { ... },
  "streams": { ... },
  "navigation": { ... },
  "settings": { ... }
}
```

---

## 2. Schemas Object (`"schemas"`)

Schemas define content fields, input types, and required validations.

```json
"schemas": {
  "default": {
    "name": "Standard Page Schema",
    "fields": [
      { "name": "title", "label": "Page Title", "type": "text", "required": true },
      { "name": "eyebrow", "label": "Section Label", "type": "text" },
      { "name": "intro", "label": "Intro Text", "type": "textarea" },
      { "name": "body", "label": "Body Content", "type": "textarea", "required": true },
      { "name": "heroImage", "label": "Hero Image", "type": "image", "folder": "media/images" },
      { "name": "themeColor", "label": "Accent Color", "type": "color" },
      { "name": "priority", "label": "Sort Order", "type": "number" }
    ]
  }
}
```

### Supported Field Types

| Type | Description | Options / Properties | Example |
| :--- | :--- | :--- | :--- |
| `text` | Single-line text input | `name`, `label`, `required`, `placeholder` | Page title, author, badge |
| `textarea` | Multi-line text / rich HTML | `name`, `label`, `required` | Body copy, markdown, excerpts |
| `image` | Photo/image uploader & preview | `name`, `label`, `folder` (default: `"media"`) | Featured image, avatars |
| `color` | Color picker | `name`, `label`, `default` | Background/theme accent |
| `number` | Numeric value input | `name`, `label`, `min`, `max`, `step` | Pricing, order, counters |
| `select` | Dropdown select | `name`, `label`, `options: [...]` | Layout type, alignment |
| `blocks` | Dynamic block builder | `name`, `label` | Modular body sections |

---

## 3. Templates & Components

```json
"templates": {
  "default": "registry/templates/default.html",
  "article": "registry/templates/article.html",
  "landing": "registry/templates/landing.html",
  "stream": "registry/templates/stream.html"
},
"components": {
  "header": "registry/components/header.html",
  "footer": "registry/components/footer.html"
}
```

---

## 4. Styles & Scripts

```json
"styles": {
  "main.css": "registry/styles/main.css"
},
"scripts": {
  "theme.js": "registry/scripts/theme.js"
}
```

---

## 5. Media Collection (`"media"`)

Stores metadata for photos and uploaded assets:

```json
"media": {
  "hero-banner.jpg": {
    "name": "hero-banner.jpg",
    "path": "media/hero-banner.jpg",
    "url": "https://raw.githubusercontent.com/.../media/hero-banner.jpg",
    "title": "Hero Banner Photo",
    "alt": "Sunset over mountain vista",
    "caption": "Taken in July 2026",
    "tags": "hero, landscape, homepage",
    "size": 245120,
    "type": "image/jpeg",
    "dimensions": "1920 × 1080",
    "uploadedAt": "2026-09-04T12:00:00.000Z"
  }
}
```

---

## 6. Pages & Streams

```json
"pages": {
  "index": {
    "schema": "landing",
    "template": "landing",
    "content": {
      "title": "Welcome to Zazen",
      "body": "Static, self-sovereign web publishing."
    }
  },
  "about": {
    "schema": "default",
    "template": "default",
    "content": {
      "title": "About Us",
      "body": "Our story..."
    }
  }
},
"streams": {
  "blog": {
    "slug": "blog",
    "title": "Blog",
    "schema": "stream",
    "template": "stream",
    "content": { "title": "Articles & Updates" },
    "posts": {
      "first-post": {
        "title": "First Post",
        "schema": "article",
        "template": "article",
        "publishedAt": "2026-09-04T14:30:00.000Z",
        "content": {
          "title": "My First Post",
          "body": "Welcome to my new blog!"
        }
      }
    }
  }
}
```

---

## 7. Navigation & Settings

```json
"navigation": {
  "primary": {
    "menu_items": [
      { "label": "Home", "slug": "/" },
      { "label": "Blog", "slug": "/blog" },
      { "label": "About", "slug": "/about" }
    ]
  }
},
"settings": {
  "siteTitle": "My Zazen Site",
  "siteUrl": "https://example.com",
  "branch": "main",
  "universalTags": {
    "authorName": "Jane Doe",
    "twitterHandle": "@janedoe"
  },
  "deploy": {
    "target": "github-pages", // "github-pages", "repo", or "ftp"
    "baseUrl": ""
  }
}
```
