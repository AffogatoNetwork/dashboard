import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
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
  const [activeTab, setActiveTab] = useState("farmer");
  const [userName, setUserName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [farmerIdError, setFarmerIdError] = useState("");
  const [coopError, setCoopError] = useState("");
  const [currentCoop, setCurrentCoop] = useState<CooperativeType>(CooperativeList[0]);

  const cleanFields = () => {
    setUserName("");
    setFarmerId("");
    setCurrentCoop(CooperativeList[0]);
  }

  useEffect(() => {
    const checkAccount = () => {
      if (state.accountCreated) {
        notifyUser("La cuenta ha sido creada!");
        cleanFields();
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

  const isValid = (): boolean => {
    let valid = true;
    if (!isValidCellphone(userName) && !isValidEmail(userName)) {
      setUserNameError("El valor no es valido.");
      valid = false;
    }
    if (farmerId.trim().length > 25) {
      setFarmerIdError("Valor debe de tener menos de 25 carácteres.");
      valid = false;
    }
    if (currentCoop.key === "0") {
      setCoopError("Seleccione una cooperativa.");
      valid = false;
    }
    return valid;
  }

  const magicLogin = async () => {
    if (isValid()) {
      const data = {
        emailLogin: true,
        credential: userName.trim(),
        cooperative: currentCoop,
        farmerId: farmerId,
        isFarmer: activeTab === "farmer",
      };
      if (isValidEmail(userName.trim())) {
        authContext.createAccount(data);
      } else if (isValidCellphone(userName.trim())) {
        data.credential = areaCode.concat(userName.trim());
        data.emailLogin = false;
        authContext.createAccount(data);
      }
    } else {
      errorNotification("Los datos no son validos");
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
        if (key === "0") {
          setCoopError("Seleccione una cooperativa.");
        } else {
          setCoopError("");
        }
      }  
    }
  };

  const RenderForm = () => (
    <Form className="form">
      <Form.Group className="mb-3 input-group">
        <FormInput
          label="Correo electrónico o No. Celular"
          value={userName}
          placeholder="usuario@gmail.com"
          handleOnChange={handleUserInputChange}
          errorMsg={userNameError}
        />
        {activeTab === "farmer" && (
          <FormInput
            label="Id de productor"
            value={farmerId}
            placeholder="id"
            handleOnChange={handleIdProductorChange}
            errorMsg={farmerIdError}
          />
        )}
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
          {coopError !== "" && <span className="error-message">{coopError}</span> }
        </div>
      </Form.Group>
      {state.creatingAccountError && (
        <div className="account-created">
          <h3>Error creando cuenta</h3>
        </div>
      )}      
    </Form>
  );

  if (state.creatingAccount) {
    return <Loading />;
  };

  return (
    <div className="login">
      <Card className="auth-card">
        <Card.Body>
          <div className="header">
            <Image className="logo" src={Logo} />
            <h3>
              {state.accountCreated ? "Cuenta Creada" : "Nueva Cuenta"}
            </h3>
          </div>
          {!state.accountCreated ? (
            <div className="tabs-container">
              <Tabs
                id="signup-tabs"
                defaultActiveKey="farmer"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "farmer")}
                className="mb-3"
              >
                <Tab eventKey="farmer" title="Productor">
                  {RenderForm()}
                </Tab>
                <Tab eventKey="cooperative" title="Cooperativa">
                  {RenderForm()}
                </Tab>
              </Tabs>
              <div className="btn-container">
                <Button variant="primary" type="button" onClick={() => magicLogin()}>
                  Crear cuenta
                </Button>
                <span className="auth-method" onClick={() => navigate("/login", { replace: true })}>
                  Regresar
                </span>
              </div>
            </div>
          ) : (
            <div className="account-created">
              {activeTab === "farmer" ? (
                <h6>Sus datos han sido enviados a la cooperativa</h6>
              ): (
                <h6>Sus datos han sido enviados al equipo de affogato</h6>
              )}
              <span
                className="auth-method"
                onClick={
                  () => {
                    authContext.fakeSignOut();
                    navigate("/login", { replace: true });
                  }
                }
              >
                Inicio de Sesión
              </span>  
            </div>  
          )}
        </Card.Body>
      </Card>
    </div>
  );

};

export default Signup;
