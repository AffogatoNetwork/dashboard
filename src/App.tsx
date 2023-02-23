import React, {useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {ApolloProvider, ApolloClient, InMemoryCache} from "@apollo/client";

import {CookiesProvider} from "react-cookie";
import "./i18n";
import AuthProvider from "./states/AuthContext";
import {useAuthContext} from "./states/AuthContext";

import contractsContext from "./states/ContractsContext";
import {useContracts} from "./hooks/useContracts";
import Home from "./components/Home";
import '../src/assets/css/scrollbar.css';
import '../src/assets/css/globals.css';
import '../src/assets/css/range-slider.css';

import DynamicHeader from "./components/DynamicHeader/DynamicHeader";

const clientOracle = () => new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/jdestephen/affogato-sg", cache: new InMemoryCache(),
});


const App = () => {

    const contracts = useContracts();
    const apolloClient = clientOracle();

    return (<>
            <DynamicHeader/>
            <AuthProvider>
                <contractsContext.Provider value={contracts}>
                    <CookiesProvider>
                        <BrowserRouter>
                            <ApolloProvider client={apolloClient}>
                                <Home/>
                            </ApolloProvider>
                        </BrowserRouter>
                    </CookiesProvider>
                </contractsContext.Provider>
            </AuthProvider>
        </>);
};

export default App;
