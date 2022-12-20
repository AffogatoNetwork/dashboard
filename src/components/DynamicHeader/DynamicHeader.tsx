import React from "react";
import {HelmetProvider} from "react-helmet-async";
function getFaviconEl() {
    return document.getElementById("favicon");
}

const DynamicHeader = () => {
    const favicon = getFaviconEl();
    const location = window.location.host;

    if (location.match("commovel") !== null) {
        // @ts-ignore
        favicon.href = "../../assets/favicon/commovel.ico";
        return (<>
                <HelmetProvider>
                    <title> Commovel </title>
                    <link rel="icon" type="image/png" href="../../assets/favicon/commovel.ico" sizes="16x16" />
                </HelmetProvider>
            </>
        );
    }
    if (location.match("copranil") !== null) {
        // @ts-ignore
        favicon.href = "../../assets/favicon/copranil.ico";
        return (<>
                <HelmetProvider>
                    <title> Copranil </title>
                    <link rel="icon" type="image/png" href="../../assets/favicon/copranil.ico" sizes="16x16" />
                </HelmetProvider>
            </>
        );    }
    if (location.match("comsa") !== null) {
        // @ts-ignore
        favicon.href = "../../assets/favicon/comsa.ico";
        return (<>
                <HelmetProvider>
                    <title> Comsa </title>
                    <link rel="icon" type="image/png" href="../../assets/favicon/comsa.ico" sizes="16x16" />
                </HelmetProvider>
            </>
        );    }
    if (location.match("proexo") !== null) {
        // @ts-ignore
        favicon.href = "../../assets/favicon/proexo.ico";
        return (<>
                <HelmetProvider>
                    <title> Proexo </title>
                    <link rel="icon" type="image/png" href="../../assets/favicon/proexo.ico" sizes="16x16" />
                </HelmetProvider>
            </>
        );
    } else {
        // @ts-ignore
        favicon.href = "../../assets/favicon/default.ico";
        return (<>
                <HelmetProvider>
                    <title> Plataforma de trazabilidad </title>
                    <link rel="icon" type="image/png" href="../../assets/favicon/default.ico" sizes="16x16" />
                </HelmetProvider>
            </>
        );
    }

};
export default DynamicHeader;
