import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable, { MRT_ColumnDef, MaterialReactTableProps } from "material-react-table";
import {getAllFarmers, getCafepsaJsonUrl , UserData} from "../../db/firebase";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import { LinkIcon } from "../icons/link";
import { useTranslation } from "react-i18next";
import reactNodeToString from "react-node-to-string"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import NewMap from "../common/NewMap";
import {useParams} from "react-router";

export const FarmsModule = () => {
    const saveSvgAsPng = require("save-svg-as-png");

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [Data, setData] = useState<any>([]);
    const [BlockchainUrl, setBlockchainUrl] = useState<string >('');


    const [currentLat, setCurrentLat] = useState("0");
    const [currentLng, setCurrentLng] = useState("0");
    const [currentAddressL, setCurrentAddressL] = useState("");

    const [links, setlInks] = useState("https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FIMG_1718.jpeg?alt=media&token=c37a0d05-a8dc-4cfd-b3c1-fcc0502dcd77");
    const { currentFarmerId } = useParams();
    const [editingBehavior, setEditingBehavior] = useState<boolean>(false);

    const handleOnDownloadClick = () => {
        saveSvgAsPng.saveSvgAsPng(
            document.getElementById("qr-farmer"),
            "qr-farmer",
            {
                scale: 10,
                backgroundColor: 'white',
            }
        );
    };

    const  getLink = (data: string) => {
        getCafepsaJsonUrl(data).then((result) => {
            setlInks(result);
        });
    }


    const openInNewTab = (url: string) => {
        getCafepsaJsonUrl(url).then((result) => {
            setlInks(result);
            console.log(result)
            const urlStr = result?.toString();
            window.open(urlStr, '_blank', 'noopener,noreferrer');
        });
    };

    type FarmerType = {
        area: number;
        address: string;
        height: number;
        ipfshash: string;
        latitude: number;
        longitude: number;
        name: string;
        shadow: string;
        varieties: string;
        country: string;
        village: string;
        state: string;
        village2: string;
        qrCode: string;
        blockChainUrl: string;
    };

    useEffect(() => {
        const load = async () => {
            const farmerList = new Array<FarmerType>();
            const user = localStorage.getItem("address")
            if (user !== "") {
                setOwnerAddress(user)
                setLoading(false);
            } else {

            }


            let companyName = "";
            const url = window.location.host.toString();
            if (url.match("commovel") !== null) {
                companyName = "COMMOVEL";
            }
            if (url.match("copracnil") !== null) {
                companyName = "COPRACNIL";
            }
            if (url.match("comsa") !== null) {
                companyName = "COMSA";
            }
            if (url.match("proexo") !== null) {
                companyName = "PROEXO";
            }
            if (url.match("cafepsa") !== null) {
                companyName = "CAFEPSA";
            }
            if (url.match("localhost") !== null) {
                companyName = "CAFEPSA";
            }

            // @ts-ignore


            await getAllFarmers(companyName).then((result) => {
                console.log(companyName);
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        area,
                        address,
                        height,
                        ipfshash,
                        latitude,
                        longitude,
                        fullname: name,
                        shadow,
                        varieties,
                        country,
                        village,
                        state,
                        village2,
                    } = farmerData;


                    let qrCode = window.location.origin
                        .concat("/farmer/")
                        .concat(address);
                    let blockChainUrl = "https://affogato.mypinata.cloud/ipfs/" + ipfshash;
                    setBlockchainUrl(address)
                    farmerList.push({
                        area,
                        address,
                        height,
                        ipfshash,
                        latitude,
                        longitude,
                        name,
                        shadow,
                        varieties,
                        country,
                        village,
                        state,
                        village2,
                        qrCode: qrCode,
                        blockChainUrl: blockChainUrl
                    });
                }
                setFarmers(farmerList);
                console.log(farmerList);
                const itemsCount = farmerList.length;
                setFarmersCount(itemsCount);
                console.log(loading);
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


    const onMapBtnClick = (lat: string, lng: string, adressL: string) => {
        console.log(lat, lng, adressL);
        setCurrentLat(lat);
        setCurrentLng(lng);
        setCurrentAddressL(adressL);
    };

    const columData = useMemo<MRT_ColumnDef<any>[]>(
        () => [

            {
                accessorFn: (row: { qrCode: any; }) => `${row.qrCode} `, //accessorFn used to join multiple data into a single cell
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

                            <label htmlFor="farmerlist" className="btn btn-ghost h-full"
                                onClick={() => { setData(renderedCellValue); }}>
                                <QRCode value={reactNodeToString(renderedCellValue)} size={90} />
                            </label>

                        </Box>
                    </>

                ),
            },
            {
                header: t('tables.name'), accessorKey: 'name'
            }, {
                header: t('tables.community'), accessorKey: 'village'
            }, {
                header: t('tables.municipality'), accessorKey: 'village2'
            }, {
                header: t('region'), accessorKey: 'state'
            }, {
                header: t('country'), accessorKey: 'country'
            },

            {

                accessorFn: (farm: any) => `${farm.latitude} ${farm.longitude}`,
                id: 'coordinates', //id is still required when using accessorFn instead of accessorKey
                header: t('coordinates'),
                size: 50,
                enableSorting: false,
                enableColumnFilter: false,
                // @ts-ignore
                Cell: ({ renderedCellValue, row }) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <label htmlFor="farmslist" onClick={() => {
                                onMapBtnClick(row.original.latitude, row.original.longitude, row.original.village)
                            }}
                                className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                <>{t('tables.view-map')}</>
                            </label>


                        </Box>
                    </>

                ),
            }



            ,

            {
                accessorFn: (farm: any) => `${farm.area} `,
                header: t('area') + '(mz)', size: 5,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );

                },
            },




            {
                header: t('tables.coffee-varieties'), accessorKey: 'varieties'
            },

            {
                accessorFn: (farm: any) => `${farm.height} `,
                header: t('height'), size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );

                },
            },

            {
                header: t('tables.production-system'), accessorKey: 'shadow'
            }
        ],
        [i18n.language],
    );

    return (
        <>
            <div className="">
                <div className=" flex flex-row mb-1 sm:mb-0 justify-between w-full">
                    <div className=" w-full h-full p-1">
                        <div className="card shadow-xl bg-white">
                            <div className="w-full p-5 rounded-lg">
                                <div className="text-center text-xl font-bold">
                                    <>{t("search-farms")}</>
                                </div>
                            </div>
                            <div className="m-6">
                                <div className="card-title grid justify-items-stretch">

                                    <div className="justify-self-end">
                                        <h4>
                                            <>
                                                {t("total")}: {farmersCount}
                                            </>
                                        </h4>
                                        {ownerAddress ? (
                                            <a className="link link-info">
                                                <ReactHTMLTableToExcel
                                                    id="table-xls-button"
                                                    className="download-xls-button"
                                                    table="farmerlist"
                                                    filename={t("farmers")}
                                                    sheet={t("farmers")}
                                                    buttonText={"(".concat(t("download")).concat(")")}
                                                />
                                            </a>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                    </div>

                                    <div className="overflow-auto">
                                        <MaterialReactTable
                                            enableStickyHeader={true}
                                            columns={columData}
                                            editingMode="modal" //default
                                            enableEditing
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
                                                sorting: [{ id: 'name', desc: false }],
                                                showGlobalFilter: true, isLoading: false
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
                        <label htmlFor="farmerlist"
                            className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                        <div className="flex justify-center m-6">
                            <div>
                                <QRCode value={Data} size={300} id="qr-farmer" />
                                <div className="flex pt-8 space-x-4 place-content-center">
                                    <div>
                                        <button
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                            onClick={handleOnDownloadClick}>
                                            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20">
                                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                                            </svg>
                                            <>{t("download")}</>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center items-center">
                                    <br />
                                    <button onClick={() => {
                                        openInNewTab(BlockchainUrl);
                                    }}
                                            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                        <LinkIcon></LinkIcon>
                                        <>Ver en el blockchain</>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-4">
                <input type="checkbox" id="farmslist" className="modal-toggle" />
                <div className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box relative">
                        <label htmlFor="farmslist"
                            className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                        <div className="flex justify-center m-6">
                            <div>

                                <h1> Latitud :
                                    {currentLat}
                                </h1>
                                <h1> Longitud :
                                    {currentLng}
                                </h1>
                                <div className="flex pt-8 space-x-4 place-content-center">
                                    <div>
                                        <NewMap latitude={currentLat}
                                            longitude={currentLng}
                                            addressLine={currentAddressL}
                                            zoomLevel={9}
                                            className="google-map"
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

