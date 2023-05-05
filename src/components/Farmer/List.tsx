import React, {useEffect, useMemo, useState} from "react";
import QRCode from "react-qr-code";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {useTranslation} from "react-i18next";
import "../../styles/farmers.scss";
import Loading from "../Loading";
import {getAllFarmers} from "../../db/firebase";
import {useAuthContext} from "../../states/AuthContext";
import FormInput from "../common/FormInput";
import NotFound from "../common/NotFound";
import {GenderFilterList, SEARCH_DIVIDER} from "../../utils/constants";
import {SearchIcon} from "../icons/search";
import {ClearIcon} from "../icons/clear";
import {LinkIcon} from "../icons/link";


const openInNewTab = (url: string | URL | undefined) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const saveSvgAsPng = require("save-svg-as-png");

const pagDefault = {
    previous: 0,
    current: 0,
    next: 0,
    pages: 0,
    itemsPerPage: 15,
    itemsCount: 0,
    lastId: "0",
};

type FarmerType = {
    farmerId: string;
    address: string;
    fullname: string;
    bio: string;
    gender: string;
    farm: string;
    location: string;
    search: string;
};

export const List = () => {
    const {t} = useTranslation();
    const {authState} = useAuthContext();
    const [state] = authState;
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [pagination, setPagination] = useState(pagDefault);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [blockChainLink, setBlockChainLink ] = useState("");
    const [searchCriteria, setSearchCriteria] = useState("");
    const [currentGender, setCurrentGender] = useState(GenderFilterList[0]);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const confPagination = (fData: Array<any>, itemsPerPage: number) => {
        if (fData.length > 0) {
            const itemsCount = fData.length;
            const pages = Math.ceil(itemsCount / itemsPerPage);
            const lastDataPage = Math.ceil(itemsCount / itemsPerPage);
            const pag = {
                previous: 0,
                current: 1,
                next: 2,
                pages,
                lastDataPage,
                itemsPerPage,
                itemsCount,
                lastId: "0",
            };
            setPagination(pag);
            setFarmersCount(itemsCount);
        } else {
            setPagination(pagDefault);
        }
    };

    /* const calculateFarmersCount = (fData: Array<any>) => {
      let total = 0;
      fData.forEach((farmer) => {
        const [farmerId, fullname] = farmer.data();
        if (farmerId !== "" && fullname !== "") {
          total += 1;
        }
      });
      setFarmersCount(total);
    }; */


    const setData = (qrUrl: any, ipfsUrl: any ) => {
        setQrCodeUrl(qrUrl);
        setBlockChainLink(ipfsUrl);
    }


    useEffect(() => {
        const load = async () => {
            const farmerList = new Array<FarmerType>();
            const user = localStorage.getItem("address")
            if(user !== ""){
                setOwnerAddress(user)
            } else {

            }


            let companyName: string;
            const url = window.location.host.toString();

            switch (url) {
                case "copracnil": {
                    companyName = "COPRACNIL";
                    break;
                }
                case "proexo":{
                    companyName = "PROEXO";
                    break;
                }
                case "commovel":{
                    companyName = "COMMOVEL";
                    break;
                }
                case "comsa":{
                    companyName = "COMSA";
                    break;
                }
                default :{
                    companyName = "PROEXO"
                    break;
                }

            }


            await getAllFarmers(companyName).then((result) => {
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        farmerId,
                        address,
                        fullname,
                        bio,
                        gender,
                        farm,
                        village,
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
                    farmerList.push({
                        farmerId,
                        address,
                        fullname,
                        bio,
                        gender,
                        farm,
                        location: l,
                        search: s.toLowerCase()
                    });
                }
                setFarmers(farmerList);
                confPagination(result, 15);
                // calculateFarmersCount(result);
            });
            setLoading(false);
        };
        load();
    }, []);

    const onPageSelected = (pageNumber: number) => {
        const nextPage = pageNumber === pagination.pages ? 0 : pageNumber + 1;
        const newPagination = {
            ...pagination,
            previous: pageNumber === 1 ? 0 : pageNumber - 1,
            current: pageNumber,
            next: nextPage,
        };
        setPagination(newPagination);
    };

    const filterByCriteria = (f: FarmerType) =>
        f.search.includes(searchCriteria.toLowerCase());

    const filterByGender = (f: FarmerType) => {
        const fgender = f.gender.toLowerCase();
        return fgender === currentGender.key;
    };

    const filterFarmers = () => {
        let farmerList = farmers.slice();
        if (searchCriteria.trim().length > 0) {
            farmerList = farmerList.filter(filterByCriteria);
        }
        if (currentGender.key !== "all") {
            farmerList = farmerList.filter(filterByGender);
        }

        setFarmers(farmerList);
        confPagination(farmerList, 15);
    };

    const handleSearchCriteriaChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value;
        setSearchCriteria(input);
    };

    const handleSearchCriteriaKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        const input = event.currentTarget.value.trim();
        if (event.key === "Enter" && input.length > 1) {
            filterFarmers();
        }
    };



    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        for (let i = 0; i < GenderFilterList.length; i += 1) {
            if (GenderFilterList[i].key === key) {
                setCurrentGender(GenderFilterList[i]);
            }
        }
    };

    const onSearchClick = () => {
        filterFarmers();
    };

    const onClearClick = () => {
        setSearchCriteria("");
        setFarmers(farmers.slice());
        confPagination(farmers, 15);
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

    const RenderFilters = () => (<>

        <div className="w-full p-5 rounded-lg">
            <div className="text-center">
                <>{t("search-farmers")}</>
            </div>


        </div>

    </>);


    const RenderItem = (farmer: FarmerType, index: number) => {
        const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);

        if (farmer.fullname === "" && farmer.farmerId === "") {
            return <></>;
        }
        const farmerUrl = window.location.origin
            .concat("/farmer/")
            .concat(farmer.address);

        const ipfsUrl = "https://affogato.mypinata.cloud/ipfs/" + farmer.farm

        return (<tr
            key={index}
            className={`${pagination.current === itemPage ? "show" : "hide"} flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 border-grey-light border-2`}>

            <td className="p-3 text-base font-light">
                <div className="qrcode">
                    <label htmlFor="farmerlist" className="btn btn-ghost h-full"
                           onClick={() => { setData(farmerUrl, ipfsUrl ); }}>
                        <QRCode value={farmerUrl} size={90}/>
                    </label>
                </div>
            </td>

            <td className="p-3 text-base font-light">
                      <a className="link link-info" href={farmerUrl} target="_blank" rel="noreferrer">
                    {farmer.fullname}
                </a>
            </td>
            <td className="p-3 text-base font-light">
                     <>{t(farmer.gender)}</>
            </td>
            <td className="p-3 text-base font-light">
                    {farmer.location}
            </td>
            <td className="p-3 text-base font-light">
                     {farmer.address}
            </td>
            <td className="p-3 text-base font-light">
                <a className="link link-info" href={"https://affogato.mypinata.cloud/ipfs/" + farmer.farm} target="_blank" rel="noreferrer">
                    Ver en blockchain
                </a>

            </td>
        </tr>);
    };




    return (
        <>




            <input type="checkbox" id="farmerlist" className="modal-toggle"/>
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box relative">
                    <label htmlFor="farmerlist"
                           className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                    <div className="flex justify-center m-6">
                        <div>
                            <QRCode value={qrCodeUrl} size={300} id="qr-farmer" />
                            <div className="flex pt-8 space-x-4 place-content-center">
                                <div>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                        onClick={handleOnDownloadClick}>
                                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                                        </svg>
                                        <>{t("download")}</>
                                    </button>
                                </div>
                                <div>
                                        <button onClick={() => {
                                            openInNewTab(qrCodeUrl);}}
                                            className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                            <LinkIcon></LinkIcon>
                                            <>{t("open-link")}</>
                                        </button>
                                </div>
                            </div>
                            <div className="text-center items-center">
                                <br/>
                                <button onClick={() => {
                                    openInNewTab(blockChainLink);}}
                                        className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                    <LinkIcon></LinkIcon>
                                    <>Ver en el blockchain</>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                <div className=" flex flex-row mb-1 sm:mb-0 justify-between w-full">
                    <div className=" w-full h-full p-1">
                        <div className="card shadow-xl bg-white">
                            {RenderFilters()}
                            <div className="card-body overflow-y-scroll">
                                <div className="card-title grid justify-items-stretch">
                                    <div className="justify-self-start">
                                        <h4>
                                            <>{t("farmers")}</>
                                        </h4>
                                    </div>
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

                                    <div className="overflow-x-scroll">




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
