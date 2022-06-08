import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import "../../styles/coffeecard.scss";
import Logo from "../../assets/affogato-horizontal.png";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { CoffeeBatchType } from "../common/types";
import { ipfsUrl } from "../../utils/constants";
import { getFarmer } from "../../db/firebase";

const CoffeeCard = () => {
  const { ipfsHash } = useParams();
  const [loading, setLoading] = useState(true);
  const [coffeeBatch, setCoffeeBatch] = useState<CoffeeBatchType | null>(null);
  const [farmerData, setFarmerData] = useState<any>();

  useEffect(() => {
    const load = () => {
      if (ipfsHash) {
        const url = ipfsUrl.concat(ipfsHash);
        fetch(url)
          .then((response) => response.json())
          .then(async (jsonData) => {
            let farmer = {};
            let farm = {};
            let batch = {};
            let exportBatch = {};
            let cupProfile = {};
            let wetMill = {};
            let dryMill = {};
            let certification = {};
            for (let i = 0; i < jsonData.attributes.length; i += 1) {
              const traitType = jsonData.attributes[i].trait_type.toLowerCase();
              if (traitType === "farmer") {
                farmer = await jsonData.attributes[i].value;
                console.log(farmer);
                getFarmer(await jsonData.attributes[i].value).then((result) => {
                  console.log(result);
                  setFarmerData(result);
                });
              }
              if (traitType === "farm") {
                [farm] = jsonData.attributes[i].value;
              }
              if (traitType === "batch") {
                [batch] = jsonData.attributes[i].value;
              }
              if (traitType === "export") {
                [exportBatch] = jsonData.attributes[i].value;
              }
              if (traitType === "profile") {
                [cupProfile] = jsonData.attributes[i].value;
              }
              if (traitType === "wet mill") {
                [wetMill] = jsonData.attributes[i].value;
              }
              if (traitType === "dry mill") {
                [dryMill] = jsonData.attributes[i].value;
              }
              if (traitType === "certification") {
                [certification] = jsonData.attributes[i].value;
              }
            }
            const coffeeB = {
              id: 0,
              name: jsonData.name,
              description: jsonData.description,
              image: "https://gateway.pinata.cloud/ipfs/".concat(
                jsonData.image
              ),
              ipfsHash,
              farmer,
              farm,
              batch,
              wetMill,
              dryMill,
              certification,
              exportBatch,
              cupProfile,
            };
            setCoffeeBatch(coffeeB);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    };
    load();
  }, [ipfsHash]);

  if (loading) {
    return <Loading label="Cargando..." />;
  }

  if (coffeeBatch === null) {
    return <NotFound msg="No se encontró el lote de café." />;
  }

  return (
    <div className="coffeebatch">
      <Card className="general">
        <Card.Header>
          <Image src={coffeeBatch.image} className="nft" />
        </Card.Header>
        <Card.Body>
          <div className="batch-header">
            <div className="batch-detail">
              <div className="info">
                <h6 className="bio">Productor</h6>
                <span className="text-light">
                  {farmerData && farmerData.fullname}
                </span>
              </div>
              <div className="info">
                <h6 className="bio">Biografía</h6>
                <span className="text-light">
                  {farmerData && farmerData.bio}
                </span>
              </div>
              <div className="location">
                <h6 className="bio">Historia de Finca</h6>
                <span className="text-light">{coffeeBatch.farm.story}</span>
              </div>
              <div className="location">
                <h6 className="bio">Ubicación</h6>
                <span className="text-light">
                  {coffeeBatch.farm.village}, {coffeeBatch.farm.region},{" "}
                  {coffeeBatch.farm.country}
                </span>
                <h6 className="bio mt-2">Altitud</h6>
                <span className="text-light">
                  {coffeeBatch.farm.altitude} MSNM
                </span>
              </div>
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
            <div className="item">
              <h6 className="title">Id de Lote</h6>
              <span className="text-light">{coffeeBatch.dryMill.batch_id}</span>
            </div>
            <div className="item">
              <h6 className="title">Variedad</h6>
              <span className="text-light">{coffeeBatch.wetMill.variety}</span>
            </div>
            <div className="item">
              <h6 className="title">Proceso</h6>
              <span className="text-light">{coffeeBatch.wetMill.process}</span>
            </div>
            <div className="item">
              <h6 className="title">Tamaño</h6>
              <span className="text-light">
                {coffeeBatch.dryMill.weight} QQ
              </span>
            </div>
            <div className="item">
              <h6 className="title">Certificaciones</h6>
              <span className="text-light">
                {coffeeBatch.certification.type}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Aroma</h6>
              <span className="text-light">{coffeeBatch.cupProfile.aroma}</span>
            </div>
            <div className="item">
              <h6 className="title">Acidez</h6>
              <span className="text-light">
                {coffeeBatch.cupProfile.acidity}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Post Gusto</h6>
              <span className="text-light">
                {coffeeBatch.cupProfile.aftertaste}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Cuerpo</h6>
              <span className="text-light">{coffeeBatch.cupProfile.body}</span>
            </div>
            <div className="item">
              <h6 className="title">Sabor</h6>
              <span className="text-light">
                {coffeeBatch.cupProfile.flavor}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Dulzura</h6>
              <span className="text-light">
                {coffeeBatch.cupProfile.sweetness}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Nota</h6>
              <span className="text-light">{coffeeBatch.cupProfile.note}</span>
            </div>
          </div>
        </div>
        <div className="box wetMill">
          <div className="items">
            <div className="item">
              <h6 className="title">Instalación</h6>
              <span className="text-light">{coffeeBatch.wetMill.facility}</span>
            </div>
            <div className="item">
              <h6 className="title">Fecha</h6>
              <span className="text-light">{coffeeBatch.wetMill.date}</span>
            </div>
            <div className="item">
              <h6 className="title">Proceso</h6>
              <span className="text-light">{coffeeBatch.wetMill.process}</span>
            </div>
            <div className="item">
              <h6 className="title">Peso</h6>
              <span className="text-light">{coffeeBatch.wetMill.weight}</span>
            </div>
            <div className="item">
              <h6 className="title">Nota</h6>
              <span className="text-light">{coffeeBatch.wetMill.note}</span>
            </div>
          </div>
        </div>
        <div className="box dryMill">
          <div className="items">
            <div className="item">
              <h6 className="title">Instalación</h6>
              <span className="text-light">{coffeeBatch.dryMill.facility}</span>
            </div>
            <div className="item">
              <h6 className="title">Fecha</h6>
              <span className="text-light">{coffeeBatch.dryMill.date}</span>
            </div>
            <div className="item">
              <h6 className="title">Porcentaje de Daño</h6>
              <span className="text-light">
                {coffeeBatch.dryMill.damage_percent}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Rendimiento de Trilla</h6>
              <span className="text-light">
                {coffeeBatch.dryMill.threshing_yield}
              </span>
            </div>
            <div className="item">
              <h6 className="title">Peso</h6>
              <span className="text-light">{coffeeBatch.dryMill.weight}</span>
            </div>
            <div className="item">
              <h6 className="title">Nota</h6>
              <span className="text-light">{coffeeBatch.dryMill.note}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;
