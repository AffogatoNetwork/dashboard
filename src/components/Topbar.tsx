import React from "react";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/esm/Nav";

import { useProSidebar } from "react-pro-sidebar";
import { MenuIcon } from "./icons/menu";



const Topbar = () => {

  const { collapseSidebar } = useProSidebar();



  return (
    <Navbar bg="primary" variant="dark" className="topbar">
      <Container>

        <Nav className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
          <main className="">
            <button onClick={() => collapseSidebar()}> <MenuIcon/> </button>
          </main>
        </Nav>
                </Container>
    </Navbar>
  );
};

export default Topbar;
