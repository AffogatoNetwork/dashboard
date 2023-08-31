import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReactI18NextChild, useTranslation } from "react-i18next";
import Loading from "../Loading";
import { getBatch, getFarmer, getFarmerFarms, getFarms } from "../../db/firebase";
import NotFound from "../common/NotFound";
import NewMap from "../common/NewMap";

const NewBatchId = () => {
    const { t } = useTranslation();
    const { batchId } = useParams();
    const [loading, setLoading] = useState(true);
    const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
    const [farmers, setFarmers] = useState<any>([]);
    useEffect(() => {
        const load = () => {
            if (batchId) {
                getBatch(batchId).then((result) => {
                    console.log(result);
                    console.log(result?.image.includes("https://firebasestorage"));
                    if (result?.image.includes("https://firebasestorage") === true) {
                        console.log("es una url");
                    } else {
                        if (result?.image) {
                            console.log("es un hash");
                            let url = 'https://affogato.mypinata.cloud/ipfs/'
                            result.image = url + result.image;
                            console.log(result.image);
                        }
                    }


                    setCoffeeBatch(result);
                    console.log(result)
                    if (result?.Farmer.address !== undefined) {
                        getFarmer(result?.Farmer.address).then((result) => {
                            console.log(result);
                            FarmerDetails.push(result);
                            setFarmers(FarmerDetails);
                        });
                    }
                    let Farmers = result?.Farmer;
                    if (Farmers.length > 1) {
                        Farmers.forEach((element: any) => {
                            getFarmer(element).then((result) => {
                                FarmerDetails.push(result);
                                console.log(FarmerDetails);
                                setFarmers(FarmerDetails);
                                console.log(FarmerDetails);
                            });
                        });
                    } else {
                        console.log(Farmers);
                    }


                    console.log(Farmers);
                    let FarmerDetails: any[] = [];
                    console.log(Farmers)
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



        <div className="min-w-screen min-h-screen bg-yellow-700 flex items-center p-5 lg:p-10 overflow-hidden relative flex-col">
            <div className="w-full max-w-6xl rounded bg-white shadow-xl p-10 lg:p-20 mx-auto text-gray-800 relative md:text-left">
                <div className="md:flex items-center -mx-10">
                    <div className="w-full md:w-1/2 px-10 mb-10 md:mb-0">
                        <div className="relative">
                            <img src={coffeeBatch?.image || "https://gateway.pinata.cloud/ipfs/" + coffeeBatch?.image} alt="NFT" className="relative z-10 h-96 w-64 m-auto" />
                            <div className="border-4 border-yellow-700 absolute top-10 bottom-10 left-10 right-10 z-0"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-10">
                        <div className="mb-10">

                            <h2 className="card-title text-xl text-center pb-2 underline decoration-2 decoration-yellow-700"> </h2>
                            <h1 className="font-bold uppercase text-2xl mb-5">Detalles del lote : {coffeeBatch?.Name} {coffeeBatch?.wetMill?.entry_id} , <br /> {coffeeBatch?.wetMill?.variety} {coffeeBatch?.wetMill?.facility} </h1>
                            <p>{coffeeBatch?.Description}</p>
                        </div>
                        <div>
                            <div className="inline-block align-bottom mr-5">
                                {coffeeBatch.Farmer !== undefined && (
                                    <>
                                        <div>
                                            <p > <>{t("farmers")}</>: <br />
                                                <>
                                                    {farmers.map((farmer: any, index: any) => (
                                                        <div key={index}>
                                                            <p ><a className="hover:underline underline-offset-1 decoration-sky-500" href={'/farmer' + '/' + farmer?.address} > {farmer?.fullname} </a>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="inline-block align-bottom">

                                {coffeeBatch?.Profile?.note > 0 &&
                                    <div className="stat">
                                        <div className="stat-title"><>{t("note")}</></div>
                                        <div className="stat-value">{coffeeBatch?.wetMill?.note} %</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-6xl rounded bg-white shadow-xl px-10 pb-5 lg:px-20 mx-auto text-gray-800 relative md:text-left">
                <div>
                <div className="w-full ">
                            <div className="p-2 rounded text-center bg-amber-800 text-white">
                                Produccion
                            </div>
                            <div className="flex gap-5 mt-2">
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.variety}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("variety")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                     <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.process}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("process")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.Profile?.acidity}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("acidity")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.Profile?.aftertaste}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("aftertaste")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.Profile?.body}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("body")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.Profile?.aroma}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("aroma")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.Profile?.sweetness}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("sweetness")}</> </h4>
                                </div>
                            </div>
                        </div>
                    <div className="flex flex-col lg:flex-row gap-5 mt-2">

                        <div className="w-full lg:w-1/2">
                            <div className="p-2 rounded text-center bg-amber-800 text-white">
                                Beneficio Humedo
                            </div>
                            <div className="flex gap-5 mt-2">
                            <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.familyMembers}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Mienbros de Familia</h4>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="p-2 rounded text-center bg-amber-800 text-white">
                                Beneficio Seco 
                            </div>
                            <div className="flex gap-5 mt-2">
                            <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-4xl font-bold pb-2">{coffeeBatch?.familyMembers}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Mienbros de Familia</h4>
                                </div>
                            </div>
                        </div>

                        


                    </div>
                    <div className="flex flex-col lg:flex-col gap-5 mt-8">
                        <div className="flex place-content-center">


                        </div>
                    </div>
                </div>
            </div>
            <br />
        </div>

        <section>
            <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
                <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3">
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
                                            {coffeeBatch?.dryMill?.export_id !== '' && (
                                                <p> <>{t("exporting-code")}</>: <br /> <span> {coffeeBatch?.dryMill?.export_id}</span></p>
                                            )}
                                            <p><>{t("altitude")}</>: <br /> <span> {coffeeBatch?.dryMill?.height || 'Aprox 1200'}  </span></p>
                                            <p><>{t("cupping_profile")}</>: <br /> <a className="hover:underline underline-offset-1 decoration-sky-500" href={coffeeBatch?.dryMill?.cupping_url} > {coffeeBatch?.dryMill?.cupping_url}  </a></p>
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

export default NewBatchId;
