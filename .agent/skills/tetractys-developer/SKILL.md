---
name: tetractys-builder
description: Expert instructions for creating schemas and components (templates) for the Tetractys site builder.
---

# Tetractys Developer Skill

This skill provides the technical specifications and patterns required to build schemas and templates for the Tetractys "Self-Sovereign" site builder.

## Core Concepts

Tetractys is a single-manifest site builder. All configuration lives in `tetractys.json`, and UI components are HTML templates stored in `registry/templates/`.

## 1. Creating Schemas

Schemas define the editing interface and the data structure for a page. They are stored in the `"schemas"` object inside `tetractys.json`.

### Schema Format
```json
"schema_name": {
  "name": "Readable Label",
  "fields": [
    {
      "name": "field_id",
      "label": "Display Label",
      "type": "text | textarea | image | color | number",
      "required": true,
      "folder": "assets/uploads" // Optional, for 'image' type
    }
  ]
}
```

### Supported Field Types
- **text**: Single-line text input.
- **textarea**: Multi-line text area.
- **image**: Image uploader. Provides a preview and saves the path.
- **color**: Native color picker.
- **number**: Numeric input.

## 2. Creating Components (Templates)

Templates are standard HTML strings. They can be stored in two ways:
1. **Embedded**: Directly as a string in `tetractys.json`.
2. **Pointer**: As a file path (e.g., `registry/templates/default.html`). 

The `getTemplateContent` utility handles resolving these automatically.

### Data Injection
Inject any field value using `{{field_name}}`.

### Conditionals (Truthiness)
Toggle UI elements based on field presence:
```html
<div class="{{has_sidebar ? 'with-sidebar' : 'full-width'}}">
  ...
</div>
```
*Note: The true/false values must be wrapped in single quotes. Avoid double quotes or non-quoted values.*

### Special Placeholders
- `{{title}}`: The page title from metadata.
- `{{navigation}}`: Automatically generated `<ul>` list of site pages.

## 3. Local Draft & Deployment Logic

Tetractys uses a "Local-First" approach to editing:
- **Save**: Clicking "Save" in any tab persists the manifest to `localStorage` as a draft (`tetractys_draft_{repo_name}`).
- **Preview**: The preview pane renders from the local draft.
- **Deploy**: Clicking the **Deploy** rocket icon pushes the local draft to GitHub and triggers the static site build.

## 4. Best Practices for Flexibility

### Component Design Patterns
To make schemas "serve any UX component purpose," follow these patterns:

#### A. The Semantic Switch
Use a `text` field called `layout` to switch CSS classes.
**Schema:** `{ "name": "layout", "label": "Layout Type", "type": "text" }`
**Template:** `<article class="post-{{layout}}"> ... </article>`

#### B. The Hero Toggle
Use a color picker and image uploader together.
**Template:**
```html
<section style="background-color: {{bgColor}}; background-image: url('{{bgImage}}')">
  <h1>{{title}}</h1>
</section>
```

#### C. Slotting Content
Use `textarea` to store raw HTML if needed. The editor supports any valid HTML string.

## 5. Deployment Workflow

1. Define the schema in `tetractys.json`.
2. Create the `.html` template in `registry/templates/`.
3. Add a page entry in `tetractys.json` referencing the schema and template.
4. Preview in the Tetractys Editor.
5. Click **Deploy** to push the manifest and rendered static files to GitHub.
