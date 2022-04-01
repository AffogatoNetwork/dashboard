import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import Logo from "../assets/logo.png";
import MagicContext from "../states/MagicContext";

type props = {
  changeUpdateMagic: () => void;
}

const Login = ({ changeUpdateMagic }: props) => {
  const areaCode = "+504";
  const magic = useContext(MagicContext);
  const [emailAuth, setEmailAauth] = useState(false);
  const [userInput, setUserInput] = useState("");

  const magicLogin = async () => {
    if (magic.magic) {
      if (emailAuth) {
        await magic.magic.auth.loginWithMagicLink({ email: userInput, showUI: true });
      } else {
        await magic.magic.auth.loginWithSMS({ phoneNumber: areaCode.concat(userInput) });
      }
      changeUpdateMagic();
    }
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const changeAuthMethod = () => {
    setUserInput("");
    setEmailAauth(!emailAuth);
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
            {emailAuth ? (
              <Form.Group className="mb-3 input-group">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={userInput}
                  placeholder="ejemplo@gmail.com"
                  onChange={handleUserInputChange}
                />
              </Form.Group>
            ) : (
              <Form.Group className="mb-3 input-group">
                <Form.Label>Número de teléfono</Form.Label>
                  <Form.Control
                    value={userInput}
                    placeholder="0000-0000"
                    onChange={handleUserInputChange}
                  />
              </Form.Group>
            )}
            <div className="btn-container">
              <Button variant="primary" type="button" onClick={() => magicLogin()}>
                Acceder
              </Button>
              <span className="auth-method" onClick={changeAuthMethod}>
                Acceder con {emailAuth ? "celular" : "correo  electrónico"}
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
