import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import GoogleMapReact from "google-map-react";
import "../../styles/app.scss";

type props = {
  latitude: string;
  longitude: string;
  zoomLevel: number;
  addressLine: string;
  className: string;
};

const Map = ({
  latitude,
  longitude,
  zoomLevel,
  addressLine,
  className,
}: props) => {
  const location = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };

  return (
    <div className="map">
      <div className={className}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
          defaultCenter={location}
          defaultZoom={zoomLevel}
        >
          <div className="pin">
            <FaMapMarkerAlt className="pin-icon" size={30} />
            <p className="pin-text">{addressLine}</p>
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default Map;
