import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { DE, ES, US, FR } from "country-flag-icons/react/3x2";

type props = {
  type: string;
};

const FlagComponent = ({ type }: props) => {
  if (type === "es") {
    return <ES title="Español" className="lang-flag" />;
  }
  if (type === "de") {
    return <DE title="Deutsch" className="lang-flag" />;
  }
  if (type === "de") {
    return <FR title="Français" className="lang-flag" />;
  }

  return <US title="English" className="lang-flag" />;
};

const LangChooser = ({ type }: props) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("affogato-lang", lang);
  };

  const handleOnSelect = (eventKey: any, event: Object) => {
    console.log(event);
    changeLanguage(eventKey);
    setCurrentLang(eventKey);
  };

  const LangDropDown = () => (
    <Dropdown onSelect={handleOnSelect} className="lang-dropdown">
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        <FlagComponent type={currentLang} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="es">Español</Dropdown.Item>
        <Dropdown.Item eventKey="en">English</Dropdown.Item>
        <Dropdown.Item eventKey="de">Deutsch</Dropdown.Item>
        <Dropdown.Item eventKey="fr">Français</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const LangBar = () => (
    <div className="lang-container">
      <Button className="btn-flag" onClick={() => changeLanguage("es")}>
        <ES title="Español" className="lang-flag" />
      </Button>
      <Button className="btn-flag" onClick={() => changeLanguage("en")}>
        <US title="English" className="lang-flag" />
      </Button>
      <Button className="btn-flag" onClick={() => changeLanguage("de")}>
        <DE title="Deutsch" className="lang-flag" />
      </Button>
      <Button className="btn-flag" onClick={() => changeLanguage("fr")}>
        <FR title="Français" className="lang-flag" />
      </Button>
    </div>
  );

  return <>{type === "dropdown" ? LangDropDown() : LangBar()}</>;
};

export default LangChooser;
