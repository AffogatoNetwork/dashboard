import React from "react";
import Image from "react-bootstrap/esm/Image";
import Logo from "../../assets/logo.png";
import Comsa from "../../assets/comsa.png";
import Commovel from "../../assets/commovel.png";
import Copranil from "../../assets/copranil.png";
import Proexo from "../../assets/proexo.png";

type props = {
  className: string;
};

const CoopLogo = ({ className }: props) => {
  const location = window.location.host;
  if (location.match("comsa") !== null) {
    return <Image className={className} src={Comsa} />;
  }
  if (location.match("commovel") !== null) {
    return <Image className={className} src={Commovel} />;
  }
  if (location.match("copranil") !== null) {
    return <Image className={className} src={Copranil} />;
  }
  if (location.match("proexo") !== null) {
    return <Image className={className} src={Proexo} />;
  }
  return <Image className="logo-affogato" src={Logo} />;
};

export default CoopLogo;
