import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/esm/Nav";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaUserFriends,
  FaMugHot,
  FaPencilAlt,
  FaPowerOff,
  FaUserAlt,
  FaList,
} from "react-icons/fa";
import LangChooser from "./common/LangChooser";
import CoopLogo from "./common/CoopLogo";
import { useAuthContext } from "../states/AuthContext";
import { makeShortAddress } from "../utils/utils";

const Topbar = () => {
  const { t } = useTranslation();
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
        <Nav className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
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
          <Nav.Link onClick={() => navigate("/")}>
            <div className="nav-caption">
              <>
                <FaHome /> {t("home")}
              </>
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/list")}>
            <div className="nav-caption">
              <>
                <FaList /> {t("all-batches")}
              </>
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/create")}>
            <div className="nav-caption">
              <>
                <FaPencilAlt /> {t("create-batches.menu")}
              </>
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/farmers")}>
            <div className="nav-caption">
              <>
                <FaUserFriends /> {t("farmers")}
              </>
            </div>
          </Nav.Link>
          <Nav.Link onClick={() => navigate("/farms")}>
            <div className="nav-caption">
              <>
                <FaMugHot /> {t("farms")}
              </>
            </div>
          </Nav.Link>
          <Navbar.Toggle onClick={() => logout()}>
            <div className="nav-caption">
              <>
                <FaPowerOff /> {t("logout")}
              </>
            </div>
          </Navbar.Toggle>
          <Nav className="flag-navitem">
            <LangChooser type="dropdown" />
          </Nav>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Topbar;
