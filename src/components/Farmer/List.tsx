import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/esm/Modal";
import QRCode from "react-qr-code";
import Table from "react-bootstrap/esm/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useTranslation } from "react-i18next";
import "../../styles/farmers.scss";
import Loading from "../Loading";
import { getAllFarmers } from "../../db/firebase";
import { useAuthContext } from "../../states/AuthContext";
import FormInput from "../common/FormInput";
import { CustomPagination } from "../common/Pagination";
import NotFound from "../common/NotFound";
import { getCompanyName } from "../../utils/utils";
import { GenderFilterList } from "../../utils/constants";

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
};

export const List = () => {
  const { t } = useTranslation();
  const { authState } = useAuthContext();
  const [state] = authState;
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
  const [farmers2, setFarmers2] = useState<Array<FarmerType>>([]);
  const [farmersCount, setFarmersCount] = useState(0);
  const [pagination, setPagination] = useState(pagDefault);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [currentGender, setCurrentGender] = useState(GenderFilterList[0]);

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
      if (state.provider !== null) {
        const farmerList = new Array<FarmerType>();
        const signer = state.provider.getSigner();
        const sAddress = await signer.getAddress();
        let companyName = getCompanyName(sAddress);
        if (companyName === "") {
          companyName = "PROEXO";
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
            farmerList.push({
              farmerId,
              address,
              fullname,
              bio,
              gender,
              location: l,
            });
          }
          setFarmers(farmerList);
          setFarmers2(farmerList);
          confPagination(result, 15);
          // calculateFarmersCount(result);
        });
        setLoading(false);
      }
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

  const filterByCode = (f: FarmerType) => {
    const fId = f.farmerId.toLowerCase();
    return fId.includes(code.toLowerCase());
  };

  const filterByName = (f: FarmerType) => {
    const fname = f.fullname.toLowerCase();
    return fname.includes(name.toLowerCase());
  };

  const filterByLocation = (f: FarmerType) => {
    const fLocation = f.location.toLowerCase();
    return fLocation.includes(location.toLowerCase());
  };

  const filterByGender = (f: FarmerType) => {
    const fgender = f.gender.toLowerCase();
    return fgender === currentGender.key;
  };

  const filterFarmers = () => {
    let farmerList = farmers2.slice();
    if (code.trim().length > 0) {
      farmerList = farmerList.filter(filterByCode);
    }
    if (name.trim().length > 0) {
      farmerList = farmerList.filter(filterByName);
    }
    if (location.trim().length > 0) {
      farmerList = farmerList.filter(filterByLocation);
    }
    if (currentGender.key !== "all") {
      farmerList = farmerList.filter(filterByGender);
    }

    setFarmers(farmerList);
    confPagination(farmerList, 15);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setCode(input);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setName(input);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLocation(input);
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
    setCode("");
    setName("");
    setLocation("");
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
    <Card className="filters">
      <Card.Body>
        <div className="filters-inputs">
          <FormInput
            label=""
            value={code}
            placeholder={t("code")}
            handleOnChange={handleCodeChange}
            errorMsg=""
          />
          <FormInput
            label=""
            value={name}
            placeholder={t("name")}
            handleOnChange={handleNameChange}
            errorMsg=""
          />
          <FormInput
            label=""
            value={location}
            placeholder={t("location")}
            handleOnChange={handleLocationChange}
            errorMsg=""
          />
          <Dropdown
            onSelect={(eventKey) => handleGenderChange(eventKey || "all")}
          >
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-cooperative"
              className="text-left"
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
        <div className="filters-buttons">
          <Button onClick={() => onSearchClick()}>
            <>{t("search")}</>
          </Button>
          <Button variant="secondary" onClick={() => onClearClick()}>
            <>{t("clear")}</>
          </Button>
        </div>
      </Card.Body>
    </Card>
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
            <Button
              className="qrcode-btn"
              onClick={() => {
                setQrCodeUrl(farmerUrl);
                setShowModal(true);
              }}
            >
              <QRCode value={farmerUrl} size={60} />
            </Button>
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

  const RenderModal = () => (
    <Modal
      show={showModal}
      size="lg"
      className="qr-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => setShowModal(false)}
    >
      <Modal.Body className="">
        <QRCode id="current-qr" value={qrCodeUrl} size={600} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleOnDownloadClick}>
          <>{t("download")}</>
        </Button>
        <Button variant="primary" target="_blank" href={qrCodeUrl}>
          <>{t("open-link")}</>
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <Loading
        label={t("loading").concat("...")}
        className="loading-wrapper two"
      />
    );
  }

  return (
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
            <NotFound msg="No se encontraron productores" />
          ) : (
            <>
              <Table id="farmers-list" className="farmers-list">
                <thead>
                  <tr>
                    <th />
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
      {RenderModal()}
    </div>
  );
};
