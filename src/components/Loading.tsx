import React from "react";
import loading from "../assets/coffee-glass.png";
import "../styles/Loading.scss";

const Loading = () => (
  <div className="loading-wrapper">
    <img src={loading} alt="loading..." className="breathing-icon" />
    <h4>Cargando...</h4>
  </div>
);

export default Loading;