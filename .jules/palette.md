## 2024-05-24 - Accessibility for Icon-only Buttons
**Learning:** Found an icon-only button in the Sidebar used to toggle expansion state which was lacking an ARIA label, reducing usability for screen readers.
**Action:** Always verify icon-only buttons have an `aria-label`. For toggle components, also provide an `aria-expanded` property for clear state reflection. Use the `react-i18next` `t` function with a fallback for such labels.
