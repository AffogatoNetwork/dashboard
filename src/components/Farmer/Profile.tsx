import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import {getFarmer, getFarmerFarms, getImageUrl} from "../../db/firebase";
import NewMap from "../common/NewMap";
import {ipfsUrl} from "../../utils/constants";


export const Profile = () => {
    const {t} = useTranslation();
    const {farmerId} = useParams();
    const [loading, setLoading] = useState(true);
    const [farmerData, setFarmerData] = useState<any>();
    const [farms, setFarms] = useState<any>();
    const [farmName, setfarmName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const load = async () => {
            if (farmerId) {
                await getFarmer(farmerId).then((result) => {
                    setFarmerData(result);
                    console.log(result?.farm);
                    const ipfsHash = result?.farm;
                    const url = ipfsUrl.concat(ipfsHash);
                    console.log(url);
                    fetch(url)
                        .then((response) => response.json())
                        .then((jsonData) => {
                            console.log(jsonData)
                            setfarmName(jsonData.name)
                            setFarms(jsonData.attributes[3].value[0]);
                        });
                    setLoading(false);
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
        return (
            <Loading label={t("loading").concat("...")} className="loading-wrapper"/>
        );
    }

    if (farmerData === null) {
        return <NotFound msg={t("errors.farmer-not-found")}/>;
    }

    return (
        <>
            <input type="checkbox" id="image-modal" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="image-modal" className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                    <div className="flex justify-center m-6">
                        <img alt="profile photo" src={imageUrl}/>
                    </div>
                </div>
            </div>



            <section className="text-gray-600 body-font">
                <div className="container sm:p-2 xl:px-5 xl:py-2 mx-auto flex flex-col ">
                    <div className="lg:w-4/6 mx-auto bg-stone-100">
                        <div className="rounded-lg h-24 overflow-hidden">
                            <img alt="profilebanner" src={require('../../assets/coffee.jpg')}
                                 className="object-cover object-center h-full w-full"/>
                        </div>
                        <div className="flex flex-col sm:flex-row mt-10">
                            <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                                <div className="avatar">
                                    <div className="w-32 rounded-full border-2 border-amber-900 hover:border-red-700">
                                        <div/>
                                        <label htmlFor="image-modal" className=" ">
                                           <img alt="profile photo" src={imageUrl}/>
                                       </label>

                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-center justify-center">
                                    <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">{farmerData.fullname}</h2>
                                    <div className="w-12 h-1 bg-amber-800 rounded mt-2 mb-4 ">
                                    </div>
                                    <p className="text-xs p-2 bg-amber-800 text-white px-4 rounded-full">
                                        {farmerData.company}
                                    </p>
                                    <p className="text-base">
                                        {farmerData.bio}
                                    </p>
                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("gender")}:</>
                                        <span className="text-black dark:text-white font-bold">
                    <>{t(farmerData.gender)}</>
                    </span>
                                    </p>

                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("location")}:</>
                                        <span className="text-black dark:text-white font-bold">
                          {farmerData.village}, {farmerData.region}
                    </span>
                                    </p>

                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("country")}:</>
                                        <span className="text-black dark:text-white font-bold">
                          {farmerData.country},
                    </span>
                                    </p>

                                </div>
                            </div>

                            {farms
                                ? <div
                                    className="sm:border-l border-gray-200 sm:border-t-0 border-t ">
                                    <div className="flex flex-col m-2">
                                        <h2 className="text-2xl font-bold mb-4">
                                            Finca : <a>
                                            {farmName}
                                        </a>
                                        </h2>

                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-4">
                                            <div className="flex items-start p-4 rounded-xl shadow-lg bg-white">


                                                <div className="ml-4">
                                                    <h2 className="font-semibold">Certificados:</h2>
                                                    <p className="mt-2 text-sm text-gray-500">{farms?.certifications}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start p-4 rounded-xl shadow-lg bg-white">
                                                <div className="ml-4">
                                                    <h2 className="font-semibold">Miembros de Familia:</h2>
                                                    <p className="mt-2 text-sm text-gray-500">{farms?.family_members}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-4 rounded-xl shadow-lg bg-white">
                                                <div className="ml-4">
                                                    <h2 className="font-semibold">Variedades:</h2>
                                                    <p className="mt-2 text-sm text-gray-500">{farms?.varieties}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-4 rounded-xl shadow-lg bg-white">
                                                <div className="ml-4">
                                                    <h2 className="font-semibold">Tiene Sombra:</h2>
                                                    <p className="mt-2 text-sm text-gray-500">{farms?.shadow}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-auto p-4">
                                            <NewMap
                                                latitude={farms?.latitude}
                                                longitude={farms?.longitude}
                                                zoomLevel={9}
                                                addressLine={farms?.villa}
                                                className="google-map"
                                            />
                                        </div>

                                    </div>
                                </div>
                            : null
                            }
                            {!farms
                                ? <div
                                    className="sm:border-l border-gray-200 sm:border-t-0 border-t ">
                                    <h2 className="text-2xl font-light m-4">
                                        Faltan datos de finca
                                    </h2>
                                </div>
                                : null
                            }

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
