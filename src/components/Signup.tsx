import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import MultipleValueTextInput from "react-multivalue-text-input";
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
  // Cooperative fields
  const [isEmailUser, setEmailUser] = useState(true);
  const [cellphone, setCellphone] = useState("");
  const [cellphoneError, setCellphoneError] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressLineError, setAddressLineError] = useState("");
  const [socialReason, setSocialReason] = useState("");
  const [socialReasonError, setSocialReasonError] = useState("");
  const [cupProfile, setCupProfile] = useState("");
  const [cupProfileError, setCupProfileError] = useState("");
  const [longitude, setLongitude] = useState("");
  const [longitudeError, setLongitudeError] = useState("");
  const [latitude, setLatitude] = useState("");
  const [latitudeError, setLatitudeError] = useState("");
  const [review, setReview] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [productiveAreas, setProductiveAreas] = useState("");
  const [productiveAreasError, setProductiveAreasError] = useState("");
  const [products, setProducts] = useState<Array<string>>([]);
  const [socialNetworks, setSocialNetworks] = useState<Array<string>>([]);
  const [website, setWebsite] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerNameError, setManagerNameError] = useState("");
  const [noPartnersM, setNoPartnersM] = useState("");
  const [noPartnersMError, setNoPartnersMError] = useState("");
  const [noPartnersF, setNoPartnersF] = useState("");
  const [noPartnersFError, setNoPartnersFError] = useState("");

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
      setCoopError("Seleccione una empresa.");
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
    company: currentCoop.name,
    village,
    village2,
  };

  const companyData = {
    address: "",
    name: currentCoop.name,
    cellphone: isEmailUser ? cellphone : userName,
    email: isEmailUser ? userName : cellphone,
    addressLine,
    socialReason,
    latitude,
    longitude,
    review,
    avgCupProfile: cupProfile,
    website,
    socialNetworks,
    productiveAreas,
    products,
    managerName,
    malePartners: noPartnersM,
    femalePartners: noPartnersF,
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
        companyData,
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
      setEmailUser(isValidEmail(input));
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
          setCoopError("Seleccione una empersa.");
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

  // Cooperative handlers
  const handleCellphoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setCellphone(input);
    const valid = isEmailUser ? isValidCellphone(input) : isValidEmail(input);
    if (!valid) {
      setCellphoneError("El valor es invalido");
    } else {
      setCellphoneError("");
    }
  };

  const handleAddressLineChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setAddressLine(input);
    if (input.trim().length > 150) {
      setAddressLineError("Valor debe de tener menos de 150 carácteres");
    } else {
      setAddressLineError("");
    }
  };

  const handleSocialReasonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setSocialReason(input);
    if (input.trim().length > 70) {
      setSocialReasonError("Valor debe de tener menos de 70 carácteres");
    } else {
      setSocialReasonError("");
    }
  };

  const handleCupProfileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setCupProfile(input);
    if (Number.isNaN(input)) {
      setCupProfileError("El valor no es valido");
    } else {
      setCupProfileError("");
    }
  };

  const handleLongitudeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setLongitude(input);
    if (Number.isNaN(input)) {
      setLongitudeError("El valor no es valido");
    } else {
      setLongitudeError("");
    }
  };

  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLatitude(input);
    if (Number.isNaN(input)) {
      setLatitudeError("El valor no es valido");
    } else {
      setLatitudeError("");
    }
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setReview(input);
    if (input.trim().length > 700) {
      setReviewError("Valor debe de tener menos de 700 carácteres");
    } else {
      setReviewError("");
    }
  };

  const handleProductivesAreasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setProductiveAreas(input);
    if (input.trim().length > 300) {
      setProductiveAreasError("Valor debe de tener menos de 300 carácteres");
    } else {
      setProductiveAreasError("");
    }
  };

  const handleManagerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setManagerName(input);
    if (input.trim().length > 80) {
      setManagerNameError("Valor debe de tener menos de 80 carácteres");
    } else {
      setManagerNameError("");
    }
  };

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setWebsite(input);
    if (Number.isNaN(input)) {
      setWebsiteError("El valor no es valido");
    } else {
      setWebsiteError("");
    }
  };

  const handleNoPartnersMChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setNoPartnersM(input);
    if (Number.isNaN(input)) {
      setNoPartnersMError("El valor no es valido");
    } else {
      setNoPartnersMError("");
    }
  };

  const handleNoPartnersFChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    setNoPartnersF(input);
    if (input.trim().length > 120) {
      setNoPartnersFError("Valor debe de tener menos de 120 carácteres");
    } else {
      setNoPartnersFError("");
    }
  };

  const RenderForm = () => (
    <Form className="form">
      <Form.Group className="mb-3 input-group">
        <Col className="inputs" sm={12} md={12} lg={12}>
          <Col sm={12} md={4} lg={4}>
            <FormInput
              label="Correo electrónico o No. Celular"
              value={userName}
              placeholder="usuario@gmail.com"
              handleOnChange={handleUserInputChange}
              errorMsg={userNameError}
            />
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
            <FormInput
              label={isEmailUser ? "No. Celular" : "Correo Electrónico"}
              value={cellphone}
              placeholder={isEmailUser ? "99990000" : "usuario@gmail.com"}
              handleOnChange={handleCellphoneChange}
              errorMsg={cellphoneError}
            />
            <FormInput
              label="Dirección"
              value={addressLine}
              placeholder="Dirección"
              handleOnChange={handleAddressLineChange}
              errorMsg={addressLineError}
            />
            <FormInput
              label="Nombre del gerente"
              value={managerName}
              placeholder="Ingrese el nombre"
              handleOnChange={handleManagerNameChange}
              errorMsg={managerNameError}
            />
          </Col>
          <Col sm={12} md={4} lg={4}>
            <FormInput
              label="Promedio Perfil de Taza"
              value={cupProfile}
              placeholder="Promedio"
              handleOnChange={handleCupProfileChange}
              errorMsg={cupProfileError}
            />
            <div className="input-row">
              <FormInput
                label="Longitud"
                value={longitude}
                placeholder="Longitud"
                handleOnChange={handleLongitudeChange}
                errorMsg={longitudeError}
              />
              <FormInput
                label="Latitud"
                value={latitude}
                placeholder="Latitud"
                handleOnChange={handleLatitudeChange}
                errorMsg={latitudeError}
              />
            </div>
            <FormInput
              label="Nombre de la Empresa"
              value={socialReason}
              placeholder="Nombre"
              handleOnChange={handleSocialReasonChange}
              errorMsg={socialReasonError}
            />
            <div className="form-input">
              <Form.Label>Reseña</Form.Label>
              <Form.Control
                value={review}
                as="textarea"
                rows={4}
                placeholder="Ingrese la reseña"
                onChange={handleReviewChange}
              />
              {bioError !== "" && (
                <span className="error-message">{reviewError}</span>
              )}
            </div>
          </Col>
          <Col sm={12} md={4} lg={4}>
            <FormInput
              label="Áreas Productivas"
              value={productiveAreas}
              placeholder="areas"
              handleOnChange={handleProductivesAreasChange}
              errorMsg={productiveAreasError}
            />
            <MultipleValueTextInput
              onItemAdded={(item: any, allItems: Array<string>) => {
                console.log(item);
                setProducts(allItems);
              }}
              onItemDeleted={(item: any, allItems: Array<string>) => {
                console.log(item);
                setProducts(allItems);
              }}
              label="Productos o Servicios"
              name="social-networks"
              placeholder="Ingrese los productos"
            />
            <div className="input-row">
              <FormInput
                label="No. Socios Hombres"
                value={noPartnersM}
                placeholder="No. Socios Hombres"
                handleOnChange={handleNoPartnersMChange}
                errorMsg={noPartnersMError}
              />
              <FormInput
                label="No. Socios Mujeres"
                value={noPartnersF}
                placeholder="No. Socios Mujeres"
                handleOnChange={handleNoPartnersFChange}
                errorMsg={noPartnersFError}
              />
            </div>
            <FormInput
              label="Sitio Web"
              value={website}
              placeholder="www.misitio.com"
              handleOnChange={handleWebsiteChange}
              errorMsg={websiteError}
            />
            <MultipleValueTextInput
              onItemAdded={(item: any, allItems: Array<string>) => {
                console.log(item);
                setSocialNetworks(allItems);
              }}
              onItemDeleted={(item: any, allItems: Array<string>) => {
                console.log(item);
                setSocialNetworks(allItems);
              }}
              label="Redes Sociales"
              name="social-networks"
              placeholder="Ingrese las redes sociales"
            />
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

  const cardClassName = (): string => {
    if (activeTab === "farmer") {
      return !state.accountCreated ? "farmer-card" : "farmer-card-small";
    }
    return !state.accountCreated
      ? "cooperative-card"
      : "cooperative-card-small";
  };

  if (state.creatingAccount) {
    return <Loading label="Cargando..." />;
  }

  return (
    <div className="signup">
      <Card className={cardClassName()}>
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
                  <u>Regresar</u>
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
