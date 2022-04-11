import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import "../styles/app.scss";
import Loading from "./Loading";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import { useAuthContext } from "../states/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const [state] = authState;

  const needsAuth = () => {
    return window.location.pathname !== "/login" && window.location.pathname !== "/signup";
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!state.isLoggedIn && needsAuth()) {
        navigate("/login", { replace: true });
      }
      if (state.isLoggedIn) {
        navigate("/", { replace: true });
      }
    }
    checkAuth();
  }, [state]);

  if (state.isLoading || state.isSigningIn) {
    return <Loading />;
  };

  return (
    <Container fluid className="main-container">
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Container>
  );
};

export default Home;
