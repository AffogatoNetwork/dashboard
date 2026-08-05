## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.


## 2024-08-05 - Optimizing Pagination with HTML Table Exports
**Learning:** Standard list virtualization (early returns) fails when a DOM-based export tool (like `ReactHTMLTableToExcel`) is used, because these tools require all table rows to physically exist in the DOM, even if hidden.
**Action:** When working with hidden elements in large lists (e.g., pagination that uses CSS `display: none`), use `React.memo` with a custom comparison function that only re-renders when the visibility state changes. Furthermore, lazily render heavy children (like `<QRCode>` or canvases) inside the hidden elements based on visibility, drastically improving rendering performance while keeping the wrapper tags in the DOM for external tools to parse.
