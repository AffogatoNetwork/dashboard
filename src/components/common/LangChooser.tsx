import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DE, ES, US, FR } from "country-flag-icons/react/3x2";
import { Helmet } from "react-helmet-async";

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
      <Helmet htmlAttributes={{ lang : 'es' }}/>
        <ES title="Español" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("en")}>
      <Helmet htmlAttributes={{ lang : 'en' }}/>
        <US title="English" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("de")}>
      <Helmet htmlAttributes={{ lang : 'de' }}/>
        <DE title="Deutsch" className="lang-flag" />
      </button>
      <button className="w-12 px-2 btn btn-ghost" onClick={() => changeLanguage("fr")}>
      <Helmet htmlAttributes={{ lang : 'fr' }}/>
        <FR title="Français" className="lang-flag" />
      </button>
    </div>
  );

  return <>{LangBar()}</>;
};

export default LangChooser;
