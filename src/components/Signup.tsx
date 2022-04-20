import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useAuthContext } from "../states/AuthContext";
import Loading from "./Loading";
import FormInput from "./common/FormInput";
import { isValidCellphone, isValidEmail, errorNotification, notifyUser } from "../utils/utils";
import { CooperativeList, CooperativeType } from "../utils/constants";


const Signup = () => {
  const areaCode = "+504";
  const navigate = useNavigate();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [userName, setUserName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [farmerIdError, setFarmerIdError] = useState("");
  const [currentCoop, setCurrentCoop] = useState<CooperativeType>(CooperativeList[0]);

  useEffect(() => {
    const checkAccount = () => {
      if (state.accountCreated) {
        notifyUser("La cuenta ha sido creada!");
      } else {
        errorNotification("No se pudo crear la cuenta!");
      }
    }
    const checkIsLoggedIn = () => {
      if (state.isLoggedIn) {
        navigate("/", { replace: true });
      }
    }
    if (state.accountCreated || state.creatingAccountError) {
      checkAccount();
    } else {
      checkIsLoggedIn(); 
    }    
    // eslint-disable-next-line
  }, [state.isLoggedIn, state.creatingAccountError, state.accountCreated]);

  const magicLogin = async () => {
    if (isValidEmail(userName)) {
      authContext.createAccount({ emailLogin: true, credential: userName, cooperative: currentCoop, farmerId: farmerId });
    } else if (isValidCellphone(userName)) {
      authContext.createAccount({ emailLogin: false, credential: areaCode.concat(userName),  cooperative: currentCoop, farmerId: farmerId });
    }
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setUserName(input);
    if (isValidCellphone(input) || isValidEmail(input)) {
      setUserNameError("");
    } else {
      setUserNameError("El valor no es valido.");
    }
  };

  const handleIdProductorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setFarmerId(input);
    if (input.trim().length > 25) {
      setFarmerIdError("Valor debe de tener menos de 25 carácteres");
    } else {
      setFarmerIdError("");
    }
  };

  const handleCooperativeChange = (key: string) => {
    for (let i = 0; i < CooperativeList.length; i++) {
      if (CooperativeList[i].key === key) {
        setCurrentCoop(CooperativeList[i]);
      }  
    }
  };

  if (state.creatingAccount) {
    return <Loading />;
  };

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <Image className="logo" src={Logo} />
            <h3>Nueva Cuenta</h3>
          </div>
          {!state.accountCreated ? (
            <Form className="form">
              <Form.Group className="mb-3 input-group">
                <FormInput
                  label="Correo electrónico o No. Celular"
                  value={userName}
                  placeholder="usuario@gmail.com"
                  handleOnChange={handleUserInputChange}
                  errorMsg={userNameError}
                />
                <FormInput
                  label="Id de productor"
                  value={farmerId}
                  placeholder="id"
                  handleOnChange={handleIdProductorChange}
                  errorMsg={farmerIdError}
                />
                <div className="form-input">
                  <Form.Label>Selecciona tu Cooperativa</Form.Label>
                  <Dropdown onSelect={(eventKey) => handleCooperativeChange(eventKey || "0")}>
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-cooperative"
                      className="text-left"
                    >
                      <div className="cooperative-toggle">
                        <span>{currentCoop.name}</span>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {CooperativeList.map((item) => (
                        <Dropdown.Item key={item.key} eventKey={item.key}>
                          {item.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Form.Group>
              {state.creatingAccountError && (
                <div className="account-created">
                  <h3>Error creando cuenta</h3>
                </div>
              )}
              <div className="btn-container">
                <Button variant="primary" type="button" onClick={() => magicLogin()}>
                  Crear cuenta
                </Button>
                <span className="auth-method" onClick={() => navigate("/login", { replace: true })}>
                  Regresar
                </span>
              </div>
            </Form>
          ) : (
            <div className="account-created">
              <h2>Cuenta creada</h2>    
            </div>  
          )}
        </Card.Body>
        <Card.Footer />
      </Card>
    </div>
  );

};

export default Signup;
