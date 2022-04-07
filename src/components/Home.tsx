import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import "../styles/app.scss";
import Loading from "./Loading";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useAuthContext } from "../states/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const [state] = authState;

  useEffect(() => {
    const checkAuth = () => {
      console.log("-- location ----");
      console.log(window.location.pathname)
      if (!state.isLoggedIn && window.location.pathname !== "/login") {
        console.log("-- 111 ----");
        navigate("/login", { replace: true });
      }
      if (state.isLoggedIn && window.location.pathname === "/login") {
        console.log("-- 222 ----");
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
      </Routes>
    </Container>
  );
};

export default Home;
