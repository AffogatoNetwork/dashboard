import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { CookiesProvider } from "react-cookie";
import "./i18n";
import AuthProvider from "./states/AuthContext";
import contractsContext from "./states/ContractsContext";
import { useContracts } from "./hooks/useContracts";
import Home from "./components/Home";

const clientOracle = () =>
  new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/jdestephen/affogato-sg",
    cache: new InMemoryCache(),
  });

const App = () => {
  const contracts = useContracts();
  const apolloClient = clientOracle();

  return (
    <AuthProvider>
      <contractsContext.Provider value={contracts}>
        <CookiesProvider>
          <BrowserRouter>
            <ApolloProvider client={apolloClient}>
              <Home />
            </ApolloProvider>
          </BrowserRouter>
        </CookiesProvider>
      </contractsContext.Provider>
    </AuthProvider>
  );
};

export default App;
