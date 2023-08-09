import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { getAllFarmers } from "../../db/firebase";
import { SEARCH_DIVIDER } from "../../utils/constants";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import { LinkIcon } from "../icons/link";
import { useTranslation } from "react-i18next";
import reactNodeToString from "react-node-to-string"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

export const FarmerProfileModule = () => {
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
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        farmerId,
                        address,
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
                accessorFn: (row: { qrCode: any; }) => `${row.qrCode} `, //accessorFn used to join multiple data into a single cell
                id: 'qrCode', //id is still required when using accessorFn instead of accessorKey
                header: 'Código QR',
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
                accessorFn: (row) => `${row.qrCode} ${row.fullname}`, //accessorFn used to join multiple data into a single cell
                id: 'name', //id is still required when using accessorFn instead of accessorKey
                header: 'Nombre',
                enableSorting: false,
                enableColumnFilter: false,
                // @ts-ignore
                Cell: ({ renderedCellValue, row}) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
    
                            <h1 onClick={() => {
                                openInNewTab(reactNodeToString(row.original.qrCode));}}
                                    className=" font-bold hover:underline hover:decoration-2">
                               {row.original.fullname}
                            </h1>
                        </Box>
                    </>
                ),
            }, {
                accessorFn: (row: { gender: any; }) => `${row.gender} `, //accessorFn used to join multiple data into a single cell
                id: 'gender', //id is still required when using accessorFn instead of accessorKey
                header: 'Sexo',
                size: 25,
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
                            <span>
                                {renderedCellValue}
                            </span>
                        </Box>
                    </>
                ),
            }, {
                header: 'Ubicación ', accessorKey: 'location'
            }, {
                accessorFn: (farm: any) => `${farm.familyMembers}`,
                id: 'familyMembers', //id is still required when using accessorFn instead of accessorKey
                header: 'No. Integrantes',
                size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            },
            
            {
                accessorFn: (farm: any) => `${farm.maleMenbers}`,
                id: 'maleMenbers', //id is still required when using accessorFn instead of accessorKey
                header: 'Integrantes Masculinos',
                size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            },
            {
                accessorFn: (farm: any) => `${farm.femaleMenbers}`,
                id: 'femaleMenbers', //id is still required when using accessorFn instead of accessorKey
                header: 'Integrantes Femeninos',
                size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            },
            
            
            
            
            {
                header: 'Comunidad ', accessorKey: 'region'
            }, {
                header: 'Municipio ', accessorKey: 'village2'
            }, {
                header: 'Pais', accessorKey: 'country'
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
};

