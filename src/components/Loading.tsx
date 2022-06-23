import React from "react";
import loading from "../assets/coffee-glass.png";
import "../styles/Loading.scss";

type props = {
  label: string;
  className: string;
};

const Loading = ({ label, className }: props) => (
  <div className={className}>
    <img src={loading} alt="loading..." className="breathing-icon" />
    <h4>{label}</h4>
  </div>
);

export default Loading;
