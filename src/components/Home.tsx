import React from "react";
import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import { ToastContainer } from "react-toastify";
import "../styles/app.scss";
import "react-toastify/dist/ReactToastify.css";
import CoffeeCard from "./CoffeeBatch/CoffeeCard";
import Company from "./Company";
import Dashboard from "./Dashboard";
import Loading from "./Loading";
import Login from "./Login";
import Farmer from "./Farmer";
import Signup from "./Signup";
import { useAuthContext } from "../states/AuthContext";
import RequiredAuth from "../states/RequiredAuth";
import { Create, List, PublicList } from "./CoffeeBatch/index";

const Home = () => {
  const { authState } = useAuthContext();
  const [state] = authState;

  if (state.isLoading || state.isSigningIn) {
    return <Loading label="Cargando..." />;
  }

  return (
    <Container fluid className="main-container">
      <ToastContainer limit={4} />
      <Routes>
        <Route
          path="/"
          element={
            <RequiredAuth>
              <Dashboard>
                <List />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/list"
          element={
            <RequiredAuth>
              <Dashboard>
                <List />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequiredAuth>
              <Dashboard>
                <Create />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/batch/:ipfsHash" element={<CoffeeCard />} />
        <Route path="/coffeebatches" element={<PublicList />} />
        <Route path="/farmer/:farmerId" element={<Farmer />} />
        <Route path="/company/:companyId" element={<Company />} />
      </Routes>
    </Container>
  );
};

export default Home;
