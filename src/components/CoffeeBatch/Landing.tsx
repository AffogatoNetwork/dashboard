import React, {useEffect} from "react";
import {DefaultLanding} from "../DynamicLanding/DefaultLanding";
import {CommovelLanding} from "../DynamicLanding/CommovelLanding";
import {CopranilLanding} from "../DynamicLanding/CopranilLanding";
import {ComsaLanding} from "../DynamicLanding/ComsaLanding";
import {ProexoLanding} from "../DynamicLanding/ProexoLanding";

const Landing = () => {
    const location = window.location.host;

    if (location.match("commovel") !== null) {
            return (<>
                    <CommovelLanding></CommovelLanding>
                </>
            );
        }
        if (location.match("copranil") !== null) {
            return (<>
                    <CopranilLanding></CopranilLanding>
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
            return (
                <>
                    <DefaultLanding></DefaultLanding>
                </>
            );

    };

export default Landing;
