## 2024-07-24 - ApolloClient Re-initialization
**Learning:** Initializing `ApolloClient` inside the main `App` component creates a new instance on every render, destroying the `InMemoryCache` and causing redundant network requests.
**Action:** Always initialize `ApolloClient` outside of the React component tree to ensure the cache persists and performs efficiently.

## 2024-05-24 - SDK Instantiation in React Contexts
**Learning:** SDKs like `Magic` and utilities like `emailjs` were being instantiated inside the `AuthProvider` component, leading to unnecessary re-instantiation on every render of the provider.
**Action:** Always verify that expensive SDK instantiations and configuration calls (like `new Magic(...)` or `emailjs.init(...)`) are placed outside of React component definitions so they are evaluated only once per module load.

## 2024-08-11 - Autocomplete Unnecessary Renders and State Management
**Learning:** Material UI's `<Autocomplete>` component comes with highly optimized internal filtering logic natively via `filterSelectedOptions`. However, custom onChange implementations that map selected items back into *new* object references will inadvertently break referential equality. This defeats the internal filter mechanism and causes parent components to unnecessarily update string-filtering states on every keystroke, severely degrading input performance on forms with large option lists (like varieties and farmers).
**Action:** Always prefer relying on the `<Autocomplete>` internal filtering state by providing referentially intact arrays to its value. Use `filterSelectedOptions` natively instead of duplicating manual local `searchTerm` state filters inside parent React components.
