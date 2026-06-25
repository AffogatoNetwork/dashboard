import React from "react";
import Image from "react-bootstrap/esm/Image";
import Logo from "../../assets/logo.png";
import Comsa from "../../assets/comsa.png";
import Commovel from "../../assets/commovel.png";
import Copranil from "../../assets/copracnil.png";
import Proexo from "../../assets/proexo.png";
import Cafepsa from "../../assets/cafepsa.png";
import { getCoopByHost } from "../../utils/utils";

type props = {
  className: string;
};

const logoMap: Record<string, string> = {
  COMSA: Comsa,
  COMMOVEL: Commovel,
  COPRACNIL: Copranil,
  PROEXO: Proexo,
  CAFEPSA: Cafepsa,
};

const CoopLogo = ({ className }: props) => {
  const coop = getCoopByHost(window.location.host);
  if (coop && logoMap[coop.name]) {
    return <Image className={className} src={logoMap[coop.name]} />;
  }
  return <Image className="logo-affogato" src={Logo} />;
};

export default CoopLogo;
