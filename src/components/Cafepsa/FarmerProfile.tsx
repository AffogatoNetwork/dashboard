import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import { getFarmer, getFarmerFarms, getImageUrl } from "../../db/firebase";
import NewMap from "../common/NewMap";


export const FarmerProfileModule = () => {
    const { t } = useTranslation();
    const { newfarmerId } = useParams();
    const [loading, setLoading] = useState(true);
    const [farmerData, setFarmerData] = useState<any>();
    const [farms, setFarms] = useState<any>();
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [farmName, setfarmName] = useState("");
    const [imageUrl, setImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FIMG_1718.jpeg?alt=media&token=c37a0d05-a8dc-4cfd-b3c1-fcc0502dcd77");

    useEffect(() => {
        const load = async () => {
            if (newfarmerId) {
                await getFarmer(newfarmerId).then((result) => {
                    setFarmerData(result);
                    console.log(result);
                    console.log(result?.address);
                    const firebase = getFarmerFarms(result?.address).then((result: any) => {
                        {
                            setfarmName(result[0].name);
                            setLatitude(result[0].latitude);
                            setLongitude(result[0].longitude);
                            setFarms(result[0]);
                        }
                    });
                    setLoading(false);
                });
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line
    }, [newfarmerId]);

    if (loading) {
        return (
            <Loading label={t("loading").concat("...")} className="loading-wrapper" />
        );
    }

    if (farmerData === null) {
        return <NotFound msg={t("errors.farmer-not-found")} />;
    }

    return (
        <>
            <input type="checkbox" id="image-modal" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <label htmlFor="image-modal" className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                    <div className="flex justify-center m-6">
                        <img alt="profile photo" src={imageUrl} />
                    </div>
                </div>
            </div>

            <section className=" p-5 m-5 ">
                <button className="btn btn-ghost  absolute right-2 top-2" onClick={() => window.history.back()}
                
                >Volver</button>
                <h3 className="text-2xl mb-5">
                    {farmerData.fullname}

                </h3>
                <p className="text-xs w-20 p-2 bg-amber-800 text-white px-4 rounded-full">
                    {farmerData.company}
                </p>
                <br />

                <div className="flex flex-col lg:flex-row gap-5 mt-2">

                    <div className="w-full lg:w-1/2">
                        <div className="p-2 rounded text-center border ">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full border-2 border-amber-900 hover:border-red-700">
                                    <div />
                                    <label htmlFor="image-modal" className=" ">
                                        <img alt="profile photo" src={imageUrl} />
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="p-2 rounded text-center border">
                            <p className="flex flex-col">
                                <>{t("gender")}:</>
                                <span className="text-black dark:text-white font-bold">
                                    <>{t(farmerData.gender)}</>
                                </span>
                            </p>
                            <p className="flex flex-col py-2">
                                <>{t("location")}:</>
                                <span className="text-black dark:text-white font-bold">
                                    {farmerData.village}, {farmerData.region}
                                </span>
                            </p>

                            <p className="flex flex-col">
                                <>{t("country")}:</>
                                <span className="text-black dark:text-white font-bold">
                                    {farmerData.country},
                                </span>
                            </p>
                        </div>

                    </div>


                </div>




                <div>

                    {farms
                        ?
                        <div>
                            <div className="flex flex-col lg:flex-row gap-5 mt-2">

                                <div className="w-full lg:w-1/2">
                                    <div className="p-2 rounded text-center bg-amber-800 text-white">
                                        Finca
                                    </div>
                                    <div className="flex gap-5 mt-2">
                                        <div
                                            className="flex-grow border border-gray-300 rounded text-center py-8"
                                        >
                                            <h2 className="text-4xl font-bold pb-2">{farms?.certifications}</h2>
                                            <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                        </div>
                                        <div
                                            className="flex-grow border border-gray-300 rounded text-center py-8"
                                        >
                                            <h2 className="text-4xl font-bold pb-2">{farms?.familyMembers}</h2>
                                            <h4 className="inline text-gray-500 text-sm">Mienbros de Familia</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-1/2">
                                    <div className="p-2 rounded text-center bg-amber-800 text-white">
                                        Produccion
                                    </div>
                                    <div className="flex gap-5 mt-2">
                                        <div
                                            className="flex-grow border border-gray-300 rounded text-center py-8"
                                        >
                                            <h2 className="text-4xl font-bold pb-2">{farms?.shadow}</h2>
                                            <h4 className="inline text-gray-500 text-sm">Tipo de produccion </h4>
                                        </div>
                                        <div
                                            className="flex-grow border border-gray-300 rounded text-center py-8"
                                        >
                                            <h2 className="text-4xl font-bold pb-2">{farms?.varieties}</h2>
                                            <h4 className="inline text-gray-500 text-sm">Variedades </h4>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="flex flex-col lg:flex-col gap-5 mt-8">
                                <div className="flex place-content-center">
                                    <div>
                                        <NewMap latitude={latitude}
                                            longitude={longitude}
                                            addressLine={farmName}
                                            zoomLevel={9}
                                            className="google-map"
                                        />
                                    </div>

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
            </section>
        </>

    );
};