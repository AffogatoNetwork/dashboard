## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.


## 2024-07-28 - Unnecessary Autocomplete React Re-renders
**Learning:** Using controlled React state for search terms and performing array filtering manually inside MUI `Autocomplete` components causes redundant renders on every keystroke, which can severely impact performance for large datasets.
**Action:** Instead of managing manual search state and filtering arrays, utilize `Autocomplete`'s built-in filtering prop (`filterSelectedOptions`) while passing the entire options array.
