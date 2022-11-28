import React, {useEffect, useState} from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {useTranslation} from "react-i18next";
import "../../styles/farms.scss";
import Loading from "../Loading";
import {FarmType} from "../common/types";
import {getFarms} from "../../db/firebase";
import {useAuthContext} from "../../states/AuthContext";
import FormInput from "../common/FormInput";
import {CustomPagination} from "../common/Pagination";
import NotFound from "../common/NotFound";
import {SEARCH_DIVIDER} from "../../utils/constants";
import {SearchIcon} from "../icons/search";
import {ClearIcon} from "../icons/clear";
import NewMap from "../common/NewMap";

const pagDefault = {
    previous: 0, current: 0, next: 0, pages: 0, itemsPerPage: 15, itemsCount: 0, lastId: "0",
};

export const List = () => {
    const {t} = useTranslation();
    const {authState} = useAuthContext();
    const [state] = authState;
    const [loading, setLoading] = useState(true);
    const [farms, setFarms] = useState<Array<FarmType>>([]);
    const [farms2, setFarms2] = useState<Array<FarmType>>([]);
    const [farmsCount, setFarmsCount] = useState(0);
    const [currentLat, setCurrentLat] = useState("0");
    const [currentLng, setCurrentLng] = useState("0");
    const [currentAddressL, setCurrentAddressL] = useState("");
    const [pagination, setPagination] = useState(pagDefault);
    const [searchCriteria, setSearchCriteria] = useState("");

    const confPagination = (fData: Array<any>, itemsPerPage: number) => {
        if (fData.length > 0) {
            const itemsCount = fData.length;
            const pages = Math.ceil(itemsCount / itemsPerPage);
            const lastDataPage = Math.ceil(itemsCount / itemsPerPage);
            const pag = {
                previous: 0, current: 1, next: 2, pages, lastDataPage, itemsPerPage, itemsCount, lastId: "0",
            };
            setPagination(pag);
            setFarmsCount(itemsCount);
        } else {
            setPagination(pagDefault);
        }
    };

    const buildSearchField = (f: FarmType, location: string): string => {
        const sField = f.name
            .concat(SEARCH_DIVIDER)
            .concat(f.certifications)
            .concat(SEARCH_DIVIDER)
            .concat(f.bio)
            .concat(SEARCH_DIVIDER)
            .concat(f.varieties)
            .concat(SEARCH_DIVIDER)
            .concat(f.ethnicGroup)
            .concat(SEARCH_DIVIDER)
            .concat(location);

        return sField;
    };

    useEffect(() => {
        const load = async () => {
            const farmList = new Array<FarmType>();
            // const signer = state.provider.getSigner();
            // const sAddress = await signer.getAddress();
            let companyName = "PROEXO";
            const hostname = window.location.hostname;
            if (hostname.includes("copranil")) {
                companyName = "COPRANIL";
            } else if (hostname.includes("commovel")) {
                companyName = "COMMOVEL";
            } else if (hostname.includes("comsa")) {
                companyName = "COMSA";
            }


            await getFarms(companyName).then((result) => {
                for (let i = 0; i < result.length; i += 1) {
                    const farmData = result[i].data();
                    const l = farmData.village
                        .concat(", ")
                        .concat(farmData.region)
                        .concat(", ")
                        .concat(farmData.country);
                    const farm = {
                        farmerAddress: farmData.farmerAddress,
                        company: farmData.company,
                        name: farmData.name,
                        height: farmData.height,
                        area: farmData.area,
                        certifications: farmData.certifications,
                        latitude: farmData.latitude,
                        longitude: farmData.longitude,
                        bio: farmData.bio,
                        country: farmData.country,
                        region: farmData.region,
                        village: farmData.village,
                        village2: farmData.village2,
                        varieties: farmData.varieties,
                        shadow: farmData.shadow,
                        familyMembers: farmData.familyMembers,
                        ethnicGroup: farmData.ethnicGroup,
                        location: l,
                        search: "",
                    };
                    farm.search = buildSearchField(farm, l);
                    farmList.push(farm);
                }
                setFarms(farmList);
                setFarms2(farmList);
                confPagination(result, 15);
                // calculateFarmersCount(result);
            });
            setLoading(false);
        };
        load();
        // eslint-disable-next-line
    }, []);

    const onPageSelected = (pageNumber: number) => {
        const nextPage = pageNumber === pagination.pages ? 0 : pageNumber + 1;
        const newPagination = {
            ...pagination, previous: pageNumber === 1 ? 0 : pageNumber - 1, current: pageNumber, next: nextPage,
        };
        setPagination(newPagination);
    };

    const filterFarms = (f: FarmType) => {
        const s = f.search.toLowerCase();
        return s.includes(searchCriteria.toLowerCase());
    };

    const searchFarms = () => {
        let farmList = farms2.slice();
        if (searchCriteria.trim().length > 0) {
            farmList = farmList.filter(filterFarms);
        }

        setFarms(farmList);
        confPagination(farmList, 15);
    };

    const handleSearchCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setSearchCriteria(input);
    };

    const handleSearchCriteriaKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const input = event.currentTarget.value.trim();
        if (event.key === "Enter" && input.length > 1) {
            searchFarms();
        }
    };

    const onSearchClick = () => {
        searchFarms();
    };

    const onClearClick = () => {
        setSearchCriteria("");
        setFarms(farms2.slice());
        confPagination(farms2, 15);
    };

    const onMapBtnClick = (lat: string, lng: string, adressL: string) => {
        setCurrentLat(lat);
        setCurrentLng(lng);
        setCurrentAddressL(adressL);
    };

    const RenderFilters = () => (<>
            <div className="w-full p-5 ">
                <div className="text-center text-lg text-black">
                    <>{t("search-farms")}</>
                </div>
                <div className="relative">
                    <div className="absolute flex items-center ml-2 h-full">
                        <SearchIcon className="m-4 w-4 h-4 fill-current"/>
                    </div>

                    <FormInput
                        label={t("")}
                        value={searchCriteria}
                        placeholder={t("search-farms")}
                        handleOnChange={handleSearchCriteriaChange}
                        handleOnKeyDown={handleSearchCriteriaKeyDown}
                        errorMsg=""
                        className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 m-4">


                    <button onClick={() => onSearchClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-amber-200 active:text-white hover:text-white
                                        focus:bg-amber-400 active:bg-amber-600">
                        <SearchIcon className="w-4 h-4 mr-2"/>
                        <>{t("search")}</>
                    </button>
                    <button onClick={() => onClearClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-red-200 active:text-white hover:text-white
                                        focus:bg-red-400 active:bg-red-700">
                        <ClearIcon className="w-4 h-4 mr-2"/>
                        <>{t("clear")}</>
                    </button>
                </div>

            </div>
        </>

    );

    const RenderItem = (farm: FarmType, index: number) => {
        const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);

        if (farm.name === "") {
            return <></>;
        }

        return (

            <tr key={index}
                className={`${pagination.current === itemPage ? "show" : "hide"} flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0 border-grey-light border-2`}>


                <td className="p-3 text-base font-light">{farm.name}</td>
                <td className="p-3 text-base font-light">
                    {farm.height} <>{t("masl")}</>
                </td>
                <td className="p-3 text-base font-light">{farm.area}</td>
                <td className="p-3 text-base font-light">{farm.certifications}</td>
                <td className="p-3 text-base font-light">{farm.varieties}</td>
                <td className="p-3 text-base font-light">{farm.location}</td>
                <td className="p-3 text-base font-light">{farm.shadow}</td>
                <td className="p-3 text-base font-light">{farm.familyMembers}</td>
                <td className="p-3 text-base font-light">{farm.ethnicGroup}</td>
                <td className="p-3 text-base font-light">
                    <label htmlFor="map-modal" className="btn btn-ghost h-full"
                           onClick={() => {
                               onMapBtnClick(farm.latitude, farm.longitude, farm.name)
                           }}
                    >
                        <>{t("show-map")}</>
                    </label>
                </td>
            </tr>);
    };

    if (loading) {
        return (<Loading
            label={t("loading").concat("...")}
            className="loading-wrapper mx-auto pt-24 two"
        />);
    }

    return (<>
        <input type="checkbox" id="map-modal" className="modal-toggle"/>
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <label htmlFor="map-modal"
                       className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                <div className="flex justify-center m-6">
                    <div>
                        <div className="flex pt-8 space-x-4 place-content-center">
                            <NewMap
                                latitude={currentLat}
                                longitude={currentLng}
                                zoomLevel={10}
                                addressLine={currentAddressL}
                                className="google-map large"
                            />
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="py-8 ">
            <div className="flex flex-col mb-1 sm:mb-0 justify-between w-full">
                <div className="w-full h-full p-1">
                    <div className="card shadow-xl bg-white">
                        {RenderFilters()}
                        <div className="card-body">
                            <div className="card-title grid justify-items-stretch">
                                <div className="justify-self-start">
                                    <h4>
                                        <>{t("farms")}</>
                                    </h4>
                                </div>

                                <div className="justify-self-end">
                                    <h4>
                                        <>
                                            {t("total")}: {farmsCount}
                                        </>
                                    </h4>
                                    <a className="link link-info">
                                        <ReactHTMLTableToExcel
                                            id="table-xls-button"
                                            className="download-xls-button"
                                            table="farms-list"
                                            filename={t("farms")}
                                            sheet={t("farms")}
                                            buttonText={"(".concat(t("download")).concat(")")}
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="overflow-x-scroll">
                                {farms === null ? (<NotFound msg="No se encontraron fincas"/>) : (<>
                                    <div className="text-center">
                                        <table
                                            className="farms-list w-full sm:bg-white rounded-lg overflow-hidden  my-5">
                                            <thead>
                                            <tr className="bg-amber-800 flex flex-col flex-no wrap text-white sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">

                                                <th className="p-3 text-center border-white border">
                                                    <>{t("name")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("height")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("area")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("certificates")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("varieties")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("location")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("shadow")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("family-members")}</>
                                                </th>
                                                <th className="p-3 text-center border-white border">
                                                    <>{t("ethnic-group")}</>
                                                </th>
                                                <th className="p-3 text-left border-white border text-light">
                                                    <>{t("coordinates")}</>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="flex-1 sm:flex-none">
                                            {farms.map((farmer: any, index: number) => RenderItem(farmer, index))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>)}
                            </div>
                            <div className="card-actions justify-center">

                                <CustomPagination
                                    pagination={pagination}
                                    onPageSelected={onPageSelected}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};
