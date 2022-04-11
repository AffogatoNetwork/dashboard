import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import FormInput from "./common/FormInput";
import { isValidCellphone, isValidEmail } from "../utils/utils";
import { CooperativeList, CooperativeType } from "../utils/constants";


const Signup = () => {
  const areaCode = "+504";
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [farmerIdError, setFarmerIdError] = useState("");
  const [currentCoop, setCurrentCoop] = useState<CooperativeType>(CooperativeList[0]);

  const magicLogin = async () => {
    
  };

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setUserName(input);
    console.log("aqui");
    if (isValidCellphone(input) || isValidEmail(input)) {
      setUserNameError("");
    } else {
      console.log("invalid");
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

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <Image className="logo" src={Logo} />
            <h3>Nueva Cuenta</h3>
          </div>
          <Form className="form">
            <Form.Group className="mb-3 input-group">
              <FormInput
                label="Correo o No. Celular"
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
            <div className="btn-container">
              <Button variant="primary" type="button" onClick={() => magicLogin()}>
                Crear cuenta
              </Button>
              <span className="auth-method"  onClick={() => navigate("/login", { replace: true })}>
                Regresar
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

export default Signup;
