import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./states/AuthContext";
import Home from "./components/Home";

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
