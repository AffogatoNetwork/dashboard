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
        favicon.href = 'https://commovel.affogato.co/static/media/commovel.12b48c26dec81fc092c8.png';
        return (<>
                <HelmetProvider>
                    <title> Commovel </title>
                    <link rel="icon" type="image/png" href='https://commovel.affogato.co/static/media/commovel.12b48c26dec81fc092c8.png' sizes="16x16" />
                </HelmetProvider>
            </>
        );
    }
    if (location.match("copracnil") !== null) {
        // @ts-ignore
        favicon.href = 'https://copracnil.affogato.co/static/media/copracnil.b09051d39f351d475cf6.png';
        return (<>
                <HelmetProvider>
                    <title> Copracnil </title>
                    <link rel="icon" type="image/png" href='https://copracnil.affogato.co/static/media/copracnil.b09051d39f351d475cf6.png' sizes="16x16" />
                </HelmetProvider>
            </>
        );    }
    if (location.match("comsa") !== null) {
        // @ts-ignore
        favicon.href = 'https://comsa.affogato.co/static/media/comsa.642c04d408113f3c4fb4.png';
        return (<>
                <HelmetProvider>
                    <title> Comsa </title>
                    <link rel="icon" type="image/png" href='https://comsa.affogato.co/static/media/comsa.642c04d408113f3c4fb4.png' sizes="16x16" />
                </HelmetProvider>
            </>
        );    }
    if (location.match("proexo") !== null) {
        // @ts-ignore
        favicon.href = 'https://proexo.affogato.co/static/media/proexo.398e15cc1775f3d21f97.png';
        return (<>
                <HelmetProvider>
                    <title> Proexo </title>
                    <link rel="icon" type="image/png" href='https://proexo.affogato.co/static/media/proexo.398e15cc1775f3d21f97.png' sizes="16x16" />
                </HelmetProvider>
            </>
        );
    } else {
        // @ts-ignore
        favicon.href = 'https://affogato.co/logo.png';
        return (<>
                <HelmetProvider>
                    <title> Plataforma de trazabilidad </title>
                    <link rel="icon" type="image/png" href='https://affogato.co/logo.png' sizes="16x16" />
                </HelmetProvider>
            </>
        );
    }

};
export default DynamicHeader;
