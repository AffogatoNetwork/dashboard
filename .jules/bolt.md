## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.

## 2024-08-03 - MUI Autocomplete Unnecessary State
**Learning:** Manual state management (like `searchTerm`) inside components using MUI `Autocomplete` can trigger unnecessary React re-renders on every keystroke, negating the component's internal optimizations.
**Action:** Always leverage MUI Autocomplete's built-in props like `filterSelectedOptions` and rely on its internal filtering mechanism to avoid redundant state and manual array operations.
