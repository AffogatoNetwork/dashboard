import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import "../../styles/farmer.scss";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import {getFarmer, getFarmerFarms, getImageUrl} from "../../db/firebase";


export const Profile = () => {
    const {t} = useTranslation();
    const {farmerId} = useParams();
    const [loading, setLoading] = useState(true);
    const [farmerData, setFarmerData] = useState<any>();
    const [farms, setFarms] = useState<any>();
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
                await getFarmerFarms(farmerId).then((result) => {
                    if (result !== null) {
                        setFarms(result[0]);
                    }
                    setLoading(false);
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
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-col">
                    <div className="lg:w-4/6 mx-auto">
                        <div className="rounded-lg h-64 overflow-hidden">
                            <img alt="profilebanner" src={require('../../assets/coffee.jpg')}
                                 className="object-cover object-center h-full w-full"/>
                        </div>
                        <div className="flex flex-col sm:flex-row mt-10">
                            <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                                <div
                                    className="object-cover rounded-full h-24 w-24  border-2 border-amber-900 dark:border-gray-800 w-20 h-20  inline-flex items-center justify-center bg-gray-200 text-gray-400">
                                    <img alt="profile photo" src={imageUrl} className="rounded-full"/>
                                </div>
                                <div className="flex flex-col items-center text-center justify-center">
                                    <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">{farmerData.fullname}</h2>
                                    <div className="w-12 h-1 bg-amber-800 rounded mt-2 mb-4">
                                    </div>
                                    <p className="text-xs p-2 bg-amber-800 text-white px-4 rounded-full">
                                        {farmerData.company}
                                    </p>
                                    <p className="text-base">
                                        {farmerData.bio}
                                    </p>
                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("gender")} :</>
                                        <span className="text-black dark:text-white font-bold">
                    <>{t(farmerData.gender)}</>
                    </span>
                                    </p>

                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("location")} :</>
                                        <span className="text-black dark:text-white font-bold">
                          {farmerData.village}, {farmerData.region}
                    </span>
                                    </p>

                                    <br className="pt-4"/>
                                    <p className="flex flex-col">
                                        <>{t("country")} :</>
                                        <span className="text-black dark:text-white font-bold">
                          {farmerData.country},
                    </span>
                                    </p>

                                </div>
                            </div>
                            <div
                                className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                <p className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
                                    <div className="w-full sm:p-4 px-4 mb-6">
                                        <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                                            <h2 className="title-font font-medium text-3xl text-gray-900">{farms.varieties}</h2>
                                            <p className="leading-relaxed">Variedades</p>
                                        </div>
                                        <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                                            <h2 className="title-font font-medium text-3xl text-gray-900">{farms.certifications}</h2>
                                            <p className="leading-relaxed">Certificados</p>
                                        </div>
                                        <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                                            <h2 className="title-font font-medium text-3xl text-gray-900">{farms.familyMembers}</h2>
                                            <p className="leading-relaxed">Miembros de Familia</p>
                                        </div>
                                        <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                                            <h2 className="title-font font-medium text-3xl text-gray-900">{farms.shadow}</h2>
                                            <p className="leading-relaxed">Estado</p>
                                        </div>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
