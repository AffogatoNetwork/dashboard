import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Image from "react-bootstrap/esm/Image";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import "../../styles/coffeecard.scss";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import MapModal from "../common/MapModal";
import { CoffeeBatchType } from "../common/types";
import { ipfsUrl } from "../../utils/constants";
import { getFarmer } from "../../db/firebase";

const CoffeeCard = () => {
  const { t } = useTranslation();
  const { ipfsHash } = useParams();
  const [loading, setLoading] = useState(true);
  const [coffeeBatch, setCoffeeBatch] = useState<CoffeeBatchType | null>(null);
  const [farmerData, setFarmerData] = useState<any>();
  const [showMap, setShowMap] = useState(false);
  const [currentLat, setCurrentLat] = useState("0");
  const [currentLng, setCurrentLng] = useState("0");
  const [currentAddressL, setCurrentAddressL] = useState("");

  useEffect(() => {
    const load = () => {
      if (ipfsHash) {
        const url = ipfsUrl.concat(ipfsHash);
        fetch(url)
          .then((response) => response.json())
          .then(async (jsonData) => {
            let farmer = {};
            let farm = {};
            let cupProfile = {};
            let wetMill = {};
            let dryMill = {};
            for (let i = 0; i < jsonData.attributes.length; i += 1) {
              const traitType = jsonData.attributes[i].trait_type.toLowerCase();
              if (traitType === "farmer") {
                farmer = await jsonData.attributes[i].value;
                getFarmer(await jsonData.attributes[i].value).then((result) => {
                  setFarmerData(result);
                });
              }
              if (traitType === "farm") {
                [farm] = jsonData.attributes[i].value;
              }
              if (traitType === "profile") {
                [cupProfile] = jsonData.attributes[i].value;
              }
              if (traitType === "wet mill") {
                [wetMill] = jsonData.attributes[i].value;
                console.log(wetMill);
              }
              if (traitType === "dry mill") {
                [dryMill] = jsonData.attributes[i].value;
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
              wetMill,
              dryMill,
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
    // eslint-disable-next-line
  }, [ipfsHash]);

  if (loading) {
    return <Loading label="Cargando..." className="loading-wrapper" />;
  }

  if (coffeeBatch === null) {
    return <NotFound msg="No se encontró el lote de café." />;
  }

  const onMapBtnClick = (lat: string, lng: string, adressL: string) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    setCurrentAddressL(adressL);
    setShowMap(true);
  };

  return (
    <div className="coffeebatch">
      <Card className="general">
        <Card.Header>
          <Image src={coffeeBatch.image} className="nft" />
        </Card.Header>
        <Card.Body>
          <div className="batch-header">
            <div className="batch-detail">
              {!!farmerData && !!farmerData.fullname && (
                <div className="info">
                  <h6 className="bio">
                    <>{t("farmer")}</>
                  </h6>
                  <span className="text-light">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={window.location.origin
                        .concat("/farmer/")
                        .concat(farmerData.address)}
                    >
                      {farmerData.fullname}{" "}
                    </a>
                  </span>
                </div>
              )}
              {!!farmerData && !!farmerData.bio && (
                <div className="info">
                  <h6 className="bio">
                    <>{t("bio")}</>
                  </h6>
                  <span className="text-light">{farmerData.bio}</span>
                </div>
              )}
              {!!coffeeBatch.farm.name && (
                <div className="location">
                  <h6 className="bio">
                    <>{t("farm-name")}</>
                  </h6>
                  <span className="text-light">{coffeeBatch.farm.name}</span>
                </div>
              )}
              {(!!coffeeBatch.farm.etnic_group ||
                !!coffeeBatch.farm.family_members) && (
                <div className="info-row">
                  <div className="item">
                    <h6 className="bio mt-2">
                      <>{t("ethnic-group")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.farm.etnic_group}
                    </span>
                  </div>
                  <div className="item">
                    <h6 className="bio mt-2">
                      <>{t("family-members")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.farm.family_members}
                    </span>
                  </div>
                  <div className="item">
                    <h6 className="bio mt-2">
                      <>{t("shadow")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.farm.shadow}
                    </span>
                  </div>
                </div>
              )}
              {!!coffeeBatch.farm.story && (
                <div className="location">
                  <h6 className="bio">
                    <>{t("farm-history")}</>
                  </h6>
                  <span className="text-light">{coffeeBatch.farm.story}</span>
                </div>
              )}
              {(!!coffeeBatch.farm.certifications ||
                !!coffeeBatch.farm.varieties) && (
                <div className="info-row">
                  <div className="item">
                    <h6 className="bio mt-2">
                      <>{t("certificates")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.farm.certifications}
                    </span>
                  </div>
                  <div className="item right">
                    <h6 className="bio mt-2">
                      <>{t("varieties")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.farm.varieties}
                    </span>
                  </div>
                </div>
              )}
              <div className="location">
                {!!coffeeBatch.farm.village && (
                  <div className="info-row">
                    <div className="item">
                      <h6 className="bio">
                        <>{t("location")}</>
                      </h6>
                      <span className="text-light">
                        {coffeeBatch.farm.village}, {coffeeBatch.farm.region},{" "}
                        {coffeeBatch.farm.country}
                      </span>
                    </div>
                    <div className="item right">
                      <h6 className="bio mt-2">
                        <>{t("altitude")}</>
                      </h6>
                      <span className="text-light">
                        {coffeeBatch.farm.altitude} <>{t("masl")}</>
                      </span>
                    </div>
                  </div>
                )}
                {!!coffeeBatch.farm.area && (
                  <div className="info-row">
                    <div className="item">
                      <h6 className="bio mt-2">
                        <>{t("area")}</>
                      </h6>
                      <span className="text-light">
                        {coffeeBatch.farm.area}
                      </span>
                    </div>
                    {!!coffeeBatch.farm.latitude &&
                      !!coffeeBatch.farm.longitude && (
                        <div className="item right">
                          <h6 className="bio mt-2">
                            <>{t("coordinates")}</>
                          </h6>
                          <Button
                            variant="secondary"
                            className="text-light"
                            onClick={() =>
                              onMapBtnClick(
                                coffeeBatch.farm.latitude,
                                coffeeBatch.farm.longitude,
                                coffeeBatch.farm.name
                              )
                            }
                          >
                            <>{t("show-map")}</>
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <div className="boxes">
        {(!!coffeeBatch.wetMill.variety ||
          !!coffeeBatch.wetMill.process ||
          !!coffeeBatch.wetMill.certifications ||
          !!coffeeBatch.cupProfile.aroma ||
          !!coffeeBatch.cupProfile.acidity ||
          !!coffeeBatch.cupProfile.aftertaste ||
          !!coffeeBatch.cupProfile.body ||
          !!coffeeBatch.cupProfile.flavor ||
          !!coffeeBatch.cupProfile.sweetness ||
          !!coffeeBatch.cupProfile.note) && (
          <div className="box cupprofile">
            <div className="items">
              {!!coffeeBatch.wetMill.variety && (
                <div className="item">
                  <h6 className="title">
                    <>{t("vavriety")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.variety}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.process && (
                <div className="item">
                  <h6 className="title">
                    <>{t("process")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.process}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.certifications && (
                <div className="item">
                  <h6 className="title">
                    <>{t("certificates")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.certifications}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.aroma && (
                <div className="item">
                  <h6 className="title">
                    <>{t("aroma")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.aroma}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.acidity && (
                <div className="item">
                  <h6 className="title">
                    <>{t("acidity")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.acidity}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.aftertaste && (
                <div className="item">
                  <h6 className="title">
                    <>{t("aftertaste")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.aftertaste}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.body && (
                <div className="item">
                  <h6 className="title">
                    <>{t("body")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.body}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.flavor && (
                <div className="item">
                  <h6 className="title">
                    <>{t("flavor")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.flavor}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.sweetness && (
                <div className="item">
                  <h6 className="title">
                    <>{t("sweetness")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.sweetness}
                  </span>
                </div>
              )}
              {!!coffeeBatch.cupProfile.note && (
                <div className="item">
                  <h6 className="title">
                    <>{t("note")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.cupProfile.note}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {(!!coffeeBatch.wetMill.drying_id ||
          !!coffeeBatch.wetMill.quality ||
          !!coffeeBatch.wetMill.process ||
          !!coffeeBatch.wetMill.drying_type ||
          !!coffeeBatch.wetMill.drying_hours ||
          (!!coffeeBatch.wetMill.date &&
            coffeeBatch.wetMill.date !== "1970-01-01") ||
          !!coffeeBatch.wetMill.facility ||
          !!coffeeBatch.wetMill.weight ||
          !!coffeeBatch.wetMill.note) && (
          <div className="box wetMill">
            <div className="items">
              {!!coffeeBatch.wetMill.drying_id && (
                <div className="item">
                  <h6 className="title">
                    <>{t("batch-id")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.drying_id}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.quality && (
                <div className="item">
                  <h6 className="title">
                    <>{t("quality")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.quality}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.process && (
                <div className="item">
                  <h6 className="title">
                    <>{t("process")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.process}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.drying_type && (
                <div className="item">
                  <h6 className="title">
                    <>{t("drying-type")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.drying_type}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.drying_hours && (
                <div className="item">
                  <h6 className="title">
                    <>{t("drying-hours")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.drying_hours}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.date &&
                coffeeBatch.wetMill.date !== "1970-01-01" && (
                  <div className="item">
                    <h6 className="title">
                      <>{t("entry-date")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.wetMill.date}
                    </span>
                  </div>
                )}
              {!!coffeeBatch.wetMill.facility && (
                <div className="item">
                  <h6 className="title">
                    <>{t("facility")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.facility}
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.latitude &&
                !!coffeeBatch.wetMill.longitude && (
                  <div className="item">
                    <h6 className="title">
                      <>{t("location")}</>
                    </h6>
                    <Button
                      variant="secondary"
                      className="text-light"
                      onClick={() =>
                        onMapBtnClick(
                          coffeeBatch.wetMill.latitude,
                          coffeeBatch.wetMill.longitude,
                          ""
                        )
                      }
                    >
                      <>{t("show-map")}</>
                    </Button>
                  </div>
                )}
              {!!coffeeBatch.wetMill.weight && (
                <div className="item">
                  <h6 className="title">Peso</h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.weight} QQ
                  </span>
                </div>
              )}
              {!!coffeeBatch.wetMill.note && (
                <div className="item">
                  <h6 className="title">
                    <>{t("note")}</>
                  </h6>
                  <span className="text-light">{coffeeBatch.wetMill.note}</span>
                </div>
              )}
            </div>
          </div>
        )}
        {(!!coffeeBatch.dryMill.export_id ||
          (!!coffeeBatch.dryMill.date &&
            coffeeBatch.dryMill.date !== "1970-01-01") ||
          !!coffeeBatch.dryMill.facility ||
          !!coffeeBatch.dryMill.drying_type ||
          !!coffeeBatch.dryMill.damage_percent ||
          !!coffeeBatch.dryMill.threshing_yield ||
          !!coffeeBatch.dryMill.weight ||
          !!coffeeBatch.dryMill.note) && (
          <div className="box dryMill">
            <div className="items">
              {!!coffeeBatch.dryMill.export_id && (
                <div className="item">
                  <h6 className="title">
                    <>{t("exporting-code")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.export_id}
                  </span>
                </div>
              )}

              {!!coffeeBatch.dryMill.date &&
                coffeeBatch.dryMill.date !== "1970-01-01" && (
                  <div className="item">
                    <h6 className="title">
                      <>{t("date")}</>
                    </h6>
                    <span className="text-light">
                      {coffeeBatch.dryMill.date}
                    </span>
                  </div>
                )}

              {!!coffeeBatch.dryMill.facility && (
                <div className="item">
                  <h6 className="title">
                    <>{t("facility")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.facility}
                  </span>
                </div>
              )}
              {!!coffeeBatch.dryMill.latitude &&
                !!coffeeBatch.dryMill.longitude && (
                  <div className="item">
                    <h6 className="title">
                      <>{t("location")}</>
                    </h6>
                    <Button
                      variant="secondary"
                      className="text-light"
                      onClick={() =>
                        onMapBtnClick(
                          coffeeBatch.dryMill.latitude,
                          coffeeBatch.dryMill.longitude,
                          ""
                        )
                      }
                    >
                      <>{t("show-map")}</>
                    </Button>
                  </div>
                )}
              {!!coffeeBatch.dryMill.damage_percent && (
                <div className="item">
                  <h6 className="title">
                    <>{t("damage-percent")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.damage_percent}
                  </span>
                </div>
              )}
              {!!coffeeBatch.dryMill.threshing_yield && (
                <div className="item">
                  <h6 className="title">
                    <>{t("threshing-yield")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.threshing_yield}
                  </span>
                </div>
              )}
              {!!coffeeBatch.dryMill.weight && (
                <div className="item">
                  <h6 className="title">
                    <>{t("weight")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.weight} QQ
                  </span>
                </div>
              )}
              {!!coffeeBatch.dryMill.note && (
                <div className="item">
                  <h6 className="title">
                    <>{t("note")}</>
                  </h6>
                  <span className="text-light">{coffeeBatch.dryMill.note}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <MapModal
        latitude={currentLat}
        longitude={currentLng}
        addressLine={currentAddressL}
        show={showMap}
        onHide={() => setShowMap(false)}
      />
    </div>
  );
};

export default CoffeeCard;
