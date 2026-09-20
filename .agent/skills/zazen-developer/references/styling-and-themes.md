# Zazen Styling & Themes Guide

This guide details the CSS architecture, design tokens, theme switching mechanism, and responsive styling conventions used in Zazen sites.

---

## 1. CSS Architecture & File Locations

- **Main Stylesheet**: Stored in `registry/styles/main.css` (or registered under `"styles"` in `zazen.json`).
- **Template Linking**: Linked in HTML templates or components via `{{style:main.css}}`.
- **Live Preview Integration**: In the Zazen live editor, draft CSS updates in the Styles tab are injected as `<style data-style-registry="main.css">` tags inside the preview iframe, providing instant visual feedback.

---

## 2. Design Token System (CSS Custom Properties)

All site templates adhere to semantic CSS variables defined on `:root` and overridden for dark mode:

```css
:root {
  color-scheme: light;
  --bg: #ffffff;
  --text: #111111;
  --muted: #666666;
  --subtle: #999999;
  --line: #e5e5e5;
  --surface: #fafafa;
  --button-bg: transparent;
  --button-border: #e5e5e5;
  --button-text: #111111;
  --button-hover-bg: #111111;
  --button-hover-text: #ffffff;
  --faint: #cccccc;
}

/* System Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --bg: #101214;
    --text: #f4efe8;
    --muted: #c1b8ab;
    --subtle: #938c84;
    --line: #2c3238;
    --surface: #181c20;
    --button-bg: rgba(255, 255, 255, 0.03);
    --button-border: #394149;
    --button-text: #f4efe8;
    --button-hover-bg: #f4efe8;
    --button-hover-text: #101214;
    --faint: #5a636d;
  }
}

/* Explicit User Overrides */
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #ffffff;
  --text: #111111;
  --muted: #666666;
  --subtle: #999999;
  --line: #e5e5e5;
  --surface: #fafafa;
  --button-bg: transparent;
  --button-border: #e5e5e5;
  --button-text: #111111;
  --button-hover-bg: #111111;
  --button-hover-text: #ffffff;
  --faint: #cccccc;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #101214;
  --text: #f4efe8;
  --muted: #c1b8ab;
  --subtle: #938c84;
  --line: #2c3238;
  --surface: #181c20;
  --button-bg: rgba(255, 255, 255, 0.03);
  --button-border: #394149;
  --button-text: #f4efe8;
  --button-hover-bg: #f4efe8;
  --button-hover-text: #101214;
  --faint: #5a636d;
}
```

---

## 3. Best Practices for Theme Modification

1. **Always Use Tokens**: Avoid hardcoded hex colors in layout rules; reference `var(--bg)`, `var(--text)`, `var(--line)`, etc.
2. **Smooth Transitions**: Set `transition: background-color 0.35s ease, color 0.35s ease;` on `body` and interactive surfaces for flicker-free theme switches.
3. **Contrast Ratios**: Maintain WCAG AA compliance (4.5:1 text contrast) across both light and dark themes.
4. **Editable Element Outlines**: Do not override outline styles globally with `outline: none !important;` as this can interfere with visual focus states and the live preview editor's hover highlights (`.zazen-editable`).

---

## 4. Layout & Responsive Breakpoints

- **Max Container**: Use `.container { max-width: 1400px; margin: 0 auto; padding: 0 3rem; }`.
- **Mobile Breakpoint**: `@media (max-width: 768px)`
  - Switch multi-column grids (`grid-template-columns: repeat(auto-fit, minmax(...))`) to single column or stacked flex.
  - Adjust padding: `padding: 0 1.5rem;`.
- **Stream & Post Grids**:
  ```css
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }
  @media (max-width: 640px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
  ```

---

## 5. Adding New Stylesheets

When creating specialized styles (e.g. `gallery.css` or `pricing.css`):
1. Create the CSS file in `registry/styles/<filename>.css`.
2. Register it in `zazen.json` under `"styles"`:
   ```json
   "styles": {
     "main.css": "registry/styles/main.css",
     "gallery.css": "registry/styles/gallery.css"
   }
   ```
3. Include it in target templates via `{{style:gallery.css}}`.
