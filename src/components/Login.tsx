import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useAuthContext } from "../states/AuthContext";
import { isValidCellphone, isValidEmail, errorNotification } from "../utils/utils";

const Login = () => {
  const areaCode = "+504";
  const navigate = useNavigate();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [userInput, setUserInput] = useState("");

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
      authContext.signIn({ emailLogin: false, credential: areaCode.concat(userInput) });
    }
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <Image className="logo" src={Logo} />
            <h3>Accede a tu Cuenta</h3>
          </div>
          <Form className="form">
            <Form.Group className="mb-3 input-group">
              <Form.Label>Correo o No. Celular</Form.Label>
              <Form.Control
                value={userInput}
                placeholder="00000000"
                onChange={handleUserInputChange}
              />
            </Form.Group>
            <div className="btn-container">
              <Button variant="primary" type="button" onClick={() => magicLogin()}>
                Acceder
              </Button>
              <span className="auth-method"  onClick={() => navigate("/signup", { replace: true })}>
                No tienes cuenta? Crea una aquí.
              </span>
            </div>
          </Form>          
        </Card.Body>
        <Card.Footer>

        </Card.Footer>
      </Card>
    </div>
  );

};

export default Login;
