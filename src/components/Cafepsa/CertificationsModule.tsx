import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { getAllFarmers } from "../../db/firebase";
import { SEARCH_DIVIDER } from "../../utils/constants";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import reactNodeToString from "react-node-to-string";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { LinkIcon } from "../icons/link";
import {MdDoneOutline} from "react-icons/md";
export const CertificationsModule = () => {
    const saveSvgAsPng = require("save-svg-as-png");

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [Data, setData] = useState<any>([]);
    const [BlockchainUrl, setBlockchainUrl] = useState<string | null>(null);

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


            await getAllFarmers(companyName).then((result) => {
                console.log(companyName);
                console.log(result);
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        farmerId,
                        address,
                        area,
                        usda,
                        spp,
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
                        .concat(", ")
                        .concat(region)
                        .concat(", ")
                        .concat(country);
                    const s = farmerId
                        .concat(SEARCH_DIVIDER)
                        .concat(fullname)
                        .concat(SEARCH_DIVIDER)
                        .concat(bio)
                        .concat(SEARCH_DIVIDER)
                        .concat(l);
                    let qrCode = window.location.origin
                        .concat("/farmer/")
                        .concat(address);
                    let blockChainUrl = "https://affogato.mypinata.cloud/ipfs/" + farm;
                    setBlockchainUrl(blockChainUrl)
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
                        manosdemujer,
                        fairtrade,
                        location: l,
                        region,
                        village,
                        village1,
                        village2,
                        qrCode,
                        blockChainUrl,
                        search: s.toLowerCase()
                    });
                }
                console.log(farmerList);
                setFarmers(farmerList);
                const itemsCount = farmerList.length;
                setFarmersCount(itemsCount);
                console.log(loading);
            });
        };

        load();
    }, []);



    const columData = useMemo<MRT_ColumnDef<FarmerType>[]>(
        () => [


            {
                header: 'Nombre ', accessorKey: 'fullname'
            }, {
                accessorFn: (row: { usda: any; }) => `${row.usda} `, //accessorFn used to join multiple data into a single cell
                id: 'spp', //id is still required when using accessorFn instead of accessorKey
                header: 'SPP',
                Header: ({ column }) => (
                    <img src={require('../../assets/certificaciones/1_USDA Organic.png')} />
                ), //arrow function
                size: 25,
                enableSorting: false,
                enableColumnFilter: false,
                // @ts-ignore
                Cell: ({row}) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            
                            {(row.original.usda === 1) && (
                                <h1>
                                    <MdDoneOutline className="icon"/>
                                </h1>
                            )}
                        

                        </Box>
                    </>

                ),
            }, {
                accessorFn: (row: { fairtrade: any; }) => `${row.fairtrade} `, //accessorFn used to join multiple data into a single cell
                id: 'spp', //id is still required when using accessorFn instead of accessorKey
                header: 'SPP',
                Header: ({ column }) => (
                    <img src={require('../../assets/certificaciones/2_Fair Trade.png')} />
                ), //arrow function
                size: 25,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({row}) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            
                            {(row.original.fairtrade === 1) && (
                                <h1>
                                    <MdDoneOutline className="icon"/>
                                </h1>
                            )}
                        

                        </Box>
                    </>

                ),
            }, {
                accessorFn: (row: { manosdemujer: any; }) => `${row.manosdemujer} `, //accessorFn used to join multiple data into a single cell
                id: 'spp', //id is still required when using accessorFn instead of accessorKey
                header: 'SPP',
                Header: ({ column }) => (
                    <img src={require('../../assets/certificaciones/5_ConManosdeMujer.png')} />
                ), //arrow function
                size: 25,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({row}) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            
                            {(row.original.manosdemujer === 1) && (
                                <h1>
                                    <MdDoneOutline className="icon"/>
                                </h1>
                            )}
                       

                        </Box>
                    </>

                ),
            }, {
                accessorFn: (row: { spp: any; }) => `${row.spp} `, //accessorFn used to join multiple data into a single cell
                id: 'spp', //id is still required when using accessorFn instead of accessorKey
                header: 'SPP',
                Header: () => (
                    <img src={require('../../assets/certificaciones/7_Pequeños_Productores.png')} />
                ), //arrow function
                size: 25,
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({row}) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            
                            {(row.original.spp === 1) && (
                                <h1>
                                    <MdDoneOutline className="icon"/>
                                </h1>
                            )}
                      

                        </Box>
                    </>

                ),
            }
        ],
        [],
    );







    return (
        <>

            <div className="">
                <div className=" flex flex-row mb-1 sm:mb-0 justify-between w-full">
                    <div className=" w-full h-full p-1">
                        <div className="card shadow-xl bg-white">
                            <div className="w-full p-5 rounded-lg">
                                <div className="text-center text-xl font-bold">
                                    <>{t("search-farmers")}</>
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
                                                    table="farmers-list"
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

                                    <div className="overflow-auto ">
                                        <MaterialReactTable
                                            enableStickyHeader={true}
                                            columns={columData}
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
                                    <div>
                                        <button onClick={() => {
                                            openInNewTab(Data);
                                        }}
                                            className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            <LinkIcon></LinkIcon>
                                            <>{t("open-link")}</>
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
        </>
    )
}  
