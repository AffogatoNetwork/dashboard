import React, { useEffect, useState } from "react";


const Certification = () => {
    const [company, setCompany] = useState("");
    useEffect(() => {
        const url = window.location.host.toString();
        if (url.match("commovel") !== null) {
            setCompany("commovel");
        }
        if (url.match("copracnil") !== null) {
            setCompany("copracnil");
        }
        if (url.match("comsa") !== null) {
            setCompany("comsa");
        }
        if (url.match("proexo") !== null) {
            setCompany("proexo");
        }
        if (url.match("localhost") !== null) {
            setCompany("proexo");
        }

    }, []);


    return (

        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
            </div>


            {(company === 'comsa') && (
                <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-2">

                    <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/2_Fair Trade.png')}
                            alt="" />
                        <p className="mb-4 text-lg font-bold text-center">Fair Trade</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/11_Pequeños_Productores.jpg')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">Pequeños Productores</p>

                    </div>

                    <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/4_DO Marcala.png')}
                            alt="" />
                                                <p className="mb-4 text-lg font-bold text-center"> Denominación de Origen Marcala</p>

                    </div>

                    <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/5_ConManosdeMujer.png')}
                            alt="" />
                                                <p className="mb-4 text-lg font-bold text-center"> Con Manos de Mujer</p>

                    </div>




                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/1_USDA Organic.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">USDA Organic</p>

                    </div>


                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/12_C.A.F.E. Practices.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">C.A.F.E. Practices</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/15_Bird Friendly.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">Bird Friendly</p>

                    </div>

                    <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/3_Rainforest Alliance.png')}
                            alt="" />
                                                <p className="mb-4 text-lg font-bold text-center"> Rain Forest Alliance</p>

                    </div>


                    <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt="" />
                                                <p className="mb-4 text-lg font-bold text-center"> EU Organic</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/14_Fair_Life.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center"> Fair for life</p>

                    </div>
                    <div
                        className="relative bg-white overflow-hidden md:h-64 xl:h-80 transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-center w-full h-56 pt-24 "
                            src={require('../assets/certificaciones/13_JAS.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">Agricultura Orgánica de Japón</p>

                    </div>


                </div>
            )}

            {(company === 'copracnil') && (
                <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/1_USDA Organic.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">USDA Organic</p>

                    </div>



                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/2_Fair Trade.png')}
                            alt=""
                        />
                        <p className="mb-4 text-lg font-bold text-center">Fair Trade</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/3_Rainforest Alliance.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">Rainforest Alliance</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">EU Organic</p>

                    </div>
                </div>
            )}

            {(company === 'proexo') && (
                <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/1_USDA Organic.png')}
                            alt=""
                        />
                        <p className="mb-4 text-lg font-bold text-center">USDA Organic</p>
                    </div>



                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/2_Fair Trade.png')}
                            alt=""
                        />
                        <p className="mb-4 text-lg font-bold text-center">Fair Trade</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/3_Rainforest Alliance.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">Rainforest Alliance</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">EU Organic</p>

                    </div>


                </div>
            )}

            {(company === 'commovel') && (
                <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/1_USDA Organic.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">USDA Organic</p>

                    </div>



                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/2_Fair Trade.png')}
                            alt=""
                        />
                        <p className="mb-4 text-lg font-bold text-center">Fair Trade</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/3_Rainforest Alliance.png')}
                            alt=""
                        />
                                               <p className="mb-4 text-lg font-bold text-center">Rainforest Alliance</p>

                    </div>

                    <div
                        className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                        <img
                            className="object-cover w-full h-56 md:h-64 xl:h-80"
                            src={require('../assets/certificaciones/10_EU Organic.png')}
                            alt=""
                        />
                                                <p className="mb-4 text-lg font-bold text-center">EU Organic</p>

                    </div>


                </div>
            )}


        </div>

    );
};

export default Certification;
