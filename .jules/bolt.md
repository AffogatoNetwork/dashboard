## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.


## 2024-08-10 - Optimizing DOM-based exports for paginated lists
**Learning:** Tools like `ReactHTMLTableToExcel` require all data rows to be physically present in the DOM (even if visually hidden) to export them. This causes massive performance bottlenecks when paginating large lists since every row tries to render heavy components (like `<QRCode>`) and unnecessary re-renders happen on page changes.
**Action:** When keeping hidden rows in the DOM for export purposes, always use `React.memo` with a custom comparison function checking visibility, and lazily render heavy inner child components only when their row is actually visible on the current page.
