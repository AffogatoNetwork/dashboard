import React from "react";
import {HelmetProvider} from "react-helmet-async";
import { getCoopByHost } from "../../utils/utils";

function getFaviconEl() {
    return document.getElementById("favicon");
}

type HeaderConfig = { title: string; favicon: string };

const faviconMap: Record<string, HeaderConfig> = {
    COMMOVEL:  { title: 'Commovel',  favicon: 'https://commovel.affogato.co/static/media/commovel.12b48c26dec81fc092c8.png' },
    COPRACNIL: { title: 'Copracnil', favicon: 'https://copracnil.affogato.co/static/media/copracnil.b09051d39f351d475cf6.png' },
    COMSA:     { title: 'Comsa',     favicon: 'https://comsa.affogato.co/static/media/comsa.642c04d408113f3c4fb4.png' },
    PROEXO:    { title: 'Proexo',    favicon: 'https://proexo.affogato.co/static/media/proexo.398e15cc1775f3d21f97.png' },
    CAFEPSA:   { title: 'Cafepsa',   favicon: 'https://cafepsa.affogato.co/static/media/cafepsa.png' },
};

const defaultHeader: HeaderConfig = {
    title: 'Plataforma de Trazabilidad',
    favicon: 'https://affogato.co/logo.png',
};

const DynamicHeader = () => {
    const coop = getCoopByHost(window.location.host);
    const { title, favicon } = (coop && faviconMap[coop.name]) ? faviconMap[coop.name] : defaultHeader;

    const faviconEl = getFaviconEl();
    if (faviconEl) {
        // @ts-ignore
        faviconEl.href = favicon;
    }

    return (
        <HelmetProvider>
            <title>{title}</title>
            <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
        </HelmetProvider>
    );
};

export default DynamicHeader;
