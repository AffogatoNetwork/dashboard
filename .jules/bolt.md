## 2026-07-25 - [Initialize ApolloClient Outside React Tree]
**Learning:** Initializing an ApolloClient instance inside a React component (even at the root like App.tsx) causes the client and its InMemoryCache to be destroyed and re-instantiated on every re-render, negating all caching benefits and potentially causing severe performance degradation.
**Action:** Always instantiate ApolloClient outside of the React component tree (e.g., at the module level) to ensure the cache persists across renders.
