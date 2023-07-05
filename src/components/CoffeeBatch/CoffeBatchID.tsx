import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReactI18NextChild, useTranslation } from "react-i18next";
import Loading from "../Loading";
import { getBatch, getFarmer } from "../../db/firebase";
import NotFound from "../common/NotFound";

const CoffeeBatchId = () => {
    const { t } = useTranslation();
    const { batchId } = useParams();
    const [loading, setLoading] = useState(true);
    const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
    const [farmers, setFarmers] = useState<any>([]);



    useEffect(() => {
        const load = () => {
            if (batchId) {
                getBatch(batchId).then((result) => {
                    setCoffeeBatch(result);

                    if (result?.Farmer?.length === undefined) {
                        console.log(result?.Farmer);
                        getFarmer(result?.Farmer?.address).then((result) => {
                            console.log(result);
                            setFarmers(result);
                        });
                    } else {

                        FetchFarmer(result);
                       
                    }

                    setLoading(false);

                });
                

                setLoading(false);
            } else {
                <NotFound msg={batchId + "Not Found"} />;
            }
        };
        const FetchFarmer = async (result:any) => {
            const Farmer = result?.Farmer?.map((farmer: string) => {
                const FarmerData = getFarmer(farmer).then((farmerData) => {
                    return farmerData;
                });

              
                console.log(FarmerData);
                return FarmerData;
            });
            const Debuged = Farmer.map((result:any) => {
                const clean = result.then((data:any) => {
                    return data;
                });
                setFarmers(clean);
            });
            console.log('debug');
            console.log(Debuged);
        };

        load();
    }, [],);

    if (loading) {
        return <Loading label="Cargando..." className="loading-wrapper" />;
    }


    return (<>
        <section>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3">
                    <li>
                        <a className="relative block group">

                            <div className="card w-full bg-base-100 shadow-xl">

                                <figure className="px-10 pt-10">
                                    <img src={coffeeBatch?.image} alt="NFT" className="rounded-xl w-40" />
                                </figure>

                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700"><>{t("batch-id")}</>: {coffeeBatch?.Name} </h2>

                                    {coffeeBatch?.Profile?.note > 0 &&
                                        <div className="stat">
                                            <div className="stat-title"><>{t("note")}</></div>
                                            <div className="stat-value">{coffeeBatch?.wetMill?.note} %</div>
                                        </div>
                                    }
                                    <p>{coffeeBatch?.Description}</p>

                                    {coffeeBatch?.Farmer?.address && (
                                        <div>
                                            <p><>{t("farmer")}</> <br /> <a className="hover:underline hover:underline-offset-4 hover:font-black decoration-sky-500 underline underline-offset-2" href={'/farmer' + '/' + farmers.address} > {farmers?.fullname} </a> </p>
                                        </div>
                                    )}

                                    {JSON.stringify(farmers)}





                                </div>
                            </div>

                        </a>
                    </li>

                    <li>
                        <a className="relative block group">
                            <div className="card w-full h bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700">Finca : Genesis ,  Lempira, Parainema, IHCAFE 90 , Con sombra


                                    </h2>
                                    <div className="card-actions">
                                        <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>

                    <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                        <a className="relative block group">
                            <div className="card w-full bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700"><>{t("cup-profile")}</></h2>

                                    <div className="card-actions">
                                        <div className="grid gap-6 mb-8 lg:grid-cols-4  sm:grid-cols-2 text-center">
                                            <p><>{t("variety")}</>:<br /> <span> {coffeeBatch?.wetMill?.variety}</span></p>
                                            <p><>{t("process")}</>: <br /> <span> {coffeeBatch?.wetMill?.process}</span></p>
                                            <p><>{t("acidity")}</>: <br /> <span> {coffeeBatch?.Profile?.acidity}</span></p>
                                            <p><>{t("aftertaste")}</>: <br /> <span> {coffeeBatch?.Profile?.aftertaste}</span></p>
                                            <p><>{t("body")}</>: <br /> <span> {coffeeBatch?.Profile?.body}</span></p>
                                            <p><>{t("aroma")}</>: <br /> <span> {coffeeBatch?.Profile?.aroma}</span></p>
                                            <p><>{t("sweetness")}</>: <br /> <span> {coffeeBatch?.Profile?.sweetness}</span></p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card w-full bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700">Beneficio Humedo</h2>
                                    <div className="card-actions">
                                        <div className="grid gap-6 mb-8 lg:grid-cols-4  sm:grid-cols-2 text-center">
                                            <p><>{t("certificates")}</>: <br /> <span> {coffeeBatch?.wetMill?.certifications}</span></p>
                                            <p><>{t("drying-hours")}</>: <br /> <span> {coffeeBatch?.wetMill?.drying_hours}</span></p>
                                            <p><>{t("process")}</>: <br /> <span> {coffeeBatch?.wetMill?.process}</span></p>
                                            <p> <>{t("variety")}</> :<br /> <span> {coffeeBatch?.wetMill?.variety}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card w-full bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700">Beneficio Seco</h2>
                                    <div className="card-actions">
                                        <div className="grid gap-6 mb-8 lg:grid-cols-4  sm:grid-cols-2 text-center">
                                            <p><>{t("damage-percent")}</>: <br /> <span> {coffeeBatch?.dryMill?.damage_percent}</span></p>
                                            <p> <>{t("exporting-code")}</>: <br /> <span> {coffeeBatch?.dryMill?.export_id}</span></p>
                                            <p><>{t("altitude")}</>: <br /> <span> {coffeeBatch?.dryMill?.height}</span></p>
                                            <p> <>{t("threshing-yield")}</>: <br /> <span> {coffeeBatch?.dryMill?.threshing_yield}</span></p>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {coffeeBatch?.Roasting?.bag_type !== '' && (
                                <div className="card w-full bg-base-100 shadow-xl">
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700">Tostado</h2>
                                        <div className="card-actions">
                                            <div className="grid gap-6 mb-8 lg:grid-cols-4  sm:grid-cols-2 text-center">
                                                <p><>{t("packaging")}</>: <br /> <span> {coffeeBatch?.Roasting?.bag_type}</span></p>
                                                <p><>{t("bag_size")}</>: <br /> <span> {coffeeBatch?.Roasting?.bag_weight}</span></p>
                                                <p><>{t("grind_type")}</>: <br /> <span> {coffeeBatch?.Roasting?.grind_type}</span></p>
                                                <p><>{t("roast_type")}</>: <br /> <span> {coffeeBatch?.Roasting?.type}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            )}


                        </a>
                    </li>
                </ul>
            </div>
        </section>
    </>);
};

export default CoffeeBatchId;
