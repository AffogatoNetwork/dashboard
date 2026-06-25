import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "../../styles/app.scss";
import LangChooser from "../common/LangChooser";
import { List } from "./index";
import CoopLogo from "../common/CoopLogo";
import { getCoopByHost } from "../../utils/utils";

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
    const coopName = getCoopByHost(window.location.host)?.name ?? null;
    const passMap: Record<string, string | undefined> = {
      COMSA:     process.env.REACT_APP_PASS_COMSA,
      COMMOVEL:  process.env.REACT_APP_PASS_COMMOVEL,
      COPRACNIL: process.env.REACT_APP_PASS_COPRANIL,
      PROEXO:    process.env.REACT_APP_PASS_PROEXO,
    };
    const expected = coopName
      ? (passMap[coopName] ?? process.env.REACT_APP_PASS_AFFOGATO)
      : process.env.REACT_APP_PASS_AFFOGATO;
    return password === expected;
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
      <div className="card auth-card">
        <div className="card-body">
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
              <button
                  className="btn btn-primary"
                  onClick={() => handleOnClick()}
              >
                <>{t("login.access")}</>
              </button>
              <button className="btn btn-primary"
                onClick={() => navigate("/login", { replace: true })}
              >
                <u>
                  <>{t("signup.back")}</>
                </u>
              </button>
            </div>
          </Form>
        </div>
      </div>
      <LangChooser/>
    </div>
  );
};
