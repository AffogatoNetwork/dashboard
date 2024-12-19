import { useTranslation } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { getAllFarmers } from '../../db/firebase';
import { SEARCH_DIVIDER } from '../../utils/constants';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MaterialReactTableProps,
} from 'material-react-table';
import Box from '@mui/material/Box';
import QRCode from 'react-qr-code';
import reactNodeToString from 'react-node-to-string';
import ReactHTMLTableToExcel from 'react-html-table-to-xlsx';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { LinkIcon } from '../icons/link';
import { MdDoneOutline } from 'react-icons/md';
export const CertificationsModule = () => {
  const saveSvgAsPng = require('save-svg-as-png');

  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
  const [farmersCount, setFarmersCount] = useState(0);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [Data, setData] = useState<any>([]);
  const [BlockchainUrl, setBlockchainUrl] = useState<string | null>(null);
  const [editingBehavior, setEditingBehavior] = useState<boolean>(false);

  const handleOnDownloadClick = () => {
    saveSvgAsPng.saveSvgAsPng(
      document.getElementById('qr-farmer'),
      'qr-farmer',
      {
        scale: 10,
        backgroundColor: 'white',
      },
    );
  };

  const openInNewTab = (url: string | null | undefined) => {
    const urlStr = url?.toString();
    window.open(urlStr, '_blank', 'noopener,noreferrer');
  };

  type FarmerType = {
    farmerId: string;
    femaleMenbers: number;
    maleMenbers: number;
    address: string;
    fullname: string;
    familyMembers: string;
    bio: string;
    area: number;
    usda: number;
    spp: number;
    roc: number;
    manosdemujer: number;
    fairtrade: number;
    country: string;
    gender: string;
    farm: string;
    location: string;
    region: string;
    village: string;
    village1: string;
    village2: string;
    qrCode: string;
    blockChainUrl: string;
    search: string;
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

      await getAllFarmers(companyName).then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const farmerData = result[i].data();
          const {
            farmerId,
            address,
            area,
            usda,
            spp,
            roc,
            manosdemujer,
            fairtrade,
            fullname,
            femaleMenbers,
            maleMenbers,
            bio,
            gender,
            farm,
            familyMembers,
            village,
            village1,
            village2,
            region,
            country,
          } = farmerData;
          const l = village
            .concat(', ')
            .concat(region)
            .concat(', ')
            .concat(country);
          const s = farmerId
            .concat(SEARCH_DIVIDER)
            .concat(fullname)
            .concat(SEARCH_DIVIDER)
            .concat(bio)
            .concat(SEARCH_DIVIDER)
            .concat(l);
          let qrCode = window.location.origin
            .concat('/farmer/')
            .concat(address);
          let blockChainUrl = 'https://affogato.mypinata.cloud/ipfs/' + farm;
          setBlockchainUrl(blockChainUrl);
          farmerList.push({
            farmerId,
            address,
            country,
            fullname,
            femaleMenbers,
            maleMenbers,
            familyMembers,
            bio,
            gender,
            farm,
            area,
            usda,
            spp,
            roc,
            manosdemujer,
            fairtrade,
            location: l,
            region,
            village,
            village1,
            village2,
            qrCode,
            blockChainUrl,
            search: s.toLowerCase(),
          });
        }
        setFarmers(farmerList);
        const itemsCount = farmerList.length;
        setFarmersCount(itemsCount);
      });
    };

    load();
  }, []);

  const [tableData, setTableData] = useState<any[]>(() => Data);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
      tableData[row.index] = values;
      //send/receive api updates here

      exitEditingMode(); //required to exit editing mode
    };

  const columData = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: t('tables.name-farmer'),
        accessorKey: 'fullname',
        Header: ({ column }) => (
          <div className="m-auto flex pt-12 align-bottom ">
            <h1 className="text-xl">
              <> {t('tables.name-farmer')}</>{' '}
            </h1>
          </div>
        ),
      },
      {
        accessorFn: (farm: any) => `${farm.area}`,
        id: 'area', //id is still required when using accessorFn instead of accessorKey
        header: t('tables.certified-area'),
        Header: ({ column }) => (
          <div className="m-auto flex pt-12 align-bottom ">
            <h1 className="text-xl">
              <> {t('tables.certified-area')}</>{' '}
            </h1>
          </div>
        ),
        size: 10,
        Cell(props) {
          return <div className="text-center">{props.renderedCellValue}</div>;
        },
      },
      {
        accessorFn: (row: { usda: any }) => `${row.usda} `, //accessorFn used to join multiple data into a single cell
        id: 'usda', //id is still required when using accessorFn instead of accessorKey
        header: 'USDA',
        Header: ({ column }) => (
          <div className="text-center">
            <img
              src={require('../../assets/certificaciones/1_USDA Organic.png')}
              className="h-24 w-24"
            />
            <h1 className="text-lg">USDA</h1>
            <h1 className="text-lg">Orgánico</h1>
          </div>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        // @ts-ignore
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.usda === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        accessorFn: (row: { fairtrade: any }) => `${row.fairtrade} `, //accessorFn used to join multiple data into a single cell
        id: 'fairtrade', //id is still required when using accessorFn instead of accessorKey
        header: 'fairtrade',
        Header: ({ column }) => (
          <>
            <div className="text-center">
              <img
                src={require('../../assets/certificaciones/2_Fair Trade.png')}
                className="h-24 w-24"
              />
              <h1 className="text-xl"> Comercio</h1>
              <h1 className="text-xl"> Justo</h1>
            </div>
          </>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.fairtrade === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        accessorFn: (row: { manosdemujer: any }) => `${row.manosdemujer} `, //accessorFn used to join multiple data into a single cell
        id: 'manosdemujer', //id is still required when using accessorFn instead of accessorKey
        header: 'Manos de Mujer',
        Header: ({ column }) => (
          <div className="text-center">
            <img
              src={require('../../assets/certificaciones/5_ConManosdeMujer.png')}
              className="h-24 w-24"
            />
            <h1 className="text-lg">Con Manos </h1>
            <h1 className="text-lg">de Mujer </h1>
          </div>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.manosdemujer === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
    ],
    [i18n.language],
  );

  return (
    <>
      <div className="">
        <div className=" mb-1 flex w-full flex-row justify-between sm:mb-0">
          <div className=" h-full w-full p-1">
            <div className="card bg-white shadow-xl">
              <div className="w-full rounded-lg p-5">
                <div className="text-center text-xl font-bold">
                  <>{t('certifications')}</>
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

                  <div className="overflow-auto ">
                    <MaterialReactTable
                      enableStickyHeader={true}
                      columns={columData}
                      onEditingRowSave={handleSaveRow}
                      data={farmers}
                      enableHiding={false}
                      enableDensityToggle={false}
                      sortDescFirst={true}
                      enableFullScreenToggle={false}
                      enableColumnActions={false}
                      enableFilters={true}
                      localization={MRT_Localization_ES}
                      initialState={{
                        sorting: [{ id: 'fullname', desc: false }],
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
