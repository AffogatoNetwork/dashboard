import React from "react";
import Container from "react-bootstrap/esm/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/esm/Nav";


const Topbar = () => {




  return (
    <Navbar bg="primary" variant="dark" className="topbar">
      <Container>

        <Nav className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
        </Nav>
                </Container>
    </Navbar>
  );
};

export default Topbar;
