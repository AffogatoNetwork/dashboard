import React from 'react'
import {GoogleMap, useJsApiLoader, MarkerF} from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

type props = {
    latitude: string;
    longitude: string;
    zoomLevel: number;
    addressLine: string;
    className: string;
}

const NewMap = ({
  latitude,
  longitude,
  zoomLevel,
  addressLine,
}: props) => {
    const location = {
        lng: parseFloat(longitude),
        lat: parseFloat(latitude),
    };
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
    });
    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(location);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    return isLoaded ? (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={zoomLevel}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                <MarkerF position={location}/>
            </GoogleMap>
    ): <></>
};

export default NewMap
