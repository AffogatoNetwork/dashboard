## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.
