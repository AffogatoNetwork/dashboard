import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import Tabs from "react-bootstrap/esm/Tabs";
import Tab from "react-bootstrap/esm/Tab";
import { useNavigate } from "react-router-dom";
import User from "../assets/user.png";
import { useAuthContext } from "../states/AuthContext";
import CoopLogo from "./common/CoopLogo";
import Loading from "./Loading";
import FormInput from "./common/FormInput";
import "../styles/signup.scss";
import {
  isValidCellphone,
  isValidEmail,
  errorNotification,
  notifyUser,
} from "../utils/utils";
import {
  CooperativeList,
  CooperativeType,
  GenderList,
  RegionList,
  RegionType,
} from "../utils/constants";

const Signup = () => {
  const areaCode = "+504";
  const navigate = useNavigate();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [activeTab, setActiveTab] = useState("farmer");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setImageFile] = useState();
  const [userName, setUserName] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [fullname, setFullname] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [farmerIdError, setFarmerIdError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [coopError, setCoopError] = useState("");
  const [currentGender, setCurrentGender] = useState<RegionType>(GenderList[0]);
  const [currentCoop, setCurrentCoop] = useState<CooperativeType>(
    CooperativeList[0]
  );
  const [currentRegion, setCurrentRegion] = useState<RegionType>(RegionList[0]);
  const [regionError, setRegionError] = useState("");
  const [village, setVillage] = useState("");
  const [villageError, setVillageError] = useState("");
  const [village2, setVillage2] = useState("");
  const [village2Error, setVillage2Error] = useState("");
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState("");
  const hiddenFileInput = useRef(null);

  const cleanFields = () => {
    setUserName("");
    setFarmerId("");
    setSelectedImage("");
    setCurrentCoop(CooperativeList[0]);
  };

  const setCooperative = () => {
    const location = window.location.host;
    if (location.match("loca") !== null) {
      setCurrentCoop(CooperativeList[1]);
    }
    if (location.match("copranil") !== null) {
      setCurrentCoop(CooperativeList[2]);
    }
    if (location.match("comsa") !== null) {
      setCurrentCoop(CooperativeList[3]);
    }
    if (location.match("proexo") !== null) {
      setCurrentCoop(CooperativeList[4]);
    }
  };

  useEffect(() => {
    setCooperative();
    const checkAccount = () => {
      if (state.accountCreated) {
        notifyUser("La cuenta ha sido creada!");
        cleanFields();
      } else {
        errorNotification("No se pudo crear la cuenta!");
      }
    };
    const checkIsLoggedIn = () => {
      if (state.isLoggedIn) {
        navigate("/", { replace: true });
      }
    };
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
  };

  const farmerData = {
    address: "",
    farmerId,
    fullname,
    bio,
    gender: currentGender.key,
    country: "Honduras",
    region: currentRegion.key,
    village,
    village2,
  };

  const magicLogin = async () => {
    if (isValid()) {
      const data = {
        emailLogin: true,
        credential: userName.trim(),
        cooperative: currentCoop,
        farmerId,
        isFarmer: activeTab === "farmer",
        farmerData,
        imageFile,
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

  const handleOnImageChange = (event: any) => {
    if (event.target.files !== null) {
      setImageFile(event.target.files[0]);
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleClick = (event: any) => {
    if (hiddenFileInput) {
      // @ts-ignore
      hiddenFileInput.current.click();
    } else {
      console.log(event);
    }
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setUserName(input);
    if (isValidCellphone(input) || isValidEmail(input)) {
      setUserNameError("");
    } else {
      setUserNameError("El valor no es valido.");
    }
  };

  const handleIdProductorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setFarmerId(input);
    if (input.trim().length > 25) {
      setFarmerIdError("Valor debe de tener menos de 25 carácteres");
    } else {
      setFarmerIdError("");
    }
  };

  const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setFullname(input);
    if (input.trim().length > 25) {
      setFullnameError("Valor debe de tener menos de 70 carácteres");
    } else {
      setFullnameError("");
    }
  };

  const handleVillageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setVillage(input);
    if (input.trim().length > 70) {
      setVillageError("Valor debe de tener menos de 25 carácteres");
    } else {
      setVillageError("");
    }
  };

  const handleVillage2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setVillage2(input);
    if (input.trim().length > 70) {
      setVillage2Error("Valor debe de tener menos de 25 carácteres");
    } else {
      setVillage2Error("");
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setBio(input);
    if (input.trim().length > 700) {
      setBioError("Valor debe de tener menos de 700 carácteres");
    } else {
      setBioError("");
    }
  };

  const handleCooperativeChange = (key: string) => {
    for (let i = 0; i < CooperativeList.length; i += 1) {
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

  const handleRegionChange = (key: string) => {
    for (let i = 0; i < RegionList.length; i += 1) {
      if (RegionList[i].key === key) {
        setCurrentRegion(RegionList[i]);
        if (key === "0") {
          setRegionError("Seleccione un departamento.");
        } else {
          setRegionError("");
        }
      }
    }
  };

  const handleGenderChange = (key: string) => {
    for (let i = 0; i < GenderList.length; i += 1) {
      if (GenderList[i].key === key) {
        setCurrentGender(GenderList[i]);
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
        <div className="form-input">
          <Form.Label>Selecciona tu Cooperativa</Form.Label>
          <Dropdown
            onSelect={(eventKey) => handleCooperativeChange(eventKey || "0")}
          >
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
          {coopError !== "" && (
            <span className="error-message">{coopError}</span>
          )}
        </div>
      </Form.Group>
      {state.creatingAccountError && (
        <div className="account-created">
          <h3>Error creando cuenta</h3>
        </div>
      )}
    </Form>
  );

  const RenderFarmerForm = () => (
    <Form className="form">
      <Form.Group className="mb-3 input-group">
        <Col className="inputs" sm={12} md={12} lg={12}>
          <Col sm={12} md={6} lg={6}>
            <div className="img-container">
              <Image
                src={selectedImage !== "" ? selectedImage : User}
                roundedCircle
                className="profile-pic"
                onClick={handleClick}
              />
              <Form.Control
                type="file"
                placeholder="Seleccione imagen."
                onChange={handleOnImageChange}
                ref={hiddenFileInput}
                style={{ display: "none" }}
              />
            </div>
            <FormInput
              label="Correo electrónico o No. Celular"
              value={userName}
              placeholder="usuario@gmail.com"
              handleOnChange={handleUserInputChange}
              errorMsg={userNameError}
            />
            <FormInput
              label="Nombre Completo"
              value={fullname}
              placeholder="Nombre y Apellido"
              handleOnChange={handleFullnameChange}
              errorMsg={fullnameError}
            />
            <FormInput
              label="Id de productor"
              value={farmerId}
              placeholder="id"
              handleOnChange={handleIdProductorChange}
              errorMsg={farmerIdError}
            />
            <div className="form-input">
              <Form.Label>Sexo</Form.Label>
              <Dropdown
                onSelect={(eventKey) =>
                  handleGenderChange(eventKey || "female")
                }
              >
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-cooperative"
                  className="text-left"
                >
                  <div className="cooperative-toggle">
                    <span>{currentGender.name}</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {GenderList.map((item) => (
                    <Dropdown.Item key={item.key} eventKey={item.key}>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col sm={12} md={6} lg={6}>
            <div className="form-input">
              <Form.Label>Selecciona tu Empresa</Form.Label>
              <Dropdown
                onSelect={(eventKey) =>
                  handleCooperativeChange(eventKey || "0")
                }
              >
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
              {coopError !== "" && (
                <span className="error-message">{coopError}</span>
              )}
            </div>
            <div className="form-input">
              <Form.Label>Departamento</Form.Label>
              <Dropdown
                onSelect={(eventKey) => handleRegionChange(eventKey || "0")}
              >
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-cooperative"
                  className="text-left"
                >
                  <div className="cooperative-toggle">
                    <span>{currentRegion.name}</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {RegionList.map((item) => (
                    <Dropdown.Item key={item.key} eventKey={item.key}>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {coopError !== "" && (
                <span className="error-message">{regionError}</span>
              )}
            </div>
            <FormInput
              label="Municipio"
              value={village}
              placeholder="Municipio"
              handleOnChange={handleVillageChange}
              errorMsg={villageError}
            />
            <FormInput
              label="Aldea"
              value={village2}
              placeholder="Aldea"
              handleOnChange={handleVillage2Change}
              errorMsg={village2Error}
            />
            <div className="form-input">
              <Form.Label>Biografía</Form.Label>
              <Form.Control
                value={bio}
                as="textarea"
                rows={5}
                placeholder="Ingrese su biografía"
                onChange={handleBioChange}
              />
              {bioError !== "" && (
                <span className="error-message">{bioError}</span>
              )}
            </div>
          </Col>
        </Col>
      </Form.Group>
      {state.creatingAccountError && (
        <div className="account-created">
          <h3>Error creando cuenta</h3>
        </div>
      )}
    </Form>
  );

  const CardTitle = (): string => {
    if (state.accountCreated) {
      if (activeTab === "farmer") {
        return "Productor creado";
      }
      return "Cuenta Creada";
    }
    if (activeTab === "farmer") {
      return "Agregar Productor";
    }
    return "Nueva Empresa";
  };

  if (state.creatingAccount) {
    return <Loading label="Cargando..." />;
  }

  return (
    <div className="signup">
      <Card
        className={activeTab === "farmer" ? "farmer-card" : "cooperative-card"}
      >
        <Card.Body>
          <div className="header">
            <CoopLogo className="logo" />
            <h3>{CardTitle()}</h3>
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
                  {RenderFarmerForm()}
                </Tab>
                <Tab eventKey="cooperative" title="Empresa">
                  {RenderForm()}
                </Tab>
              </Tabs>
              <div className="btn-container">
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => magicLogin()}
                >
                  Crear cuenta
                </Button>
                <Button
                  variant="secondary"
                  className="auth-method"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Regresar
                </Button>
              </div>
            </div>
          ) : (
            <div className="account-created">
              {activeTab === "farmer" ? (
                <h6>Sus datos han sido enviados a la empresa</h6>
              ) : (
                <h6>Sus datos han sido enviados al equipo de affogato</h6>
              )}
              <Button
                className="auth-method"
                onClick={() => {
                  authContext.fakeSignOut();
                  navigate("/login", { replace: true });
                }}
              >
                Inicio de Sesión
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
