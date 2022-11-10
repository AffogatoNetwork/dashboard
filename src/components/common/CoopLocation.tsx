import React from "react";

type props = {
    className: string;
};

const CoopLocation = ({ className }: props) => {
    const location = window.location.host;
    if (location.match("affogato") !== null) {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Commovel%20Aldea%20San%20Luis,%20Planes,%20Sta.%20B%C3%A1rbara+(COMMOVEL)&amp;t=k&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    }
    if (location.match("comsa") !== null) {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}   src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=COMSA%20-%20Caf%C3%A9%20Org%C3%A1nico%20Marcala,%20Marcala+(COMSA%20-%20Caf%C3%A9%20Org%C3%A1nico%20Marcala,%20Marcala)&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    }
    if (location.match("commovel") !== null) {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}   src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Commovel%20Aldea%20San%20Luis,%20Planes,%20Sta.%20B%C3%A1rbara+(COMMOVEL)&amp;t=k&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    }
    if (location.match("copranil") !== null) {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}   src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=COPRANIL,%20Corqu%C3%ADn+(COPRANIL,%20Corqu%C3%ADn)&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    }
    if (location.match("proexo") !== null) {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=PROEXO,%20Corqu%C3%ADn+(PROEXO,%20Corqu%C3%ADn)&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    } else {
        return <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=COPRANIL,%20Corqu%C3%ADn+(COPRANIL,%20Corqu%C3%ADn)&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>
    }
    
};

export default CoopLocation;


