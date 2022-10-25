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
      <div className="mx-auto w-full max-w-[1160px] text-sm md:pt-14 4xl:pt-24">

        <div className="px-4 py-2  text-gray-800">
          <div className="flex justify-between shadow-md border rounded-md px-4">
            <div
                className="flex flex-col items-center justify-between w-1/4 px-4 py-2 bg-white border-r-2 border-gray-500 border-dashed rounded-l-md"
            >
              <div className="flex-col">
                <img src={coffeeBatch.image} className="" />
                <br/>
                <div className="text-xl mb-2 text-gray-600 text-center">
                  <span className="text-black text-6xl text-bold"> % </span>
                  <br/>
                  Perfil de taza
                  <br/>

                  Peso KG:<p className="font-black b-t"> </p>
                </div>

              </div>
            </div>
            <div className="relative flex flex-col">
              <div className="w-full ml-2 lg:pl-5 lg:py-6 mt-6 lg:mt-0">
                <div className="flex mb-4 border-b-2 border-gray-100 mb-5 justify-center">
          <span className="flex text-2xl">
          Lote <p className="font-black">#</p>
          </span>

                </div>


                <p className=" font-black">Productores: </p>
                <p className="">{farmerData?.fullname}</p>
               

                <br/>
              </div>
            </div>
            <div className="relative flex flex-col">
              <div className="w-full ml-2 lg:pl-5 lg:py-6 mt-6 lg:mt-0">
                <br/>
                <br/>
                <br/>

                <p className=" font-black"><>{t("farm-name")}</>
                </p>
                <p className="">{coffeeBatch.farm.name}</p>
                <br/>
                <p className="font-black"><>{t("ethnic-group")}</>
                </p>
                <p className="">{coffeeBatch.farm.etnic_group}
                </p>
                <br/>
                <p className="font-black"><>{t("family-members")}</>
                </p>
                <p className="">{coffeeBatch.farm.family_members}</p>
                <br/>
                <p className="font-black"><>{t("shadow")}</>
                </p>
                <p className="">{coffeeBatch.farm.shadow}</p>
                <br/>

                <p className="font-black"><>{t("certificates")}</>
                </p>
                <p className="">{coffeeBatch.farm.certifications}
                </p>
                <br/>
              </div>
            </div>

            <div className="relative flex flex-col">
              <div className="relative flex flex-col">
                <div className="w-full  ml-2 lg:py-6 mt-6 lg:mt-0">
                  <br/>
                  <br/>
                  <br/>

                  <p className=" font-black"><>{t("variates")}</></p>
                  <p className="">{coffeeBatch.farm.varieties}
                  </p>
                  <br/>
                  <p className="font-black"><>{t("location")}</></p>
                  <p className="">{coffeeBatch.farm.village}, {coffeeBatch.farm.region},{" "}
                    {coffeeBatch.farm.country} </p>
                  <br/>

                  <p className="font-black"><>{t("altitude")}</></p>
                  <p className="">{coffeeBatch.farm.altitude} <>{t("masl")}</>
                  </p>
                  <br/>

                  <p className="font-black"><>{t("area")}</></p>
                  <p className="">{coffeeBatch.farm.area}
                  </p>
                  <br/>

                  <p className="font-black"><>{t("coordinates")}</>:</p>
                  <p className="">Fam locavore kickstarter </p>
                  <br/>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




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
              {!!coffeeBatch.wetMill.entry_id && (
                <div className="item">
                  <h6 className="title">
                    <>{t("entry-batch-id")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.wetMill.entry_id}
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
              {!!coffeeBatch.dryMill.export_drying_id && (
                <div className="item">
                  <h6 className="title">
                    <>{t("drying-batch-id")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.export_drying_id}
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
              {!!coffeeBatch.dryMill.threshing_process && (
                <div className="item">
                  <h6 className="title">
                    <>{t("threshing_process")}</>
                  </h6>
                  <span className="text-light">
                    {coffeeBatch.dryMill.threshing_process}
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
