import React from "react";
import Container from "react-bootstrap/esm/Container";
import Topbar from "./Topbar";

function Dashboard({ children }: { children: JSX.Element }) {
  return (
    <Container fluid className="home-container">
      <Topbar />
      <div className="inner-container">{children}</div>
    </Container>
  );
}

export default Dashboard;
