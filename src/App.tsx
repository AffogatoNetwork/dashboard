import React, {useEffect, useState} from "react";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { HelmetProvider } from 'react-helmet-async';

import { CookiesProvider } from "react-cookie";
import "./i18n";
import AuthProvider from "./states/AuthContext";
import contractsContext from "./states/ContractsContext";
import { useContracts } from "./hooks/useContracts";
import Home from "./components/Home";
import '../src/assets/css/scrollbar.css';
import '../src/assets/css/globals.css';
import '../src/assets/css/range-slider.css';

import { QueryClient, QueryClientProvider } from 'react-query';

const clientOracle = () =>
  new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/jdestephen/affogato-sg",
    cache: new InMemoryCache(),
  });
function getFaviconEl() {
    return document.getElementById("favicon");
}

const App = () => {



  const contracts = useContracts();
  const apolloClient = clientOracle();
  const favicon = getFaviconEl(); // Accessing favicon element

  const [cooperative, setCompany] = useState("");
  useEffect(() => {
    const location = window.location.host;

    if (location.match("commovel") !== null) {
      setCompany('Commovel');
      // @ts-ignore
      favicon.href = "assets/favicon/commovel.ico";
    }
    if (location.match("copranil") !== null) {
      setCompany('Copranil');
      // @ts-ignore
      favicon.href = "assets/favicon/copranil.ico";
    }
    if (location.match("comsa") !== null) {
      setCompany('Comsa');
      // @ts-ignore
      favicon.href = "assets/favicon/comsa.ico";
    }
    if (location.match("proexo") !== null) {
      setCompany('Proexo');
      // @ts-ignore
      favicon.href = "assets/favicon/proexo.ico";
    } else {
      setCompany('Plataforma de trazabilidad');
      // @ts-ignore
      favicon.href = "assets/favicon/favicon.ico";
    }
  })

  return (
      <>
      <HelmetProvider>
          <title>  {cooperative}</title>
          <link rel="icon" type="image/png" href="assets/comsa.png" sizes="16x16" />
      </HelmetProvider>
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
      </>
  );
};

export default App;
