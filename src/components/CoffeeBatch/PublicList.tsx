import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "../../styles/app.scss";
import LangChooser from "../common/LangChooser";
import { List } from "./index";
import CoopLogo from "../common/CoopLogo";

export const PublicList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authCookie, setAuthCookie] = useCookies(["is_buyer_auth"]);
  const [isAuth, setAuth] = useState(authCookie.is_buyer_auth === "1");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setPassword(input);
  };

  const checkPassword = (): boolean => {
    let isValid = false;
    const location = window.location.host;
    if (location.match("comsa") !== null) {
      isValid = password === process.env.REACT_APP_PASS_COMSA;
    } else if (location.match("commovel") !== null) {
      isValid = password === process.env.REACT_APP_PASS_COMMOVEL;
    } else if (location.match("copranil") !== null) {
      isValid = password === process.env.REACT_APP_PASS_COPRANIL;
    } else if (location.match("proexo") !== null) {
      isValid = password === process.env.REACT_APP_PASS_PROEXO;
    } else {
      isValid = password === process.env.REACT_APP_PASS_AFFOGATO;
    }
    return isValid;
  };

  const handleOnClick = () => {
    if (checkPassword()) {
      setPasswordError("");
      setAuthCookie("is_buyer_auth", 1, { maxAge: 6900 });
      setAuth(true);
    } else {
      setPasswordError("La constraseña no es correcta");
    }
  };

  if (isAuth) {
    return <List />;
  }

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <CoopLogo className="logo" />
            <h3>
              <>{t("login.buyer-title")}</>
            </h3>
            <span className="primary">
              <>{t("login.buyer-subtitle")}</>
            </span>
          </div>
          <Form className="form" onSubmit={() => handleOnClick()}>
            <Form.Group className="mb-3 input-group">
              <div className="form-input">
                <Form.Label>
                  <>{t("login.buyer-password")}</>
                </Form.Label>
                <Form.Control
                  value={password}
                  placeholder="*******"
                  onChange={handlePasswordChange}
                  type="password"
                />
                {passwordError !== "" && (
                  <span className="error-message">{passwordError}</span>
                )}
              </div>
            </Form.Group>
            <div className="btn-container">
              <Button
                variant="primary"
                type="button"
                onClick={() => handleOnClick()}
              >
                <>{t("login.access")}</>
              </Button>
              <Button
                variant="secondary"
                className="auth-method"
                onClick={() => navigate("/login", { replace: true })}
              >
                <u>
                  <>{t("signup.back")}</>
                </u>
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <LangChooser/>
    </div>
  );
};
