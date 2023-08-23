import React from "react";
import { DefaultLanding } from "../DynamicLanding/DefaultLanding";
import { CommovelLanding } from "../DynamicLanding/CommovelLanding";
import { CopracnilLanding } from "../DynamicLanding/CopracnilLanding";
import { ComsaLanding } from "../DynamicLanding/ComsaLanding";
import { ProexoLanding } from "../DynamicLanding/ProexoLanding";
import { CafepsaLanding } from "../DynamicLanding/CafepsaLanding";

const Landing = () => {
    const location = window.location.host;

    if (location.match("commovel") !== null) {
        return (<>
            <div className="rounded">
                <CommovelLanding></CommovelLanding>
            </div>
        </>
        );
    }
    if (location.match("copracnil") !== null) {
        return (<>
            <CopracnilLanding></CopracnilLanding>
        </>
        );
    }
    if (location.match("comsa") !== null) {
        return (<>
            <ComsaLanding></ComsaLanding>
        </>
        );
    }
    if (location.match("proexo") !== null) {
        return (<>
            <ProexoLanding></ProexoLanding>
        </>
        );
    }
    if (location.match("cafepsa") !== null) {
        return (<>
            <CafepsaLanding/>
        </>
        );
    }



    return (
        <>
            <CafepsaLanding />
        </>
    );

};

export default Landing;
