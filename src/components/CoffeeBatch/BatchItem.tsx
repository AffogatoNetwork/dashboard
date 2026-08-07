import React, { memo } from "react";
import QRCode from "react-qr-code";
import {CoffeeBatchType, PaginationType} from "../common/types";

type props = {
    index: number;
    coffeeBatch: CoffeeBatchType;
    pagination: PaginationType;
    showQrModal: (url: string) => void;
};

// ⚡ Bolt: Use React.memo to prevent unnecessary re-renders of list items.
// We lazily render the heavy <QRCode> component only when the row is visible,
// but keep the row in the DOM so HTML-to-Excel export tools can still read the text data.
const BatchItem = memo(({index, coffeeBatch, pagination, showQrModal}: props) => {
    const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);
    const isVisible = pagination.current === itemPage;
    const batchUrl = window.location.origin.concat("/batch/").concat(coffeeBatch.ipfsHash);

    const openInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <tr
            key={coffeeBatch.id}
            className={`${isVisible ? "show" : "hide"} flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 border-grey-light border-2`}
        >
            <td className="p-3 text-base font-light">
                <div className="qrcode">
                    <label htmlFor="coffe-batch" className="btn btn-ghost h-full"
                           onClick={() => {
                               showQrModal(batchUrl);
                           }}
                    >
                        {isVisible ? <QRCode value={batchUrl} size={90} /> : <div style={{ width: 90, height: 90 }} />}
                    </label>
                </div>
            </td>
            <td className="p-3 text-base font-light">
                {coffeeBatch.farm.name}</td>
            <td className="p-3 text-base font-light">


        <span>
          {coffeeBatch.farm.altitude}{" "}
            {coffeeBatch.farm.altitude === "-" ? "" : "MSNM"}
        </span>
            </td>
            <td className="p-3 text-base font-light">
                <div className="">
          <span>
            {coffeeBatch.farm.village}, {coffeeBatch.farm.region}
          </span>
                </div>
            </td>
            <td className="p-3 text-base font-light">
                <span>{coffeeBatch.wetMill.variety}</span>
            </td>
            <td className="p-3 text-base font-light">
                <span>{coffeeBatch.wetMill.process}</span>
            </td>
            <td className="p-3 text-base font-light">
                {coffeeBatch.wetMill.drying_id}</td>
            <td className="p-3 text-base font-light">
                <span>{coffeeBatch.wetMill.drying_type}</span>
            </td>
           
            <td className="p-3 text-base font-light">
                <span>{coffeeBatch.dryMill.weight}</span>
            </td>
            <td className="p-3 text-base font-light">
                <span>{coffeeBatch.dryMill.note}</span>
            </td>
        </tr>
    );
});

export default BatchItem;
