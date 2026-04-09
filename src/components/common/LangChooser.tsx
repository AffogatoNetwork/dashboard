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
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("affogato-lang") || "es");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("affogato-lang", lang);
    setCurrentLang(lang);
  };

  const handleOnSelect = (eventKey: any, event: Object) => {
    changeLanguage(eventKey);
    setCurrentLang(eventKey);
  };


  const LangBar = () => (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-white/80 backdrop-blur-md shadow-xl rounded-full p-1 border border-white/40 gap-1">
      <button 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentLang === 'es' ? 'bg-amber-100' : 'hover:bg-gray-100/50'}`} 
        onClick={() => changeLanguage("es")}
      >
        <ES title="Español" className="w-6 rounded-sm shadow-sm" />
      </button>
      <button 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentLang === 'en' ? 'bg-amber-100' : 'hover:bg-gray-100/50'}`} 
        onClick={() => changeLanguage("en")}
      >
        <US title="English" className="w-6 rounded-sm shadow-sm" />
      </button>
      <button 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentLang === 'de' ? 'bg-amber-100' : 'hover:bg-gray-100/50'}`} 
        onClick={() => changeLanguage("de")}
      >
        <DE title="Deutsch" className="w-6 rounded-sm shadow-sm" />
      </button>
      <button 
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentLang === 'fr' ? 'bg-amber-100' : 'hover:bg-gray-100/50'}`} 
        onClick={() => changeLanguage("fr")}
      >
        <FR title="Français" className="w-6 rounded-sm shadow-sm" />
      </button>
    </div>
  );

  return <>{LangBar()}</>;
};

export default LangChooser;
