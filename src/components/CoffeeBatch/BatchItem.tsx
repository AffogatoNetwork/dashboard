import React from "react";
import QRCode from "react-qr-code";
import { CoffeeBatchType } from "../common/types";

type props = {
  index: number;
  coffeeBatch: CoffeeBatchType;
};

const BatchItem = ({ index, coffeeBatch }: props) => {
  const batchUrl = window.location.origin
    .concat("/batch/")
    .concat(coffeeBatch.ipfsHash);
  const sanitaze = (value: string): string => {
    if (typeof value !== "number") {
      if (value !== "undefined" && value.trim() === "") {
        return "-";
      }
    }
    return value;
  };

  const getAttribute = (type: string): string => {
    let attr = "-";
    for (let i = 0; i < coffeeBatch.attributes.length; i += 1) {
      const title = coffeeBatch.attributes[i].title.toLowerCase();
      if (title === type) {
        attr = sanitaze(coffeeBatch.attributes[i].value);
      }
    }
    return attr;
  };

  return (
    <tr key={coffeeBatch.id} className={index % 2 === 0 ? "even" : "odd"}>
      <td className="main">
        <div className="qrcode">
          <QRCode value={batchUrl} size={60} />
        </div>
        <div className="info">
          <div className="item">
            <span>{coffeeBatch.name}</span>
          </div>
          <div className="item">
            <span>{coffeeBatch.description}</span>
          </div>
        </div>
      </td>
      <td>
        <div className="location">
          <span className="village">{getAttribute("village")}</span>
          <span>
            {getAttribute("region")}, {getAttribute("country")}
          </span>
        </div>
      </td>
      <td className="batch">
        <span>{getAttribute("altitud")} m</span>
      </td>
      <td>
        <span>{getAttribute("variety")}</span>
      </td>
      <td>
        <span>{getAttribute("process")}</span>
      </td>
      <td>
        <span>{getAttribute("size")}</span>
      </td>
      <td className="cupprofile">
        <span>{coffeeBatch.cupProfile.aroma}</span>
      </td>
      <td>
        <span>{coffeeBatch.cupProfile.acidity}</span>
      </td>
      <td>
        <span>{coffeeBatch.cupProfile.body}</span>
      </td>
      <td>
        <span>{coffeeBatch.cupProfile.notes}</span>
      </td>
    </tr>
  );
};

export default BatchItem;
