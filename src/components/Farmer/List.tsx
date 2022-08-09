import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/esm/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../../styles/farmers.scss";
import Loading from "../Loading";
import { getAllFarmers } from "../../db/firebase";
import { useAuthContext } from "../../states/AuthContext";
import FormInput from "../common/FormInput";
import { CustomPagination } from "../common/Pagination";
import NotFound from "../common/NotFound";
import { getCompanyName } from "../../utils/utils";
import { GenderFilterList } from "../../utils/constants";

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
  const { authState } = useAuthContext();
  const [state] = authState;
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
  const [farmers2, setFarmers2] = useState<Array<FarmerType>>([]);
  const [farmersCount, setFarmersCount] = useState(0);
  const [pagination, setPagination] = useState(pagDefault);
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

  const RenderFilters = () => (
    <div className="filters">
      <FormInput
        label=""
        value={code}
        placeholder="Código"
        handleOnChange={handleCodeChange}
        errorMsg=""
      />
      <FormInput
        label=""
        value={name}
        placeholder="Nombre"
        handleOnChange={handleNameChange}
        errorMsg=""
      />
      <FormInput
        label=""
        value={location}
        placeholder="Ubicación"
        handleOnChange={handleLocationChange}
        errorMsg=""
      />
      <Dropdown onSelect={(eventKey) => handleGenderChange(eventKey || "all")}>
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
      <Button onClick={() => onSearchClick()}>Buscar</Button>
      <Button variant="secondary" onClick={() => onClearClick()}>
        Limpiar
      </Button>
    </div>
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
        <td>{farmer.farmerId}</td>
        <td>
          <a href={farmerUrl} target="_blank" rel="noreferrer">
            {farmer.fullname}
          </a>
        </td>
        <td>{farmer.gender === "male" ? "Masculino" : "Femenino"}</td>
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
    return <Loading label="Cargando..." className="loading-wrapper two" />;
  }

  return (
    <div className="farmers">
      <Card>
        <Card.Header>
          {RenderFilters()}
          <div className="totals">
            <h4>Total: {farmersCount}</h4>
            <ReactHTMLTableToExcel
              id="table-xls-button"
              className="download-xls-button"
              table="farmers-list"
              filename="Productores"
              sheet="Productores"
              buttonText="(Descargar)"
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
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Genero</th>
                    <th>Ubicación</th>
                    <th>Dirección de Cuenta</th>
                    <th className="th-bio">Biografía</th>
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
  );
};
