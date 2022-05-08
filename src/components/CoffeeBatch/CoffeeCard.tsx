import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import "../../styles/coffeecard.scss";
import Logo from "../../assets/logo.png";
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
              aroma: 0,
              notes: 0,
              body: 0,
              acidity: 0,
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
                  const { key, val } = cupp[j];
                  if (key === "aroma") {
                    cupProfile.aroma = val;
                  } else if (key === "body") {
                    cupProfile.body = val;
                  } else if (key === "notes") {
                    cupProfile.notes = val;
                  } else if (key === "acidity") {
                    cupProfile.acidity = val;
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
  });

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
        <Card.Header>
          <Image src={Logo} className="nft" />
        </Card.Header>
        <Card.Body>
          <div className="batch-detail">
            <div className="info">
              <div className="name">
                <span>{coffeeBatch.name}</span>
              </div>
              <div className="description">
                <span>{coffeeBatch.description}</span>
              </div>
            </div>
            <div className="location">
              <h6>Ubicación:</h6>
              <span>
                {getAttribute("village")}, {getAttribute("region")},
                {getAttribute("country")}
              </span>
            </div>
          </div>
          <div className="detail">
            <h5>Detalle de Lote</h5>
            <div className="items">
              <div className="item">
                <h6>Altitud:</h6>
                <span>{getAttribute("altitud")}</span>
              </div>
              <div className="item">
                <h6>Variedad:</h6>
                <span>{getAttribute("variety")}</span>
              </div>
              <div className="item">
                <h6>Proceso:</h6>
                <span>{getAttribute("process")}</span>
              </div>
              <div className="item">
                <h6>Tamaño:</h6>
                <span>{getAttribute("size")}</span>
              </div>
            </div>
          </div>
          <div className="cupprofile">
            <h5>Perfil de Taza</h5>
            <div className="items">
              <div className="item">
                <h6>Aroma:</h6>
                <span>{coffeeBatch.cupProfile.aroma}</span>
              </div>
              <div className="item">
                <h6>Cuerpo:</h6>
                <span>{coffeeBatch.cupProfile.body}</span>
              </div>
              <div className="item">
                <h6>Acidez:</h6>
                <span>{coffeeBatch.cupProfile.acidity}</span>
              </div>
              <div className="item">
                <h6>Nota:</h6>
                <span>{coffeeBatch.cupProfile.notes}</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CoffeeCard;
