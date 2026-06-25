import React from "react";
import { DefaultLanding } from "../DynamicLanding/DefaultLanding";
import { CommovelLanding } from "../DynamicLanding/CommovelLanding";
import { CopracnilLanding } from "../DynamicLanding/CopracnilLanding";
import { ComsaLanding } from "../DynamicLanding/ComsaLanding";
import { ProexoLanding } from "../DynamicLanding/ProexoLanding";
import { CafepsaLanding } from "../DynamicLanding/CafepsaLanding";
import { getCoopByHost } from "../../utils/utils";

const Landing = () => {
    const coop = getCoopByHost(window.location.host);

    if (coop === null) return <DefaultLanding />;

    switch (coop.name) {
        case 'COMMOVEL':  return <div className="rounded"><CommovelLanding /></div>;
        case 'COPRACNIL': return <CopracnilLanding />;
        case 'COMSA':     return <ComsaLanding />;
        case 'PROEXO':    return <ProexoLanding />;
        case 'CAFEPSA':   return <CafepsaLanding />;
        default:          return <DefaultLanding />;
    }
};

export default Landing;
