import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import { useAuthContext } from "../states/AuthContext";
import Sidebar from "./Sidebar";


const Dashboard = () => {
  const { authContext } = useAuthContext();
  
  const logout = () => {
    authContext.signOut();
  };
  
  return (
    <Container fluid className="home-container">
      <Sidebar  accountType="farmer" />
      <div className="content">
        <Card>
          <Button onClick={() => logout()}>
            Logout
          </Button>
        </Card>
      </div>  
    </Container>
  );
};

export default Dashboard;
