import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Modal from 'react-modal';
import QRCode from "react-qr-code";
import Table from "react-bootstrap/esm/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {useTranslation} from "react-i18next";
import "../../styles/farmers.scss";
import Loading from "../Loading";
import {getAllFarmers} from "../../db/firebase";
import FormInput from "../common/FormInput";
import {CustomPagination} from "../common/Pagination";
import NotFound from "../common/NotFound";
import {GenderFilterList, SEARCH_DIVIDER} from "../../utils/constants";
import {SearchIcon} from "../icons/search";
import {ClearIcon} from "../icons/clear";
import {LinkIcon} from "../icons/link";
import {Close} from "../icons/close";

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
    location: string;
    search: string;
};

export const List = () => {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmers2, setFarmers2] = useState<Array<FarmerType>>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [pagination, setPagination] = useState(pagDefault);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [searchCriteria, setSearchCriteria] = useState("");
    const [currentGender, setCurrentGender] = useState(GenderFilterList[0]);


    let subtitle: { style: { color: string; }; };
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

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

    useEffect(() => {
        const load = async () => {
            const farmerList = new Array<FarmerType>();
            let companyName = "PROEXO";
            const hostname = window.location.hostname;
            if (hostname.includes("copranil")) {
                companyName = "COPRANIL";
            } else if (hostname.includes("commovel")) {
                companyName = "COMMOVEL";
            } else if (hostname.includes("comsa")) {
                companyName = "COMSA";
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
                        location: l,
                        search: s.toLowerCase(),
                    });
                }
                setFarmers(farmerList);
                setFarmers2(farmerList);
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
        let farmerList = farmers2.slice();
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

    const handleGenderChange = (key: string) => {
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
        setFarmers(farmers2.slice());
        confPagination(farmers2, 15);
    };

    const handleOnDownloadClick = () => {
        saveSvgAsPng.saveSvgAsPng(
            document.getElementById("current-qr"),
            "qr-farmer",
            {
                scale: 0.5,
            }
        );
    };

    const RenderFilters = () => (
        <>

            <div className="w-full  shadow p-5 rounded-lg bg-white">
                <div className="text-center">
                    <>{t("search-farmers")}</>
                </div>
                <div className="relative">
                    <div className="absolute flex items-center ml-2 h-full">
                        <SearchIcon className="m-4 w-4 h-4 fill-current"/>
                    </div>

                    <FormInput
                        label={t("")}
                        value={searchCriteria}
                        placeholder={t("search-name")}
                        handleOnChange={handleSearchCriteriaChange}
                        handleOnKeyDown={handleSearchCriteriaKeyDown}
                        errorMsg=""
                           className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 m-4">



                    <button onClick={() => onSearchClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-amber-200 active:text-white focus:text-white
                                        focus:bg-amber-400 active:bg-amber-600">
                        <SearchIcon className="w-4 h-4 mr-2"/>
                        <>{t("search")}</>
                    </button>
                    <button onClick={() => onClearClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-red-200 active:text-white focus:text-white
                                        focus:bg-red-400 active:bg-red-700">
                        <ClearIcon className="w-4 h-4 mr-2"/>
                        <>{t("clear")}</>
                    </button>
                    <div className=" dropdown dropdown-hover">
                        <Form.Label className="px-4">
                            <>{t("gender")}</>
                        </Form.Label>
                        <Dropdown
                            onSelect={(eventKey) => handleGenderChange(eventKey || "all")}
                        >
                            <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-cooperative"
                                className="text-left block w-full  rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                            >
                                <div className="cooperative-toggle">
                                    <span>{currentGender.name}</span>
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {GenderFilterList.map((item) => (
                                    <Dropdown.Item key={item.key} eventKey={item.key}>
                                        {item.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

            </div>

        </>
    );

    const RenderItem = (farmer: FarmerType, index: number) => {
        const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);

        if (farmer.fullname === "" && farmer.farmerId === "") {
            return <></>;
        }
        const farmerUrl = window.location.origin
            .concat("/farmer/")
            .concat(farmer.address);

        return (
            <tr
                key={index}
                className={pagination.current === itemPage ? "show" : "hide"}
            >
                <td className="main">
                    <div className="qrcode">
                        <button
                            className="qrcode-btn"
                            onClick={() => {
                                setQrCodeUrl(farmerUrl);
                                openModal()
                            }}
                        >
                            <QRCode value={farmerUrl} size={60}/>
                        </button>
                    </div>
                </td>
                <td>{farmer.farmerId}</td>
                <td>
                    <a href={farmerUrl} target="_blank" rel="noreferrer">
                        {farmer.fullname}
                    </a>
                </td>
                <td>
                    <>{t(farmer.gender)}</>
                </td>
                <td>{farmer.location}</td>
                <td>{farmer.address}</td>
                <td>
                    {farmer.bio.length > 70
                        ? farmer.bio.slice(0, 70).concat("...")
                        : farmer.bio}
                </td>
            </tr>
        );
    };


    if (loading) {
        return (
            <Loading
                label={t("loading").concat("...")}
                className="loading-wrapper two"
            />
        );
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <button onClick={closeModal}>
                    <Close className="w-12 text-red-500 hover:text-red-900"/>
                </button>
                <br/>
                <div className="flex  justify-center">
                    <div>
                        <QRCode id="current-qr" value={qrCodeUrl} size={500}/>

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
                                <a href={qrCodeUrl}>
                                    <button
                                        className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                        <LinkIcon></LinkIcon>
                                        <>{t("open-link")}</>
                                    </button>
                                </a></div>

                        </div>

                    </div>
                </div>
            </Modal>


            <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
                    <div className="farmers">
                        {RenderFilters()}
                        <Card>
                            <Card.Header>
                                <h4>
                                    <>{t("farmers")}</>
                                </h4>
                                <div className="totals">
                                    <h4>
                                        <>
                                            {t("total")}: {farmersCount}
                                        </>
                                    </h4>
                                    <ReactHTMLTableToExcel
                                        id="table-xls-button"
                                        className="download-xls-button"
                                        table="farmers-list"
                                        filename={t("farmers")}
                                        sheet={t("farmers")}
                                        buttonText={"(".concat(t("download")).concat(")")}
                                    />
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {farmers === null ? (
                                    <NotFound msg="No se encontraron productores"/>
                                ) : (
                                    <>
                                        <Table id="farmers-list" className="farmers-list">
                                            <thead>
                                            <tr>
                                                <th/>
                                                <th>
                                                    <>{t("code")}</>
                                                </th>
                                                <th>
                                                    <>{t("name")}</>
                                                </th>
                                                <th>
                                                    <>{t("gender")}</>
                                                </th>
                                                <th>
                                                    <>{t("location")}</>
                                                </th>
                                                <th>
                                                    <>{t("account-address")}</>
                                                </th>
                                                <th className="th-bio">
                                                    <>{t("bio")}</>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {farmers.map((farmer: any, index: number) =>
                                                RenderItem(farmer, index)
                                            )}
                                            </tbody>
                                        </Table>
                                    </>
                                )}
                            </Card.Body>
                            <Card.Footer>
                                <CustomPagination
                                    pagination={pagination}
                                    onPageSelected={onPageSelected}
                                />
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};
