import React from "react";
import Modal from "react-bootstrap/esm/Modal";
import Map from "./Map";
import NewMap from "./NewMap";

type props = {
  latitude: string;
  longitude: string;
  addressLine: string;
  show: boolean;
  onHide: () => void;
};

const MapModal = ({
  latitude,
  longitude,
  addressLine,
  show,
  onHide,
}: props) => (
  <Modal
    show={show}
    size="lg"
    className="map-modal"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    onHide={onHide}
  >
    <Modal.Body className="">
      <NewMap
        latitude={latitude}
        longitude={longitude}
        zoomLevel={10}
        addressLine={addressLine}
        className="google-map large"
      />
    </Modal.Body>
  </Modal>
);

export default MapModal;
