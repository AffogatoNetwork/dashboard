import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./states/AuthContext";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
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
        <BrowserRouter>
          <ApolloProvider client={apolloClient}>
            <Home />
          </ApolloProvider>
        </BrowserRouter>
      </contractsContext.Provider>
    </AuthProvider>
  );
};

export default App;
