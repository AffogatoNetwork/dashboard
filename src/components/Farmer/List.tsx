import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Table from "react-bootstrap/esm/Table";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "../../styles/farmers.scss";
import Loading from "../Loading";
import { getAllFarmers } from "../../db/firebase";
import { useAuthContext } from "../../states/AuthContext";
import { CustomPagination } from "../common/Pagination";
import NotFound from "../common/NotFound";
import { getCompanyName } from "../../utils/utils";

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
  const { authState } = useAuthContext();
  const [state] = authState;
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<any>(null);
  const [farmersCount, setFarmersCount] = useState(0);
  const [pagination, setPagination] = useState(pagDefault);

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
        const signer = state.provider.getSigner();
        const address = await signer.getAddress();
        let companyName = getCompanyName(address);
        if (companyName === "") {
          companyName = "PROEXO";
        }
        await getAllFarmers(companyName).then((result) => {
          setFarmers(result);
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

  const RenderItem = (farmer: any, index: number) => {
    const itemPage = Math.ceil((index + 1) / pagination.itemsPerPage);
    // eslint-disable-next-line react/destructuring-assignment
    const farmerData = farmer.data();
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

    if (fullname === "" && farmerId === "") {
      return <></>;
    }
    const farmerUrl = window.location.origin.concat("/farmer/").concat(address);

    return (
      <tr
        key={index}
        className={pagination.current === itemPage ? "show" : "hide"}
      >
        <td>{farmerId}</td>
        <td>
          <a href={farmerUrl} target="_blank" rel="noreferrer">
            {fullname}
          </a>
        </td>
        <td>{bio.length > 70 ? bio.slice(0, 70).concat("...") : bio}</td>
        <td>{gender === "male" ? "Masculino" : "Femenino"}</td>
        <td>
          {village}, {region}, {country}
        </td>
        <td>{address}</td>
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
          <div>
            <h2>Produtores</h2>
          </div>
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
                    <th>Id</th>
                    <th>Nombre</th>
                    <th className="th-bio">Biografía</th>
                    <th>Genero</th>
                    <th>Ubicación</th>
                    <th>Dirección de Cuenta</th>
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
