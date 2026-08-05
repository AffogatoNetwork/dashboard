## 2024-10-09 - Missing Accessible Labels and Keyboard Focus on Icon-Only Buttons
**Learning:** Found a recurring pattern in the codebase where icon-only buttons (like the sidebar collapse button or language switchers) lack both `aria-label`s for screen readers and visible focus states for keyboard navigation (`focus-visible`). This indicates a potential accessibility gap in the design system components used across the app, especially for interactive elements without text.
**Action:** When reviewing or updating UI components, explicitly check for and add `aria-label` (and `aria-expanded` for toggles) along with `focus-visible:ring-2` to ensure they are accessible to both screen readers and keyboard users.
## Sidebars & Mobile Navigation
**Learning:** Sidebars that only hide text but keep the icon track visible on small devices take up too much horizontal space. Users need an explicit way to open/close navigation, and it should act as an overlay to prevent layout shifts.
**Action:** When implementing responsive sidebars, use an overlay/drawer pattern on mobile screens (<768px) with a dark background to retain context, and ensure that navigating auto-closes the drawer. Ensure toggle buttons are not `hidden` on mobile.

## 2026-08-05 - Programmatic Label-Input Association and Form Validation Accessibility
**Learning:** When building custom wrapper components around UI library form elements (like React Bootstrap's `Form.Control`), inputs often lack programmatic association with their labels or error messages. This requires manual ID assignment (e.g., via React's `useId()`) to link `htmlFor` on the label with the `id` on the input, and using `aria-invalid`, `aria-describedby`, and `role="alert"` to properly announce validation errors to screen readers.
**Action:** Always ensure that custom form input wrappers generate and use unique IDs to associate labels with inputs, and apply necessary ARIA attributes to handle error states accessibly.
