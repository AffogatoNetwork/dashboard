import React from "react";
import Image from "react-bootstrap/esm/Image";
import Logo from "../../assets/logo.png";
import Comsa from "../../assets/comsa.png";
import Commovel from "../../assets/commovel.png";
import Copranil from "../../assets/copracnil.png";
import Proexo from "../../assets/proexo.png";
import Cafepsa from "../../assets/cafepsa.jpeg";

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
  if (location.match("copracnil") !== null) {
    return <Image className={className} src={Copranil} />;
  }
  if (location.match("proexo") !== null) {
    return <Image className={className} src={Proexo} />;
  }
  if (location.match("cafepsa") !== null) {
    return <Image className={className} src={Cafepsa} />;
  }

  return <Image className="logo-affogato" src={Logo} />;
};

export default CoopLogo;
