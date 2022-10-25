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
                    console.log(farms);
                    // console.log(result[0].data());
                    setFarms(result);
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
            <div className="flex justify-center pt-6">

                <div className="shadow-lg rounded-2xl w-120 bg-white dark:bg-gray-800">
                    <img alt="profil" src={require('../../assets/coffee.jpg')}
                         className="rounded-t-lg h-32 w-full mb-4"/>
                    <div className="flex flex-col items-center justify-center p-4 -mt-16">
                        <a href="#" className="block relative">
                            <img alt="profil" src={imageUrl}
                                 className="mx-auto object-cover rounded-full h-24 w-24  border-2 border-white dark:border-gray-800"/>
                        </a>
                        <p className="text-gray-800 dark:text-white text-xl font-medium mt-2 text-center ">
                            {farmerData.fullname}
                        </p>
                        <p className="text-gray-400 text-xs mb-4">
                            {farmerData.bio}
                        </p>
                        <p className="text-xs p-2 bg-amber-800 text-white px-4 rounded-full">
                            {farmerData.company}
                        </p>
                        <div className="rounded-lg p-2 w-full mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-200">
                                <p className="flex flex-col">
                                    <>{t("gender")}</>
                                    <span className="text-black dark:text-white font-bold">
                    <>{t(farmerData.gender)}</>
                    </span>
                                </p>
                                <p className="flex flex-col text-center">
                                    <>{t("location")}</>
                                    <span className="text-black dark:text-white font-bold">
                                                {farmerData.village}, {farmerData.region}

                    </span>
                                </p>
                                <p className="flex flex-col">
                                    <>{t("country")}</>
                                    <span className="text-black dark:text-white font-bold">
                        {farmerData.country}
                    </span>
                                </p>
                            </div>
                        </div>

                    </div>

                </div>


            </div>
            <div className="flex justify-center container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
                <div
                    className="lg:w-2/3 md:w-full h-full rounded-lg overflow-hidden sm:mr-10 p-48 flex items-end justify-start relative ">
                    <iframe width="100%" height="100%" className="absolute inset-0 opacity-75"  title="map"
                            src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=%honduras+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
                    ></iframe>

                </div>

            </div>
        </>
    );
};
