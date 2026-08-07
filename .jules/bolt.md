## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.


## 2024-08-07 - Lazy rendering of child components for HTML export tools
**Learning:** When optimizing paginated lists that rely on DOM-based export tools (like `ReactHTMLTableToExcel`), you cannot remove hidden list item elements from the DOM or the tool will fail to export them.
**Action:** Use `React.memo` for the list item container to prevent re-renders when parent state updates, and lazily render *heavy child components* (like `<QRCode>`) based on visibility, replacing them with lightweight placeholders when hidden to save rendering overhead while preserving the DOM row.
