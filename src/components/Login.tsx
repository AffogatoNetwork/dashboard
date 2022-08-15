import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../states/AuthContext";
import CoopLogo from "./common/CoopLogo";
import FormInput from "./common/FormInput";
import {
  isValidCellphone,
  isValidEmail,
  errorNotification,
} from "../utils/utils";

const Login = () => {
  const { t } = useTranslation();
  const areaCode = "+504";
  const navigate = useNavigate();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [userInput, setUserInput] = useState("");
  const [userInputError, setUserInputError] = useState("");

  useEffect(() => {
    function check() {
      if (state.isLoggedIn) {
        navigate("/", { replace: true });
      } else if (state.isSignInError) {
        errorNotification("La cuenta no existe.");
        setUserInput("");
      }
    }
    check();
    // eslint-disable-next-line
  }, [state.isLoggedIn, state.isSignInError]);

  const magicLogin = async () => {
    if (isValidEmail(userInput)) {
      authContext.signIn({ emailLogin: true, credential: userInput });
    } else if (isValidCellphone(userInput)) {
      authContext.signIn({
        emailLogin: false,
        credential: areaCode.concat(userInput),
      });
    }
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setUserInput(input);
    if (isValidCellphone(input) || isValidEmail(input)) {
      setUserInputError("");
    } else {
      setUserInputError("El valor no es valido.");
    }
  };

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <CoopLogo className="logo" />
            <h3>
              <>{t("login.title")}</>
            </h3>
          </div>
          <Form className="form" onSubmit={() => magicLogin()}>
            <Form.Group className="mb-3 input-group">
              <FormInput
                label={t("login.subtitle")}
                value={userInput}
                placeholder={t("placeholders.email")}
                handleOnChange={handleUserInputChange}
                errorMsg={userInputError}
              />
            </Form.Group>
            <div className="btn-container">
              <Button
                variant="primary"
                type="button"
                onClick={() => magicLogin()}
              >
                <>{t("login.access")}</>
              </Button>
              <Button
                className="auth-method"
                onClick={() => navigate("/signup", { replace: true })}
              >
                <u>
                  <>{t("login.create-account")}</>
                </u>
              </Button>
              <span className="primary">
                <>{t("or")}</>
              </span>
              <Button
                className="auth-method"
                onClick={() => navigate("/coffeebatches", { replace: true })}
              >
                <u>
                  <>{t("login.buyer-access")}</>
                </u>
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
