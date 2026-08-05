import React from 'react';
import QRCode from 'react-qr-code';
import { CoffeeBatchType, PaginationType } from '../common/types';

type props = {
  index: number;
  coffeeBatch: CoffeeBatchType;
  pagination: PaginationType;
  showQrModal: (url: string) => void;
};

const BatchItem = ({ index, coffeeBatch, pagination, showQrModal }: props) => {
  const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);
  const isVisible = pagination.current === itemPage;
  const batchUrl = window.location.origin
    .concat('/batch/')
    .concat(coffeeBatch.ipfsHash);

  const openInNewTab = (url: string | URL | undefined) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <tr
      key={coffeeBatch.id}
      className={`${isVisible ? 'show' : 'hide'} flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 border-grey-light border-2`}
    >
      <td className="p-3 text-base font-light">
        <div className="qrcode">
          <label
            htmlFor="coffe-batch"
            className="btn btn-ghost h-full"
            onClick={() => {
              showQrModal(batchUrl);
            }}
          >
            {isVisible && <QRCode value={batchUrl} size={90} />}
          </label>
        </div>
      </td>
      <td className="p-3 text-base font-light">{coffeeBatch.farm.name}</td>
      <td className="p-3 text-base font-light">
        <span>
          {coffeeBatch.farm.altitude}{' '}
          {coffeeBatch.farm.altitude === '-' ? '' : 'MSNM'}
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
        {coffeeBatch.wetMill.drying_id}
      </td>
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
};

export default React.memo(BatchItem, (prevProps, nextProps) => {
  // Check if visibility changed
  const prevItemPage = Math.ceil(
    (prevProps.index + 1) / prevProps.pagination.itemsPerPage,
  );
  const nextItemPage = Math.ceil(
    (nextProps.index + 1) / nextProps.pagination.itemsPerPage,
  );
  const wasVisible = prevProps.pagination.current === prevItemPage;
  const isVisible = nextProps.pagination.current === nextItemPage;

  // Re-render if visibility changed
  if (wasVisible !== isVisible) {
    return false;
  }

  // If the item remains hidden, it doesn't need to re-render.
  // (We skip re-rendering hidden items to improve pagination performance while keeping them in the DOM for HTML-to-Excel)
  if (!isVisible) {
    return true; // Skip re-render
  }

  // If the item is visible, fall back to standard shallow equality check for the props.
  return (
    prevProps.coffeeBatch.id === nextProps.coffeeBatch.id &&
    prevProps.index === nextProps.index &&
    prevProps.showQrModal === nextProps.showQrModal
  );
});
