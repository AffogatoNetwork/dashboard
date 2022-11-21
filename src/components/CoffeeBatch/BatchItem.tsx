import React from "react";
import Button from "react-bootstrap/esm/Button";
import QRCode from "react-qr-code";
import { CoffeeBatchType, PaginationType } from "../common/types";

type props = {
  index: number;
  coffeeBatch: CoffeeBatchType;
  pagination: PaginationType;
  showQrModal: (url: string) => void;
};

const BatchItem = ({ index, coffeeBatch, pagination, showQrModal }: props) => {
  const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);
  const batchUrl = window.location.origin
    .concat("/batch/")
    .concat(coffeeBatch.ipfsHash);

  return (
    <tr
      key={coffeeBatch.id}
      className={pagination.current === itemPage ? "show" : "hide"}
    >
      <td className="main">
        <div className="qrcode">
          <label htmlFor="coffe-batch" className="btn btn-ghost h-full"
                 onClick={() => {
                   showQrModal(batchUrl);
                 }}
          >
            <QRCode value={batchUrl} size={60} />
          </label>
        </div>
      </td>
      <td>{coffeeBatch.farm.name}</td>
      <td className="">
        <span>
          {coffeeBatch.farm.altitude}{" "}
          {coffeeBatch.farm.altitude === "-" ? "" : "MSNM"}
        </span>
      </td>
      <td>
        <div className="">
          <span>
            {coffeeBatch.farm.village}, {coffeeBatch.farm.region}
          </span>
        </div>
      </td>
      <td className="">
        <span>{coffeeBatch.wetMill.variety}</span>
      </td>
      <td>
        <span>{coffeeBatch.wetMill.process}</span>
      </td>
      <td className="">{coffeeBatch.wetMill.drying_id}</td>
      <td>
        <span>{coffeeBatch.wetMill.drying_type}</span>
      </td>
      <td className="">
        <span>{coffeeBatch.dryMill.export_id}</span>
      </td>
      <td>
        <span>{coffeeBatch.dryMill.weight}</span>
      </td>
      <td>
        <span>{coffeeBatch.dryMill.note}</span>
      </td>
    </tr>
  );
};

export default BatchItem;
