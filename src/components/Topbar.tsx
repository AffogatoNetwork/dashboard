import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/esm/Nav";
import {
  FaHome,
  FaMugHot,
  FaPencilAlt,
  FaPowerOff,
  FaUserAlt,
} from "react-icons/fa";
import CoopLogo from "./common/CoopLogo";
import { useAuthContext } from "../states/AuthContext";
import { makeShortAddress } from "../utils/utils";

const Sidebar = () => {
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const navigate = useNavigate();
  const [ownerAddress, setOwnerAddress] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      if (state.provider != null) {
        const signer = state.provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setOwnerAddress(address);
      }
    };
    loadProvider();
  });

  const logout = () => {
    authContext.signOut();
  };

  return (
    <Navbar bg="primary" variant="dark" className="topbar">
      <Container>
        <Nav className="brand">
          <Navbar.Brand onClick={() => navigate("/list")}>
            <CoopLogo className="logo" />
          </Navbar.Brand>
        </Nav>
        <Nav className="buttons">
          <Navbar.Toggle>
            <div className="nav-caption">
              <FaUserAlt /> {makeShortAddress(ownerAddress)}
            </div>
          </Navbar.Toggle>
          <Nav.Link onClick={() => navigate("/list")}>
            <div className="nav-caption">
              <FaHome /> Hogar
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/create")}>
            <div className="nav-caption">
              <FaPencilAlt /> Crear Lotes
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/farmers")}>
            <div className="nav-caption">
              <FaMugHot /> Productores
            </div>
          </Nav.Link>
          <Navbar.Toggle onClick={() => logout()}>
            <div className="nav-caption">
              <FaPowerOff /> Cerrar Sesión
            </div>
          </Navbar.Toggle>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
