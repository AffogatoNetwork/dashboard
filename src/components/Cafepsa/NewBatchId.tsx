import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ReactI18NextChild, useTranslation } from "react-i18next";
import Loading from "../Loading";
import { getBatch, getFarmer, getFarmerFarms, getFarms } from "../../db/firebase";
import NotFound from "../common/NotFound";
import NewMap from "../common/NewMap";
import { LinkIcon } from "../icons/link";

const NewBatchId = () => {
    const { t } = useTranslation();
    const { batchId } = useParams();
    const [loading, setLoading] = useState(true);
    const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
    const [farmers, setFarmers] = useState<any>([]);
    const [ObservableFarmers, ObservableSetFarmers] = useState<any>([]);

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

                    let FarmerDetails: any[] = [];

                    setCoffeeBatch(result);
                    console.log(result)
                    if(result?.Farmers.length > 0){
                        setFarmers(result?.Farmers);
                    } else {
                        if (result?.Farmer.address !== undefined) {
                            getFarmer(result?.Farmer.address).then((result) => {
                                console.log(result);
                                FarmerDetails.push(result);
                            });
                        }
                        let Farmers = result?.Farmer;
                        if (Farmers.length > 1) {
                            Farmers.forEach((element: any) => {
                                getFarmer(element).then((result) => {
                                    let data = {
                                        address: result?.address,
                                        name: result?.fullname
                                    }
                                    FarmerDetails.push(data);
                                    setFarmers(FarmerDetails);
                                    console.log(FarmerDetails);
                                });
                            });
                        } else {
                            console.log(Farmers);
                        }

                        console.log(Farmers);
                        setFarmers(Farmers)
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



    const openInNewTab = (url: string | null | undefined) => {
        const urlStr = url?.toString();
        window.open(urlStr, '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return <Loading label="Cargando..." className="loading-wrapper" />;
    }

    return (<>



        <div className="min-w-screen min-h-screen bg-yellow-900 flex items-center px-5 lg:px-10 overflow-hidden relative flex-col">
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
                                            <h1 > <>{t("farmers")}</>: <br />
                                                <>

                                                    {farmers.map((farmer: any, index: any) => (

                                                        <div key={index}>
                                                            <p ><a className="hover:underline underline-offset-1 decoration-sky-500" href={'/farmer' + '/' + farmer?.adress} > {farmer?.name} </a>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </>
                                            </h1>
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
                            Producción
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
                                <div className="flex-grow border border-gray-300 rounded text-center py-8">
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.certifications}</h2>
                                    <h4 className="inline text-gray-500 text-sm">Certificados</h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.drying_hours || 'Aprox 1200'} </h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("drying-hours")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                  <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.process} </h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("process")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                   <h2 className="text-md font-bold pb-2">{coffeeBatch?.wetMill?.variety}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("variety")}</> </h4>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="p-2 rounded text-center bg-amber-800 text-white">
                                Beneficio Seco
                            </div>
                            <div className="flex gap-5 mt-2">
                                <div className="flex-grow border border-gray-300 rounded text-center py-8">
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.dryMill?.damage_percent}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("damage-percent")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.dryMill?.height || 'Aprox 1200'} </h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("altitude")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <button onClick={() => {
                                openInNewTab(coffeeBatch?.dryMill?.cupping_url);
                            }}
                                className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                <LinkIcon></LinkIcon>
                                <>Ver Enlace</>
                            </button>
                            <br/>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("cupping_profile")}</> </h4>
                                </div>
                                <div
                                    className="flex-grow border border-gray-300 rounded text-center py-8"
                                >
                                    <h2 className="text-md font-bold pb-2">{coffeeBatch?.dryMill?.threshing_yield}</h2>
                                    <h4 className="inline text-gray-500 text-sm"> <>{t("threshing-yield")}</> </h4>
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

      
    </>);
};

export default NewBatchId;
