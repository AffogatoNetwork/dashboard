import React, {useEffect, useState} from "react";


const Certification = () => {
    const [company, setCompany] = useState("");
    useEffect(() => {
        const location = window.location.host;

        if (location.match("commovel") !== null) {
            setCompany('commovel');
        }
        if (location.match("copracnil") !== null) {
            setCompany('copracnil')
        }
        if (location.match("comsa") !== null) {
            setCompany('comsa')
        }
        if (location.match("proexo") !== null) {
            setCompany('proexo')
        } else {
            setCompany('proexo')
        }

    })


    return (

        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
                <h2 className="max-w-lg mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none md:mb-6 group">
          <span className="inline-block mb-1 sm:mb-4">
            <br className="hidden md:block"/>
            Certificaciones.
          </span>
                    <div
                        className="h-1 ml-auto duration-300 origin-left transform bg-deep-purple-accent-400 scale-x-30 group-hover:scale-x-100"/>
                </h2>

            </div>
            <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                {(company === 'comsa' || company === "proexo" || company === "copracnil" || company === "commovel") && (
                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/1_USDA Organic.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">USDA Organic</p>

                        </div>
                    </div>
                )}

                    {(company === 'comsa' || company === "prexo" || company === "copracnil" || company === "commovel" || company === "proexo") && (

                        <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/2_Fair Trade.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">
                                Fair Trade
                            </p>

                        </div>
                    </div>
                        )}
                {(company === 'comsa' || company === "proexo") && (

                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/3_Rainforest Alliance.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">Rainforest Alliance</p>

                        </div>
                    </div>
                    )}
                {(company === 'comsa' || company === "proexo" || company === "copracnil" || company === "commovel") && (

                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">EU Organic</p>

                        </div>
                    </div>
                )}

                {(company === 'comsa') && (
                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/4_DO Marcala.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">
                                Denominación de Origen Marcala
                            </p>

                        </div>
                    </div>
                    )}
            </div>

            <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                {(company === 'comsa' || company === "proexo") && (

                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/5_ConManosdeMujer.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">Con manos de mujer</p>

                        </div>
                    </div>
                    )}

                {(company === 'comsa' ) && (
                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/6_UTZ Certified.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">
                                UTZ Certified
                            </p>

                        </div>
                    </div>
                    )}

                {(company === 'comsa' ) && (
                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/7_Pequeños Productores.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">Pequeños Productores</p>

                        </div>
                    </div>
                    )}
                {(company === 'comsa') && (
                    <div
                        className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt=""
                        />
                        <div
                            className="absolute inset-0 px-6 py-4 transition-opacity duration-200 bg-black bg-opacity-75 opacity-0 hover:opacity-100">
                            <p className="mb-4 text-lg font-bold text-gray-100">
                                EU Organic
                            </p>

                        </div>
                    </div>
                    )}
            </div>


        </div>

    );
};

export default Certification;
