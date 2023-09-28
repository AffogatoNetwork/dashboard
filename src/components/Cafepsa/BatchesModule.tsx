import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable, { MRT_ColumnDef, MaterialReactTableProps } from "material-react-table";
import { getAllBatches } from "../../db/firebase";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import { LinkIcon } from "../icons/link";
import { useTranslation } from "react-i18next";
import reactNodeToString from "react-node-to-string"
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

export const BatchesModule = () => {
    const saveSvgAsPng = require("save-svg-as-png");

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [Data, setData] = useState<any>([]);
    const [BlockchainUrl, setBlockchainUrl] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>(() => Data);
    const [editingBehavior, setEditingBehavior] = useState<boolean>(false);

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
            tableData[row.index] = values;

            //send/receive api updates here
            exitEditingMode(); //required to exit editing mode
        };


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
                companyName = "COPRACNIL";
            } else {
                companyName = "CAFEPSA";
            }

            await getAllBatches(companyName).then((result) => {
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        Name = "",
                        parentId,
                        ipfsHash,
                        dryMill = {},
                        wetMill = {},
                        Profile = {},
                        Roasting = {},
                    } = farmerData;


                    let qrCode = window.location.origin
                        .concat("/newbatch/")
                        .concat(ipfsHash);
                    let blockChainUrl = "https://affogato.mypinata.cloud/ipfs/" + ipfsHash;
                    setBlockchainUrl(blockChainUrl)
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

                console.log(farmerList);
                setFarmers(farmerList);
                const itemsCount = farmerList.length;
                setFarmersCount(itemsCount);
                console.log(loading);
            });
        };

        load();
    }, []);



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
                accessorFn: (farmers: any) => `${farmers.Name}  ${farmers.parentId},  ${farmers.ipfsHash.substring(0, 6)} `, //accessorFn used to join multiple data into a single cell
                id: 'name', //id is still required when using accessorFn instead of accessorKey
                header: t("farmers"), size: 25,
                Cell(props) {
                    return (
                        <div className="text-left">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            }, {
                accessorFn: (farmers: any) => `${farmers.dryMill.average_height}`, //accessorFn used to join multiple data into a single cell
                header: t("tables.height-lot"), size: 15,
                Cell(props) {
                    if (props.renderedCellValue === 'undefined') {
                        return (
                            <div className="text-left">
                                {"Aprox 1200"}
                            </div>
                        );
                    }
                    return (
                        <div className="text-left">
                            {props.renderedCellValue || "Aprox 1200"}
                        </div>
                    );
                },
            }, {
                header: t('tables.batch-weight'), accessorKey: 'dryMill.weight', size: 15,
            }, {
                accessorFn: (farmers: any) => `${farmers.dryMill.note}`, //accessorFn used to join multiple data into a single cell
                header: t('tables.tasting-note'), size: 15,
                Cell(props) {
                    if (props.renderedCellValue === '0') {
                        return (
                            <div className="text-left">
                                {"Mayor 80"}
                            </div>
                        );
                    }
                    return (
                        <div className="text-left">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            }, {
                accessorFn: (farmers: any) => `${farmers.dryMill.cupping_url}`, //accessorFn used to join multiple data into a single cell
                header: t('tables.tasting-profile'), size: 15,
                Cell: ({ renderedCellValue }) => (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <button onClick={() => {
                                openInNewTab(reactNodeToString(renderedCellValue));
                            }}
                                className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                <LinkIcon></LinkIcon>
                                <>{t('open-link')}</>
                            </button>

                        </Box>
                    </>

                ),
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
                                    <>{t("coffe-batches-benefied")}</>
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
                                            displayColumnDefOptions={{
                                                'mrt-row-numbers': {
                                                    size: 10,
                                                },
                                                'mrt-row-expand': {
                                                    size: 10,
                                                },
                                            }}
                                            initialState={{
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

