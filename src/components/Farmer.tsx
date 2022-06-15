import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import "../styles/farmer.scss";
import Logo from "../assets/affogato-horizontal.png";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { getFarmer, getImageUrl } from "../db/firebase";

const Farmer = () => {
  const { farmerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState<any>();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      if (farmerId) {
        await getFarmer(farmerId).then((result) => {
          setFarmerData(result);
        });
        await getImageUrl(farmerId).then((result) => {
          setImageUrl(result);
        });
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [farmerId]);

  if (loading) {
    return <Loading label="Cargando..." />;
  }

  if (farmerData === null) {
    return <NotFound msg="No se encontró el Productor." />;
  }

  return (
    <div className="farmer">
      <Card className="general">
        <Card.Header>
          <Image src={imageUrl} className="pic" />
        </Card.Header>
        <Card.Body>
          <div className="info-container">
            <div className="farmer-detail">
              {farmerData && farmerData.fullname && (
                <div className="info">
                  <h6 className="bio">Productor</h6>
                  <span className="text-light">{farmerData.fullname}</span>
                </div>
              )}
              {farmerData && farmerData.gender && (
                <div className="info">
                  <h6 className="bio">Genero</h6>
                  <span className="text-light">
                    {farmerData.gender === "male" ? "Masculino" : "Femenino"}
                  </span>
                </div>
              )}
              {farmerData && farmerData.bio && (
                <div className="info">
                  <h6 className="bio">Biografía</h6>
                  <span className="text-light">{farmerData.bio}</span>
                </div>
              )}
              {farmerData && farmerData.company && (
                <div className="info">
                  <h6 className="bio">Empresa</h6>
                  <span className="text-light">{farmerData.company}</span>
                </div>
              )}
              <div className="location">
                {farmerData && farmerData.region && (
                  <>
                    <div>
                      <h6 className="bio mt-2">Ubicación</h6>
                      <span className="text-light">
                        {farmerData.village}, {farmerData.region}
                      </span>
                    </div>
                    <div>
                      <h6 className="bio mt-2">País</h6>
                      <span className="text-light">{farmerData.country}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <Image src={Logo} className="logo" />
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Farmer;
