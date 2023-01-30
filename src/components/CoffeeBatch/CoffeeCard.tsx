import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import {CoffeeBatchType} from "../common/types";
import {ipfsUrl} from "../../utils/constants";
import {getFarmer} from "../../db/firebase";
import NewMap from "../common/NewMap";


const CoffeeCard = () => {
    const {t} = useTranslation();
    const {ipfsHash} = useParams();
    const [loading, setLoading] = useState(true);
    const [coffeeBatch, setCoffeeBatch] = useState<CoffeeBatchType | null>(null);
    const [farmerData, setFarmerData] = useState<any>();
    const [currentLat, setCurrentLat] = useState("0");
    const [currentLng, setCurrentLng] = useState("0");
    const [currentAddressL, setCurrentAddressL] = useState("");

    useEffect(() => {
        const load = () => {
            if (ipfsHash) {
                console.log(ipfsHash);
                const url = ipfsUrl.concat(ipfsHash);
                fetch(url)
                    .then((response) => response.json())
                    .then(async (jsonData) => {
                        console.log(jsonData);
                        let farmer = {};
                        let farm: any;
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
                            }
                            if (traitType === "dry mill") {
                                [dryMill] = jsonData.attributes[i].value;
                            }

                        }
                        const coffeeB = {
                            id: 0,
                            name: jsonData.name,
                            description: jsonData.description,
                            image: "https://gateway.pinata.cloud/ipfs/".concat(jsonData.image),
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
                        console.error(error);
                        setLoading(false);
                    });
            }
        };

        load();
        // eslint-disable-next-line
    }, [ipfsHash]);

    if (loading) {
        return <Loading label="Cargando..." className="loading-wrapper"/>;
    }

    if (coffeeBatch === null) {
        return <NotFound msg="No se encontró el lote de café."/>;
    }

    const onMapBtnClick = (lat: string, lng: string, adressL: string) => {
        setCurrentLat(lat);
        setCurrentLng(lng);
        setCurrentAddressL(adressL);
    };

    return (<>
            <input type="checkbox" id="map-batchModal" className="modal-toggle"/>
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="map-batchModal"
                           className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                    <div className="flex justify-center m-6">
                        <div>
                            <div className="flex pt-8 space-x-4 place-content-center">
                                <NewMap
                                    latitude={currentLat}
                                    longitude={currentLng}
                                    zoomLevel={10}
                                    addressLine={currentAddressL}
                                    className="google-map"
                                />
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-8 bg-white overflow-hidden">
                <div className="xl:container m-auto px-6 text-gray-600  md:px-12 xl:px-6">

                    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                        <div
                            className="card border-2 border-amber-900	row-span-2 rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center shadow-2xl shadow-gray-600/10">
                            <div className="flex h-full flex-col  space-y-2">
                                <h1 className="flex text-2xl">
                                    Lote <span className="font-black">#</span>
                                </h1>
                                <figure className="px-10 pt-5">
                                    <img src={coffeeBatch.image} className="w-32"/>
                                </figure>
                                <div className="text-center">
                                <span className="md:text-xl">
                <span className="font-serif text">
                  <span className="text-black text-6xl text-bold">
                      {coffeeBatch.cupProfile.note ? (<>
                       <span>{coffeeBatch.cupProfile.note}%</span>
                        </>
                        ) : (
                            <>
                                {t("not_tasted")}
                            </>
                    )}
                </span>
                  <br/>
                  Perfil de taza
                  <br/>
                  Peso KG:<span className="font-black b-t"></span>
                </span>
                                </span>
                                </div>
                                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    <div>
                                        <h3 className=" font-black">Productores: </h3>
                                        <span className="">
                                        <a className="link link-info" href={'/farmer' + '/' + farmerData?.address}>
                                            {farmerData?.fullname}
                                        </a>
                                    </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black">
                                            <>{t("varieties")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.varieties}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("location")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.village}, {coffeeBatch.farm.region},{" "}
                                            {coffeeBatch.farm.country} </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("altitude")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.altitude} <>{t("masl")}</>
                                    </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("area")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.area}
                                    </span>
                                    </div>
                                    <div>
                                    <span className="font-black"><>{t("coordinates")}</>
                                        :
                                    </span>

                                        <label
                                            htmlFor="map-batchModal"
                                            className="btn text-light"
                                            onClick={() => onMapBtnClick(coffeeBatch.farm.latitude, coffeeBatch.farm.longitude, "")}
                                        >
                                            <>{t("show-map")}</>
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("farm-name")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.name}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("ethnic-group")}</>
                                            :
                                        </h3>
                                        <span className="">{coffeeBatch.farm.etnic_group}
                                    </span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("family-members")}</>
                                        </h3>
                                        <span className="">{coffeeBatch.farm.family_members}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("shadow")}</>
                                        </h3>
                                        <span className="">{coffeeBatch.farm.shadow}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black"><>{t("certificates")}</>
                                        </h3>
                                        <span className="">{coffeeBatch.farm.certifications}
                                    </span>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="">
                            {(!!coffeeBatch.wetMill.variety || !!coffeeBatch.wetMill.process || !!coffeeBatch.wetMill.certifications || !!coffeeBatch.cupProfile.aroma || !!coffeeBatch.cupProfile.acidity || !!coffeeBatch.cupProfile.aftertaste || !!coffeeBatch.cupProfile.body || !!coffeeBatch.cupProfile.flavor || !!coffeeBatch.cupProfile.sweetness || !!coffeeBatch.cupProfile.note) && (
                                <div
                                    className="card border-2 border-amber-900 rounded-3xl sm:flex sm:space-x-8 border border-gray-100  p-8 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none">
                                    <h1 className="text-2xl text-center pb-2 underline decoration-2 decoration-yellow-700">
                                        Detalle de lote
                                    </h1>
                                    <div
                                        className="grid gap-8 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {!!coffeeBatch.wetMill.variety && (<div>
                                                <h3>
                                                    <>{t("variety")}</>
                                                    :
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.variety}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.process && (<div>
                                                <h3>
                                                    <>{t("process")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.process}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.certifications && (<div>
                                                <h3>
                                                    <>{t("certificates")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.certifications}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.aroma && (<div>
                                                <h3>:
                                                    <>{t("aroma")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.aroma}
                  </span>
                                            </div>)}

                                        {!!coffeeBatch.cupProfile.acidity && (<div>
                                                <h3>
                                                    <>{t("acidity")}</>
                                                    :
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.acidity}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.aftertaste && (<div>
                                                <h3>
                                                    <>{t("aftertaste")}</>
                                                    :
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.aftertaste}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.body && (<div>
                                                <h3>
                                                    <>{t("body")}</>
                                                    :
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.body}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.flavor && (<div>
                                                <h3>
                                                    <>{t("flavor")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.flavor}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.sweetness && (<div>
                                                <h3>
                                                    <>{t("sweetness")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.sweetness}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.cupProfile.note && (<div>
                                                <h3>
                                                    <>{t("note")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.cupProfile.note}
                  </span>
                                            </div>)}
                                    </div>
                                </div>)}
                            <br/>
                            {(!!coffeeBatch.wetMill.drying_id || !!coffeeBatch.wetMill.quality || !!coffeeBatch.wetMill.process || !!coffeeBatch.wetMill.drying_type || !!coffeeBatch.wetMill.drying_hours || (!!coffeeBatch.wetMill.date && coffeeBatch.wetMill.date !== "1970-01-01") || !!coffeeBatch.wetMill.facility || !!coffeeBatch.wetMill.weight || !!coffeeBatch.wetMill.note) && (
                                <div
                                    className="card border-2 border-amber-900 rounded-3xl sm:flex sm:space-x-8 border border-gray-100  p-8 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none">
                                    <h1 className="text-2xl text-center pb-2 underline decoration-2 decoration-yellow-700">
                                        Beneficio Húmedo
                                    </h1>

                                    <div
                                        className="grid gap-8 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {!!coffeeBatch.wetMill.drying_id && (<div>
                                                <h3>
                                                    <>{t("batch-id")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.drying_id}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.entry_id && (<div>
                                                <h3>
                                                    <>{t("entry-batch-id")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.entry_id}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.quality && (<div>
                                                <h3>
                                                    <>{t("quality")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.quality}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.process && (<div>
                                                <h3>
                                                    <>{t("process")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.process}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.drying_type && (<div>
                                                <h3>
                                                    <>{t("drying-type")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.drying_type}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.drying_hours && (<div>
                                                <h3>
                                                    <>{t("drying-hours")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.drying_hours}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.date && coffeeBatch.wetMill.date !== "1970-01-01" && (
                                            <div>
                                                <h3>
                                                    <>{t("entry-date")}</>
                                                </h3>
                                                <span>
                      {coffeeBatch.wetMill.date}
                    </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.facility && (<div>
                                                <h3>
                                                    <>{t("facility")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.wetMill.facility}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.latitude && !!coffeeBatch.wetMill.longitude && (<div>
                                                <h3>
                                                    <>{t("location")}</>
                                                </h3>
                                                <label
                                                    htmlFor="map-batchModal"
                                                    className="btn text-light"
                                                    onClick={() => onMapBtnClick(coffeeBatch.wetMill.latitude, coffeeBatch.wetMill.longitude, "")}
                                                >
                                                    <>{t("show-map")}</>
                                                </label>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.weight && (<div>
                                                <h3>Peso</h3>
                                                <span>
                    {coffeeBatch.wetMill.weight} QQ
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.wetMill.note && (<div>
                                                <h3>
                                                    <>{t("note")}</>
                                                </h3>
                                                <span>{coffeeBatch.wetMill.note}</span>
                                            </div>)}
                                    </div>
                                </div>)}
                            <br/>

                            {(!!coffeeBatch.dryMill.export_id || (!!coffeeBatch.dryMill.date && coffeeBatch.dryMill.date !== "1970-01-01") || !!coffeeBatch.dryMill.facility || !!coffeeBatch.dryMill.drying_type || !!coffeeBatch.dryMill.damage_percent || !!coffeeBatch.dryMill.threshing_yield || !!coffeeBatch.dryMill.weight || !!coffeeBatch.dryMill.note) && (
                                <div
                                    className="card border-2 border-amber-900 rounded-3xl sm:flex sm:space-x-8 border border-gray-100  p-8 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none">
                                    <h1 className="text-2xl text-center pb-2 underline decoration-2 decoration-yellow-700">
                                        Beneficio seco
                                    </h1>

                                    <div
                                        className="grid gap-8 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                        {!!coffeeBatch.dryMill.export_id && (<div>
                                                <h3>
                                                    <>{t("exporting-code")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.export_id}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.export_drying_id && (<div>
                                                <h3>
                                                    <>{t("drying-batch-id")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.export_drying_id}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.date && coffeeBatch.dryMill.date !== "1970-01-01" && (
                                            <div>
                                                <h3>
                                                    <>{t("date")}</>
                                                </h3>
                                                <span>
                      {coffeeBatch.dryMill.date}
                    </span>
                                            </div>)}

                                        {!!coffeeBatch.dryMill.facility && (<div>
                                                <h3 className="title ">
                                                    <>{t("facility")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.facility}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.latitude && !!coffeeBatch.dryMill.longitude && (<div>
                                                <h3>
                                                    <>{t("location")}</>
                                                </h3>
                                                <label
                                                    htmlFor="map-batchModal"
                                                    className="btn text-light"
                                                    onClick={() => onMapBtnClick(coffeeBatch.wetMill.latitude, coffeeBatch.wetMill.longitude, "")}
                                                >
                                                    <>{t("show-map")}</>
                                                </label>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.damage_percent && (<div>
                                                <h3>
                                                    <>{t("damage-percent")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.damage_percent}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.threshing_process && (<div>
                                                <h3>
                                                    <>{t("threshing_process")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.threshing_process}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.threshing_yield && (<div>
                                                <h3>
                                                    <>{t("threshing-yield")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.threshing_yield}
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.weight && (<div>
                                                <h3>
                                                    <>{t("weight")}</>
                                                </h3>
                                                <span>
                    {coffeeBatch.dryMill.weight} QQ
                  </span>
                                            </div>)}
                                        {!!coffeeBatch.dryMill.note && (<div>
                                                <h3>
                                                    <>{t("note")}</>
                                                </h3>
                                                <span>{coffeeBatch.dryMill.note}</span>
                                            </div>)}
                                    </div>
                                </div>)}
                        </div>

                    </div>
                </div>
            </div>
        </>);
};

export default CoffeeCard;
