import React from "react";
import loading from "../assets/coffee-glass.png";
import "../styles/Loading.scss";

type props = {
  label: string;
};

const Loading = ({ label }: props) => (
  <div className="loading-wrapper">
    <img src={loading} alt="loading..." className="breathing-icon" />
    <h4>{label}</h4>
  </div>
);

export default Loading;
