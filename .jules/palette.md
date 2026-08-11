## 2024-10-09 - Missing Accessible Labels and Keyboard Focus on Icon-Only Buttons
**Learning:** Found a recurring pattern in the codebase where icon-only buttons (like the sidebar collapse button or language switchers) lack both `aria-label`s for screen readers and visible focus states for keyboard navigation (`focus-visible`). This indicates a potential accessibility gap in the design system components used across the app, especially for interactive elements without text.
**Action:** When reviewing or updating UI components, explicitly check for and add `aria-label` (and `aria-expanded` for toggles) along with `focus-visible:ring-2` to ensure they are accessible to both screen readers and keyboard users.
## Sidebars & Mobile Navigation
**Learning:** Sidebars that only hide text but keep the icon track visible on small devices take up too much horizontal space. Users need an explicit way to open/close navigation, and it should act as an overlay to prevent layout shifts.
**Action:** When implementing responsive sidebars, use an overlay/drawer pattern on mobile screens (<768px) with a dark background to retain context, and ensure that navigating auto-closes the drawer. Ensure toggle buttons are not `hidden` on mobile.

## 2026-08-11 - Pagination Accessibility Patterns
**Learning:** Pagination components often rely on visual cues (like an active class for the current page, or "..." for truncation) and symbols (like "«" and "»") that are unhelpful or confusing to screen readers. For instance, "«" might be read aloud literally as "left pointing double angle quotation mark".
**Action:** Use `aria-current="page"` to explicitly denote the active page. Hide decorative elements like "..." from assistive tech using `aria-hidden="true"` and `tabIndex={-1}`. Use `aria-label` and `title` on symbol buttons (e.g., "First page") to provide clear semantic meaning.
