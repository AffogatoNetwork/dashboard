import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import Loading from "../Loading";
import NotFound from "../common/NotFound";
import {getFarmer, getFarmerFarms, getImageUrl} from "../../db/firebase";
import NewMap from "../common/NewMap";


export const FarmerProfileModule = () => {
    const {t} = useTranslation();
    const {newfarmerId} = useParams();
    const [loading, setLoading] = useState(true);
    const [farmerData, setFarmerData] = useState<any>();
    const [farms, setFarms] = useState<any>();
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [farmName, setfarmName] = useState("");
    const [imageUrl, setImageUrl] = useState("../../assets/logo.png");

    useEffect(() => {
        const load = async () => {
            if (newfarmerId) {
                await getFarmer(newfarmerId).then((result) => {
                    setFarmerData(result);
                    console.log(result);
                    console.log(result?.address);
                    const firebase = getFarmerFarms(result?.address).then((result: any) => {{
                        setfarmName(result[0].name);
                        setLatitude(result[0].latitude);
                        setLongitude(result[0].longitude);
                        setFarms(result[0]);
                    }});
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
            <Loading label={t("loading").concat("...")} className="loading-wrapper"/>
        );
    }

    if (farmerData === null) {
        return <NotFound msg={t("errors.farmer-not-found")}/>;
    }

    return (
        <div>

            <div className="container my-12 py-12 mx-auto px-4 md:px-6 lg:px-12">

                <section className="mb-20 text-gray-800">

                    <div className="flex flex-wrap justify-center">
                        <div className="flex-initial shrink w-full xl:w-5/12 lg:w-6/12">

                            <div className="lg:py-12 lg:pl-6 mb-6 lg:mb-0">
                                <iframe
                                    src={`https://maps.google.com/maps/@${latitude},${longitude}&hl=es&z=14&amp;output=embed`}
                                    className="h-96 w-full border-0 rounded-lg shadow-lg" loading="lazy"></iframe>
                            </div>
                        </div>
                        <div className="flex-initial shrink w-full xl:w-7/12 lg:w-6/12 mb-6 md:mb-0 lg:-ml-12">
                            <div className="bg-yellow-800 h-full rounded-lg p-6 lg:pl-12 text-white flex items-center py-12 lg:py-0 my-4">
                                <div className="lg:pl-12">
                                    <div className="flex flex-row my-2">
                                        <div className="avatar">
                                            <div className="w-32 rounded-full border-2 border-amber-900 hover:border-red-700">
                                                <div/>
                                                <label htmlFor="image-modal" className=" ">
                                                    <img alt="profile photo" src={require('../../assets/logo.png')}/>
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                    <h3 className="text-2xl font-semibold uppercase">Finca : </h3>
                                    <h5 className="text-xl font-semibold mb-4"> {farms?.name} , {farms?.company}  </h5>

                                    <h5 className="text-xl font-semibold mb-2">Ubicación: {farms?.state}
                                    </h5>
                                    <p className="mb-6">País: {farms?.country} </p>
                                    <h5 className="text-xl font-semibold mb-4">Variedades:</h5>
                                    <p className="mb-6">{farms?.varieties} </p>

                                    <h5 className="text-xl font-semibold mb-4">Miembros de Familia: {farms?.familyMembers}</h5>
                                    <h5 className="text-xl font-semibold mb-6"> Certificados :</h5>
                                    <div className="flex flex-row">

                                        {(farms?.fairtrade !== null) &&(
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img alt="profile photo" src={require('../../assets/certificaciones/2_Fair Trade.png')}/>
                                                </div>
                                            </div>
                                        )}

                                        {(farms?.manosdemujer !== null) &&(
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img alt="profile photo" src={require('../../assets/certificaciones/5_ConManosdeMujer.png')}/>
                                                </div>
                                            </div>
                                        )}

                                        {(farms?.usda !== null) &&(
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img alt="profile photo" src={require('../../assets/certificaciones/1_USDA Organic.png')}/>
                                                </div>
                                            </div>
                                        )}

                                        {(farms?.spp !== null) &&(
                                            <div className="avatar" >
                                                <div className="w-16 rounded-full">
                                                    <img alt="profile photo" src={require('../../assets/certificaciones/7_Pequeños_Productores.png')}/>
                                                </div>
                                            </div>
                                        )}

                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        </div>

    );
};
