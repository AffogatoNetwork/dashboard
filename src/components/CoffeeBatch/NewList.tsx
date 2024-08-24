import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import { getAllBatches, updateAllBatches } from '../../db/firebase';
import { SEARCH_DIVIDER } from '../../utils/constants';
import Box from '@mui/material/Box';
import QRCode from 'react-qr-code';
import { LinkIcon } from '../icons/link';
import { useTranslation } from 'react-i18next';
import reactNodeToString from 'react-node-to-string';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { FarmerData } from '../FarmerData';
import Company from '../Company';

export const CoffeBatchNewList = () => {
  const saveSvgAsPng = require('save-svg-as-png');

  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
  const [farmersCount, setFarmersCount] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [Data, setData] = useState<any>([]);
  const [BlockchainUrl, setBlockchainUrl] = useState<any>(null);

  const [farmName, setfarmName] = useState('');

  const handleOnDownloadClick = () => {
    saveSvgAsPng.saveSvgAsPng(
      document.getElementById('qr-farmer'),
      'qr-farmer',
      {
        scale: 10,
        backgroundColor: 'white',
      }
    );
  };

  const openInNewTab = (url: string | null | undefined) => {
    const urlStr = url?.toString();
    window.open(urlStr, '_blank', 'noopener,noreferrer');
  };

  const openData = (url: string | null | undefined) => {
    const link = window.location.host.toString() + '/newbatch/';
    const urlStr = url?.toString();

    let result = Data.replace(link, '');
    let cleaned = result.replace('http://', ''); // remove space from the end of the string
    let cleaned2 = cleaned.replace('https://', ''); // remove space from the end of the string

    let companyName = '';
    if (link.match('commovel') !== null) {
      companyName = 'COMMOVEL';
    }
    if (link.match('copracnil') !== null) {
      companyName = 'COPRACNIL';
    }
    if (link.match('comsa') !== null) {
      companyName = 'COMSA';
    }
    if (link.match('proexo') !== null) {
      companyName = 'PROEXO';
    }
    if (link.match('cafepsa') !== null) {
      companyName = 'CAFEPSA';
    }
    if (link.match('localhost') !== null) {
      companyName = 'PROEXO';
    }

    if (companyName === 'PROEXO') {
      window.open(
        'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/' +
          cleaned2.trim() +
          '.json?alt=media&token=10ee7b3b-e0cd-4a52-8689-9b867c3f9f91',
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      window.open(
        'https://affogato.mypinata.cloud/ipfs/' + cleaned2.trim(),
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  type FarmerType = {
    qrCode: string;
    Name: string;
    ipfsHash: string;
    parentId: string;
    dryMill: {};
    wetMill: {};
    Profile: {};
    Roasting: {};
  };

  useEffect(() => {
    const load = async () => {
      const farmerList = new Array<FarmerType>();
      const user = localStorage.getItem('address');
      if (user !== '') {
        setOwnerAddress(user);
        setLoading(false);
      } else {
      }

      let companyName = '';
      const url = window.location.host.toString();
      if (url.match('commovel') !== null) {
        companyName = 'COMMOVEL';
      }
      if (url.match('copracnil') !== null) {
        companyName = 'COPRACNIL';
      }
      if (url.match('comsa') !== null) {
        companyName = 'COMSA';
      }
      if (url.match('proexo') !== null) {
        companyName = 'PROEXO';
      }
      if (url.match('cafepsa') !== null) {
        companyName = 'CAFEPSA';
      }
      if (url.match('localhost') !== null) {
        companyName = 'PROEXO';
      }

      await getAllBatches(companyName).then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const farmerData = result[i].data();
          const {
            Name = '',
            parentId,
            ipfsHash,
            dryMill = {},
            wetMill = {},
            Profile = {},
            Roasting = {},
          } = farmerData;

          let qrCode = window.location.origin
            .concat('/newbatch/')
            .concat(ipfsHash);

          if (companyName === 'PROEXO') {
            let blockChainUrl =
              'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/' +
              ipfsHash +
              '.json?alt=media&token=10ee7b3b-e0cd-4a52-8689-9b867c3f9f91';
            setBlockchainUrl(blockChainUrl);
          } else {
            let blockChainUrl =
              'https://affogato.mypinata.cloud/ipfs/' + ipfsHash;
            setBlockchainUrl(blockChainUrl);
          }

          farmerList.push({
            qrCode,
            Name,
            parentId,
            ipfsHash,
            dryMill,
            wetMill,
            Profile,
            Roasting,
          });
        }

        setFarmers(farmerList);
        const itemsCount = farmerList.length;
        setFarmersCount(itemsCount);
      });
    };

    load();
  }, []);

  const columData = useMemo<MRT_ColumnDef<FarmerType>[]>(
    () => [
      {
        accessorFn: (row: { qrCode: any }) => `${row.qrCode} `, //accessorFn used to join multiple data into a single cell
        id: 'qrCode', //id is still required when using accessorFn instead of accessorKey
        header: t('tables.qr'),
        size: 50,
        enableSorting: false,
        enableColumnFilter: false,
        // @ts-ignore
        Cell: ({ renderedCellValue }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <label
                htmlFor="farmerlist"
                className="btn-ghost btn h-full"
                onClick={() => {
                  setData(renderedCellValue);
                }}
              >
                <QRCode
                  value={reactNodeToString(renderedCellValue)}
                  size={90}
                />
              </label>
            </Box>
          </>
        ),
      },
      {
        accessorFn: (farmers: any) =>
          `${farmers.Name}  ${farmers.parentId},  ${farmers.ipfsHash.substring(
            0,
            6
          )} `, //accessorFn used to join multiple data into a single cell
        header: t('tables.name'),
        size: 25,
        Cell(props) {
          return <div className="text-left">{props.renderedCellValue}</div>;
        },
      },
      {
        accessorFn: (farmers: any) => `${farmers.dryMill.average_height}`, //accessorFn used to join multiple data into a single cell
        header: t('height'),
        size: 15,
        Cell(props) {
          if (props.renderedCellValue === 'undefined') {
            return <div className="text-left">{'Aprox 1200'}</div>;
          }
          return (
            <div className="text-left">
              {props.renderedCellValue || 'Aprox 1200'}
            </div>
          );
        },
      },
      {
        header: t('tables.height'),
        accessorKey: 'wetMill.variety',
        size: 15,
      },
      {
        header: t('tables.process'),
        accessorKey: 'wetMill.process',
        size: 15,
      },
      {
        header: t('tables.type-drying'),
        accessorKey: 'wetMill.drying_type',
        size: 15,
      },
      {
        header: t('tables.weight'),
        accessorKey: 'dryMill.weight',
        size: 15,
      },
      {
        accessorFn: (farmers: any) => `${farmers.dryMill.note}`, //accessorFn used to join multiple data into a single cell
        header: t('tables.note'),
        size: 15,
        Cell(props) {
          if (props.renderedCellValue === '0') {
            return <div className="text-left">{'Mayor 80'}</div>;
          }
          return <div className="text-left">{props.renderedCellValue}</div>;
        },
      },
    ],
    [i18n.language]
  );

  return (
    <>
      <div className="">
        <div className=" mb-1 flex w-full flex-row justify-between sm:mb-0">
          <div className=" h-full w-full p-1">
            <div className="card bg-white shadow-xl">
              <div className="w-full rounded-lg p-5">
                <div className="text-center text-xl font-bold">
                  <>{t('search-batches')}</>
                </div>
              </div>
              <div className="m-6">
                <div className="card-title grid justify-items-stretch">
                  <div className="justify-self-end">
                    <h4>
                      <>
                        {t('total')}: {farmersCount}
                      </>
                    </h4>
                    {ownerAddress ? (
                      <a className="link-info link">
                        <ReactHTMLTableToExcel
                          id="table-xls-button"
                          className="download-xls-button"
                          table="farmers-list"
                          filename={t('farmers')}
                          sheet={t('farmers')}
                          buttonText={'('.concat(t('download')).concat(')')}
                        />
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="overflow-auto">
                    <MaterialReactTable
                      columns={columData}
                      data={farmers}
                      enableHiding={false}
                      enableDensityToggle={false}
                      sortDescFirst={true}
                      enableFullScreenToggle={false}
                      enableColumnActions={false}
                      enableFilters={true}
                      localization={MRT_Localization_ES}
                      displayColumnDefOptions={{
                        'mrt-row-numbers': {
                          size: 10,
                        },
                        'mrt-row-expand': {
                          size: 10,
                        },
                      }}
                      initialState={{
                        sorting: [{ id: 'Name', desc: false }],
                        showGlobalFilter: true,
                        isLoading: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="m-4">
        <input type="checkbox" id="farmerlist" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <label
              htmlFor="farmerlist"
              className="btn-sm btn-circle btn absolute right-2 top-2 bg-red-500 text-white hover:bg-red-700"
            >
              ✕
            </label>
            <div className="m-6 flex justify-center">
              <div>
                <QRCode value={Data} size={300} id="qr-farmer" />
                <div className="flex place-content-center space-x-4 pt-8">
                  <div>
                    <button
                      className="inline-flex items-center rounded bg-gray-300 py-2 px-4 font-bold text-gray-800 hover:bg-gray-400"
                      onClick={handleOnDownloadClick}
                    >
                      <svg
                        className="mr-2 h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <>{t('download')}</>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        openInNewTab(Data);
                      }}
                      className="inline-flex items-center rounded bg-blue-300 py-2 px-4 font-bold text-white hover:bg-blue-400"
                    >
                      <LinkIcon></LinkIcon>
                      <>{t('open-link')}</>
                    </button>
                  </div>
                </div>
                <div className="items-center text-center">
                  <br />
                  <button
                    onClick={() => {
                      openData(Data);
                    }}
                    className="inline-flex items-center rounded bg-black py-2 px-4 font-bold text-white  hover:bg-slate-600"
                  >
                    <LinkIcon></LinkIcon>
                    <>Ver en el blockchain</>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
