import React, { useState } from "react";
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
  if (type === "fr") {
    return <FR title="Français" className="lang-flag" />;
  }

  return <US title="English" className="lang-flag" />;
};

const LangChooser = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("affogato-lang", lang);
  };

  const handleOnSelect = (eventKey: any, event: Object) => {
    changeLanguage(eventKey);
    setCurrentLang(eventKey);
  };


  const LangBar = () => (
    <div className="lang-container">
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("es")}>
        <ES title="Español" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("en")}>
        <US title="English" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("de")}>
        <DE title="Deutsch" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("fr")}>
        <FR title="Français" className="lang-flag" />
      </button>
    </div>
  );

  return <>{LangBar()}</>;
};

export default LangChooser;
