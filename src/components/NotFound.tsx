import React from "react";
import empty from "../assets/coffee-glass-empty.png";
import "../styles/Loading.scss";

type props = {
  msg: string;
};

const NotFound = ({ msg }: props) => (
  <div className="loading-wrapper">
    <img src={empty} alt="Empty..." className="shaking-icon" />
    <h4>{msg}</h4>
  </div>
);

export default NotFound;
