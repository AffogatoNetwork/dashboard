import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import { CookiesProvider } from 'react-cookie';
import './i18n';
import AuthProvider from './states/AuthContext';

import contractsContext from './states/ContractsContext';
import { useContracts } from './hooks/useContracts';
import Home from './components/Home';
import '../src/assets/css/scrollbar.css';
import '../src/styles/app.scss';

import DynamicHeader from './components/DynamicHeader/DynamicHeader';

const clientOracle = () =>
  new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/jdestephen/affogato-sg',
    }),
    cache: new InMemoryCache(),
  });

const App = () => {
  const contracts = useContracts();
  const apolloClient = clientOracle();

  return (
    <>
      <DynamicHeader />
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
