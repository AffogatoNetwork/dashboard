import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Topbar from "./Topbar";


const Dashboard = () => {
  
  return (
    <Container fluid className="home-container">
      <Topbar  accountType="farmer" />
      <div className="content">        
      </div>  
    </Container>
  );
};

export default Dashboard;
