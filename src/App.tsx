import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./states/AuthContext";
import contractsContext from "./states/ContractsContext";
import { useContracts } from "./hooks/useContracts";
import Home from "./components/Home";

const App = () => {
  const contracts = useContracts();

  return (
    <AuthProvider>
      <contractsContext.Provider value={contracts}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </contractsContext.Provider>
    </AuthProvider>
  );
};

export default App;
