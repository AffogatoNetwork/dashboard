## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.

## 2025-03-05 - Optimizing Paginated Tables with DOM-dependent Export Tools
**Learning:** When using DOM-based export tools (like `ReactHTMLTableToExcel`), you cannot simply remove hidden paginated rows from the DOM because the export tool requires them to be physically present.
**Action:** Instead of unmounting hidden rows, use CSS to hide them (`display: none`) and apply `React.memo` to the row component with a custom comparison function. Conditionally render heavy child components (like `<QRCode>`) based on the row's visibility prop. This prevents React from needlessly re-rendering and building heavy elements for hidden rows while keeping the lightweight DOM structure intact for the export tool.
