import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import "../styles/company.scss";
import Logo from "../assets/affogato-horizontal.png";
import Loading from "./Loading";
import Map from "./common/Map";
import NotFound from "./NotFound";
import { getCompany } from "../db/firebase";

const Company = () => {
  const { companyId } = useParams();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>();

  useEffect(() => {
    const load = async () => {
      if (companyId) {
        await getCompany(companyId).then((result) => {
          setCompanyData(result);
        });
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [companyId]);

  if (loading) {
    return <Loading label="Cargando..." />;
  }

  if (companyData === null) {
    return <NotFound msg="No se encontró la Empresa." />;
  }

  return (
    <div className="company">
      <Card className="general">
        <Card.Header>
          <Image className="pic" />
        </Card.Header>
        <Card.Body>
          <div className="info-container">
            <div className="farmer-detail">
              {companyData && companyData.name && (
                <div className="info">
                  <h6 className="bio">Empresa</h6>
                  <span className="text-light">{companyData.name}</span>
                </div>
              )}
              {companyData &&
                companyData.socialReason &&
                companyData.productiveAreas && (
                  <div className="info-row">
                    <div className="info">
                      <h6 className="bio">Razón Social</h6>
                      <span className="text-light">
                        {companyData.socialReason}
                      </span>
                    </div>
                    <div className="info">
                      <h6 className="bio">Areas Productivas</h6>
                      <span className="text-light">
                        {companyData.productiveAreas}
                      </span>
                    </div>
                  </div>
                )}
              {companyData && companyData.review && (
                <div className="info">
                  <h6 className="bio">Reseña</h6>
                  <span className="text-light">{companyData.review}</span>
                </div>
              )}
              {companyData && companyData.products && (
                <div className="info">
                  <h6 className="bio">Productos</h6>
                  <span className="text-light">
                    {companyData.products.join(", ")}
                  </span>
                </div>
              )}
              {companyData &&
                companyData.femalePartners &&
                companyData.malePartners && (
                  <div className="info-row">
                    <div className="info">
                      <h6 className="bio">Socios Mujeres</h6>
                      <span className="text-light">
                        {companyData.femalePartners}
                      </span>
                    </div>
                    <div className="info">
                      <h6 className="bio">Socios Hombres</h6>
                      <span className="text-light">
                        {companyData.malePartners}
                      </span>
                    </div>
                  </div>
                )}
              {companyData && companyData.avgCupProfile && (
                <div className="info">
                  <h6 className="bio">Promedio de Perfil de taza</h6>
                  <span className="text-light">
                    {companyData.avgCupProfile}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <Image src={Logo} className="logo" />
        </Card.Footer>
      </Card>
      <div className="boxes">
        <div className="box cupprofile">
          <div className="items">
            {companyData.managerName && (
              <div className="item">
                <h6 className="title">Nombre del Gerente</h6>
                <span className="text-light">{companyData.managerName}</span>
              </div>
            )}
            {companyData.cellphone && (
              <div className="item">
                <h6 className="title">No. de Celular</h6>
                <span className="text-light">{companyData.cellphone}</span>
              </div>
            )}
            {companyData.email && (
              <div className="item">
                <h6 className="title">Correo Electrónico</h6>
                <span className="text-light">{companyData.email}</span>
              </div>
            )}
            {companyData.website && (
              <div className="item">
                <h6 className="title">Sitio Web</h6>
                <span className="text-light">{companyData.website}</span>
              </div>
            )}
            {companyData.addressLine && (
              <div className="item">
                <h6 className="title">Dirección</h6>
                <span className="text-light">{companyData.addressLine}</span>
              </div>
            )}
            {companyData.socialNetworks && (
              <div className="item">
                <h6 className="title">Redes Sociales</h6>
                <span className="text-light">
                  {companyData.socialNetworks.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
        {companyData &&
          companyData.latitude !== "" &&
          companyData.longitude !== "" && (
            <div className="map-container">
              <Map
                latitude={companyData.latitude}
                longitude={companyData.longitude}
                zoomLevel={9}
                addressLine={companyData.name}
                className="google-map"
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Company;
