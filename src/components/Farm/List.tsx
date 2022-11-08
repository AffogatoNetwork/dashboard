import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Table from "react-bootstrap/esm/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useTranslation } from "react-i18next";
import "../../styles/farms.scss";
import Loading from "../Loading";
import Map from "../common/Map";
import { FarmType } from "../common/types";
import { getFarms } from "../../db/firebase";
import { useAuthContext } from "../../states/AuthContext";
import FormInput from "../common/FormInput";
import { CustomPagination } from "../common/Pagination";
import NotFound from "../common/NotFound";
import { SEARCH_DIVIDER } from "../../utils/constants";
import { getCompanyName } from "../../utils/utils";
import { SearchIcon } from "../icons/search";
import { ClearIcon } from "../icons/clear";
import Modal from "react-modal";

const pagDefault = {
  previous: 0,
  current: 0,
  next: 0,
  pages: 0,
  itemsPerPage: 15,
  itemsCount: 0,
  lastId: "0",
};

export const List = () => {
  const { t } = useTranslation();
  const { authState } = useAuthContext();
  const [state] = authState;
  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState<Array<FarmType>>([]);
  const [farms2, setFarms2] = useState<Array<FarmType>>([]);
  const [farmsCount, setFarmsCount] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [currentLat, setCurrentLat] = useState("0");
  const [currentLng, setCurrentLng] = useState("0");
  const [currentAddressL, setCurrentAddressL] = useState("");
  const [pagination, setPagination] = useState(pagDefault);
  const [searchCriteria, setSearchCriteria] = useState("");

  let subtitle: { style: { color: string; }; };
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
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
      ...pagination,
      previous: pageNumber === 1 ? 0 : pageNumber - 1,
      current: pageNumber,
      next: nextPage,
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
    setShowMap(true);
  };

  const RenderFilters = () => (
      <>
        <p className="text-lg"> <><>{t("search-farms")}</></> </p>

        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full pb-4">
                     <FormInput
              label=""
              value={searchCriteria}
              placeholder={t("search")}
              handleOnChange={handleSearchCriteriaChange}
              handleOnKeyDown={handleSearchCriteriaKeyDown}
              errorMsg=""
              className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
            />
                   <div>
            <div className="filters-buttons space-y-4">
              <button onClick={() => onSearchClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-amber-200 active:text-white focus:text-white
                                        focus:bg-amber-400 active:bg-amber-600">
                <SearchIcon className="w-4 h-4 mr-2"/>
                <>{t("search")}</>
              </button>
              <br/>
              <button  onClick={() => onClearClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-red-200 active:text-white focus:text-white
                                        focus:bg-red-400 active:bg-red-700">
                <ClearIcon className="w-4 h-4 mr-2"/>
                <>{t("clear")}</>
              </button>
            </div>
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
      <tr
        key={index}
        className={pagination.current === itemPage ? "show" : "hide"}
      >
        <td>{farm.name}</td>
        <td>
          {farm.height} <>{t("masl")}</>
        </td>
        <td>{farm.area}</td>
        <td>{farm.certifications}</td>
        <td>
          {farm.bio.length > 70
            ? farm.bio.slice(0, 70).concat("...")
            : farm.bio}
        </td>
        <td>{farm.varieties}</td>
        <td>{farm.location}</td>
        <td>{farm.shadow}</td>
        <td>{farm.familyMembers}</td>
        <td>{farm.ethnicGroup}</td>
        <td>
          <Button
            variant="secondary"
            className="text-light"
            onClick={() => {
              onMapBtnClick(farm.latitude, farm.longitude, farm.name)
              openModal()
            }}
          >
            <>{t("show-map")}</>
          </Button>
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
            className="map-modal"
            aria-labelledby="contained-modal-title-vcenter"
        >
          <button onClick={closeModal}> close</button>
          <br/>
          <div className="flex justify-center">
            <div>
              <Map
                  latitude={currentLat}
                  longitude={currentLng}
                  zoomLevel={10}
                  addressLine={currentAddressL}
                  className="google-map large"
              />
            </div>
          </div>
        </Modal>
      <div className="py-8">
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
          <div className="farms">
            {RenderFilters()}
            <Card>
              <Card.Header>
                <h4>
                  <>{t("farms")}</>
                </h4>
                <div className="totals">
                  <h4>
                    <>
                      {t("total")}: {farmsCount}
                    </>
                  </h4>
                  <ReactHTMLTableToExcel
                    id="table-xls-button"
                    className="download-xls-button"
                    table="farms-list"
                    filename={t("farms")}
                    sheet={t("farms")}
                    buttonText={"(".concat(t("download")).concat(")")}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                {farms === null ? (
                  <NotFound msg="No se encontraron fincas" />
                ) : (
                  <>
                    <Table id="farms-list" className="farms-list">
                      <thead>
                      <tr>
                        <th>
                          <>{t("name")}</>
                        </th>
                        <th>
                          <>{t("height")}</>
                        </th>
                        <th>
                          <>{t("certificates")}</>
                        </th>
                        <th>
                          <>{t("certificates")}</>
                        </th>
                        <th className="th-bio">
                          <>{t("bio")}</>
                        </th>
                        <th>
                          <>{t("varieties")}</>
                        </th>
                        <th>
                          <>{t("location")}</>
                        </th>
                        <th>
                          <>{t("shadow")}</>
                        </th>
                        <th>
                          <>{t("family-members")}</>
                        </th>
                        <th>
                          <>{t("ethnic-group")}</>
                        </th>
                        <th>
                          <>{t("coordinates")}</>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {farms.map((farmer: any, index: number) =>
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
