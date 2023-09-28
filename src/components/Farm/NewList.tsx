import React, { useEffect, useMemo, useState } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { getFarms } from "../../db/firebase";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import NewMap from "../common/NewMap";


export const FarmsNewList = () => {
    const saveSvgAsPng = require("save-svg-as-png");

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [farms, setFarms] = useState<Array<FarmType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const [currentLat, setCurrentLat] = useState("0");
    const [currentLng, setCurrentLng] = useState("0");
    const [currentAddressL, setCurrentAddressL] = useState("");

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

    const onMapBtnClick = (lat: string, lng: string, adressL: string) => {
        console.log(lat, lng, adressL);
        setCurrentLat(lat);
        setCurrentLng(lng);
        setCurrentAddressL(adressL);
    };


    const DetermineValue = (value: string) => {
        console.log(value);
    }


    type FarmType = {
        farmerAddress: string;
        company: string;
        name: string;
        height: string;
        area: string;
        certifications: string;
        latitude: string;
        longitude: string;
        bio: string;
        location?: string;
        search?: string;
        country: string;
        region: string;
        village: string;
        village2: string;
        ethnicGroup: string;
        varieties: string;
        shadow: string;
        coordinates?: [];
        familyMembers: string;
    };

    useEffect(() => {
        const load = async () => {
            const farmList = new Array<FarmType>();
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
                companyName = "COMSA";
            }


            await getFarms(companyName).then((result) => {
                for (let i = 0; i < result.length; i += 1) {
                    const farmData = result[i].data();
                    const l = farmData.location;
                    const {
                        farmerAddress,
                        company,
                        name = "",
                        height = "1200",
                        area,
                        certifications,
                        latitude,
                        longitude,
                        bio,
                        country,
                        region,
                        village,
                        village2,
                        varieties,
                        shadow,
                        familyMembers,
                        ethnicGroup,
                    } = farmData;

                    farmList.push({
                        farmerAddress,
                        company,
                        name,
                        height,
                        area,
                        certifications,
                        latitude,
                        longitude,
                        bio,
                        country,
                        region,
                        village,
                        village2,
                        varieties,
                        shadow,
                        familyMembers,
                        ethnicGroup
                    });
                }
                setFarms(farmList);
                const itemsCount = farmList.length;
                setFarmersCount(itemsCount);
                console.log(loading);              // calculateFarmersCount(result);
            });
            setLoading(false);
        };

        load();
    }, []);



    const columData = useMemo<MRT_ColumnDef<FarmType>[]>(
        () => [
            {
                accessorFn: (farm: any) => `${farm.name} ${farm.village}`,
                header: t('farm-name'), size: 25,
                Cell(props) {
                    console.log(props);
                    if (props.renderedCellValue === "undefined") {
                        return (
                            <div className="text-center">
                            </div>
                        );

                    } else {
                        return (
                            <div className="text-center">
                                {props.renderedCellValue}
                            </div>
                        );
                    }

                },
            }, {
                header: t('tables.height'), accessorKey: 'height', size: 5,
            }, {
                header: t('area'), accessorKey: 'area', size: 5,
            }, {
                header: t('certificates'), accessorKey: 'certifications', size: 15,
            }, {
                header: t('varieties'), accessorKey: 'varieties', size: 15,
            }, {
                header: t('tables.location'), accessorKey: 'village2', size: 15,
            }, {
                header: t('tables.shadow'), accessorKey: 'shadow', size: 15,
            }, {
                accessorFn: (farm: any) => `${farm.familyMembers}`,
                id: 'familyMembers', //id is still required when using accessorFn instead of accessorKey
                header: t('family-members'),
                size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            }, {
                header: t('tables.ethnic-group'), accessorKey: 'ethnicGroup', size: 15,
            }, {

                accessorFn: (farm: any) => `${farm.latitude} ${farm.longitude}`,
                id: 'coordinates', //id is still required when using accessorFn instead of accessorKey
                header: t('tables.view-map'),
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

                                    <div className=" overflow-scroll">
                                        <MaterialReactTable
                                            columns={columData}
                                            data={farms}
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
                <input type="checkbox" id="farmslist" className="modal-toggle" />
                <div className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box relative">
                        <label htmlFor="farmslist"
                            className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                        <div className="flex justify-center m-6">
                            <div>
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

