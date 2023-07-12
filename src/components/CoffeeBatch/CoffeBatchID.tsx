import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReactI18NextChild, useTranslation } from "react-i18next";
import Loading from "../Loading";
import { getBatch, getFarmer, getFarmerFarms, getFarms } from "../../db/firebase";
import NotFound from "../common/NotFound";

const CoffeeBatchId = () => {
    const { t } = useTranslation();
    const { batchId } = useParams();
    const [loading, setLoading] = useState(true);
    const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
    const [farmers, setFarmers] = useState<any>([]);
    const [farmerPromise, setFarmerPromise] = useState<any>([]);
    useEffect(() => {
        const load = () => {
            if (batchId) {
                getBatch(batchId).then((result) => {
                    setCoffeeBatch(result);
                    console.log(result);
                    console.log(result?.Farmer);
                    console.log(result?.Farmer.length);

                    for (let i = 0; i < result?.Farmer.length; i++) {
                        let FarmerDetails = getFarmer(result?.Farmer[i]).then((result) => {
                            if (result) {
                                let Datas: any[] = [];
                                Datas.push(result);
                                console.log(Datas);
                                console.log(Datas.length);
                                return result;
                            } else {
                                throw new Error("Document not found");
                            }
                        });
                        FarmerDetails.then((result) => {
                            let dataDatails = new Array();
                            dataDatails.push(result);
                            setFarmers(dataDatails);
                        });
                        setFarmerPromise(FarmerDetails);
                    }
                    setLoading(false);

                });
                setLoading(false);
            } else {
                <NotFound msg={batchId + "Not Found"} />;
            }
        };




        load();
    }, [batchId]);

    if (loading) {
        return <Loading label="Cargando..." className="loading-wrapper" />;
    }


    return (<>
        <section>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3">
                    <li>
                        <div className="relative block group">

                            <div className="card w-full bg-base-100 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img src={coffeeBatch?.image} alt="NFT" className="rounded-xl w-40" />
                                </figure>

                                <div className="card-body items-center text-center">
                                    {coffeeBatch?.Profile?.note > 0 &&
                                        <div className="stat">
                                            <div className="stat-title"><>{t("note")}</></div>
                                            <div className="stat-value">{coffeeBatch?.wetMill?.note} %</div>
                                        </div>
                                    }
                                    <p>{coffeeBatch?.Description}</p>


                                    {farmers.map((farmer: any, index: any) => (
                                        <div key={index}>
                                            <p > <>{t("farmers")}</>: <br /> <a className="hover:underline underline-offset-1 decoration-sky-500" href={'/farmer' + '/' + farmer?.address} > {farmer?.fullname} </a> y  {coffeeBatch?.Farmer?.length - 1}<span>productores más  </span></p>
                                        </div>
                                    ))}

                                </div>
                            </div>

                        </div>
                    </li>

                    <li>
                        <div className="relative block group">
                            <div className="card w-full h bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700">Finca : {coffeeBatch?.Name}</h2>
                                    <div className="card-actions">
                                        <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                        <div className="relative block group">
                            <div className="card w-full bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700"><>{t("batch-id")}</></h2>

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


                        </div>
                    </li>
                </ul>
            </div>
        </section>
    </>);
};

export default CoffeeBatchId;