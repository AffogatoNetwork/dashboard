import React, { lazy, Suspense } from "react";
import { LandingSkeleton } from "../DynamicLanding/LandingSkeleton";
import { getCoopByHost } from "../../utils/utils";

const DefaultLanding  = lazy(() => import("../DynamicLanding/DefaultLanding").then(m => ({ default: m.DefaultLanding })));
const CommovelLanding = lazy(() => import("../DynamicLanding/CommovelLanding").then(m => ({ default: m.CommovelLanding })));
const CopracnilLanding = lazy(() => import("../DynamicLanding/CopracnilLanding").then(m => ({ default: m.CopracnilLanding })));
const ComsaLanding    = lazy(() => import("../DynamicLanding/ComsaLanding").then(m => ({ default: m.ComsaLanding })));
const ProexoLanding   = lazy(() => import("../DynamicLanding/ProexoLanding").then(m => ({ default: m.ProexoLanding })));
const CafepsaLanding  = lazy(() => import("../DynamicLanding/CafepsaLanding").then(m => ({ default: m.CafepsaLanding })));

const LandingContent = () => {
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

const Landing = () => (
    <Suspense fallback={<LandingSkeleton />}>
        <LandingContent />
    </Suspense>
);

export default Landing;
