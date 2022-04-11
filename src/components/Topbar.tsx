import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Image from "react-bootstrap/esm/Image";
import Logo from "../assets/logo.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/esm/Nav";
import { FaHome, FaPencilAlt, FaPowerOff } from "react-icons/fa";
import { useAuthContext } from "../states/AuthContext";

type props = {
  accountType: string;
};

const Sidebar = ({ accountType }: props) => {
  const { authContext } = useAuthContext();
  
  const logout = () => {
    authContext.signOut();
  };

  return (    
    <Navbar bg="primary" variant="dark" className="topbar">
      <Container>
        <Nav className="brand">
          <Navbar.Brand href="#home">
            <Image src={Logo} className="logo" />
          </Navbar.Brand>
        </Nav>  
        <Nav className="buttons">
          <Nav.Link href="#home">
            <div className="nav-caption">
              <FaHome /> Hogar
            </div>
          </Nav.Link>
          <Nav.Link href="#features">
            <div className="nav-caption">
              <FaPencilAlt /> Crear Lotes
            </div>
          </Nav.Link>
          <Nav.Link href="#pricing">
            <div className="nav-caption">
              <FaPowerOff /> Cerrar Sesión
            </div>  
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
