import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import "../../styles/coffeecard.scss";
import Logo from "../../assets/affogato-horizontal.png";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { AttributesType, CoffeeBatchType } from "../common/types";
import { ipfsUrl } from "../../utils/constants";

const CoffeeCard = () => {
  const { ipfsHash } = useParams();
  const [loading, setLoading] = useState(true);
  const [coffeeBatch, setCoffeeBatch] = useState<CoffeeBatchType | null>(null);

  useEffect(() => {
    const load = () => {
      if (ipfsHash) {
        const url = ipfsUrl.concat(ipfsHash);
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const attrs = new Array<AttributesType>();
            const cupProfile = {
              aroma: "-",
              notes: "-",
              body: "-",
              acidity: "-",
            };
            for (let i = 0; i < data.attributes.length; i += 1) {
              if (data.attributes[i].trait_type.toLowerCase() !== "profile") {
                attrs.push({
                  title: data.attributes[i].trait_type,
                  value: data.attributes[i].value,
                });
              } else {
                const cupp = data.attributes[i].value;
                for (let j = 0; j < cupp.length; j += 1) {
                  if (j === 0) {
                    cupProfile.aroma = cupp[j].aroma;
                  } else if (j === 2) {
                    cupProfile.body = cupp[j].body;
                  } else if (i === 1) {
                    cupProfile.notes = cupp[j].notes;
                  } else if (j === 3) {
                    cupProfile.acidity = cupp[j].acidity;
                  }
                }
              }
            }
            const coffeeB = {
              id: 0,
              name: data.name,
              description: data.description,
              image: data.image,
              ipfsHash,
              attributes: attrs,
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

  const sanitaze = (value: string): string => {
    if (typeof value !== "number") {
      if (value !== "undefined" && value.trim() === "") {
        return "-";
      }
    }
    return value;
  };

  const getAttribute = (type: string): string => {
    let attr = "-";
    if (coffeeBatch !== null) {
      for (let i = 0; i < coffeeBatch.attributes.length; i += 1) {
        const title = coffeeBatch.attributes[i].title.toLowerCase();
        if (title === type) {
          attr = sanitaze(coffeeBatch.attributes[i].value);
        }
      }
    }
    return attr;
  };

  if (loading) {
    return <Loading label="Cargando..." />;
  }

  if (coffeeBatch === null) {
    return <NotFound msg="No se encontró el lote de café." />;
  }

  return (
    <div className="coffeebatch">
      <Card>
        <Card.Header />
        <Card.Body>
          <div className="batch-header">
            <div className="batch-detail">
              <div className="info">
                <h6 className="bio">Biografía</h6>
                <span className="text-light">{coffeeBatch.description}</span>
              </div>
              <div className="location">
                <h6 className="bio">Región</h6>
                <span className="text-light">
                  {getAttribute("village")}, {getAttribute("region")},{" "}
                  {getAttribute("country")}
                </span>
              </div>
            </div>
          </div>
          <div className="box-container">
            <div className="box detail">
              <div className="items">
                <div className="item">
                  <h6 className="title">Altitud</h6>
                  <span className="text-light">
                    {getAttribute("altitude")}{" "}
                    {getAttribute("altitude") === "-" ? "" : "MSNM"}
                  </span>
                </div>
                <div className="item">
                  <h6 className="title">Variedad</h6>
                  <span className="text-light">{getAttribute("variety")}</span>
                </div>
                <div className="item">
                  <h6 className="title">Proceso</h6>
                  <span className="text-light">{getAttribute("process")}</span>
                </div>
                <div className="item">
                  <h6 className="title">Tamaño</h6>
                  <span className="text-light">{getAttribute("size")} Lbs</span>
                </div>
              </div>
            </div>
            <div className="box cupprofile">
              <div className="items">
                <div className="item">
                  <h6 className="title">Aroma</h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.aroma}
                  </span>
                </div>
                <div className="item">
                  <h6 className="title">Cuerpo</h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.body}
                  </span>
                </div>
                <div className="item">
                  <h6 className="title">Acidez</h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.acidity}
                  </span>
                </div>
                <div className="item">
                  <h6 className="title">Nota</h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.notes}
                  </span>
                </div>
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

export default CoffeeCard;
