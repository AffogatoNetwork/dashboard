import React from "react";
import "../../styles/batchlist.scss";
import { LinkIcon } from "../icons/link";
import { Blockchain } from "../icons/blockchain";
import { FarmIcon } from "../icons/farm";
import { useTranslation } from "react-i18next";
import { WebSite } from "../icons/WebSite";
import { Facebook } from "../icons/Facebook";
import { Instagram } from "../icons/Instagram";
import { Youtube } from "../icons/Youtube";

export const CafepsaLanding = () => {
    const { t } = useTranslation();

    return (<>
        <div className="bg-white card rounded-lg -mr-6 -my-6">
            <div className="bg-white">
                <div id="header" className="hero min-h-screen rounded-t-2xl"
                    style={{ backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/CAFEPSA%2F1.jpg?alt=media&token=1e15d575-f2af-44a1-b853-08ba8bf2d185")` }}>
                    <div className="hero-overlay bg-opacity-30 bg-black rounded-t-2xl"></div>
                    <div className="hero-content text-center text-neutral-content">
                        <div className="">
                            <h1 className=" mb-4 text-6xl font-black md:text-6xl xl:text-7xl text-white stroke-text"> Plataforma
                                de Trazabilidad
                            </h1>
                            <br />
                            <h1 className=" mb-4 text-6xl font-black md:text-6xl xl:text-7xl text-white stroke-text">Empresa CAFEPSA
                            </h1>

                            <p className=" mb-6 text-3xl font-light lg:mb-8 md:text-lg lg:text-xl xl:text-4xl text-white stroke-text">
                                Nuestro café trazado con la seguridad de la tecnología de blockchain
                            </p>
                            <div className="flex items-center justify-center mb-[87px]">
                                <button className="btn btn-lg bg-orange-400 hover:bg-primary text-white">
                                    <a href="/farmers-module">
                                        Ir a la Plataforma
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <section className="text-gray-600 body-font">
                    <div className="container px-5 py-24 mx-auto flex flex-wrap">
                        <div className="lg:w-2/3 mx-auto">
                            <div className="flex flex-wrap -mx-2">
                                <div className="px-2 w-1/2">
                                    <a href="/farmers-module">
                                        <div
                                            className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                                            <img className="object-cover w-full h-56 md:h-64 xl:h-80"
                                                src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/cafepsa%2FProductor.JPG?alt=media&token=431f093c-df0e-48e6-a874-b11c9d093b0e" />
                                            <p className="m-2 text-2xl font-bold text-center">
                                                Perfil de Productor
                                            </p>
                                        </div>
                                    </a>

                                </div>
                                <div className="px-2 w-1/2">
                                    <a href="/farms-module">
                                        <div className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                                            <img className="object-cover w-full h-56 md:h-64 xl:h-80"
                                                src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/cafepsa%2FFinca.jpg?alt=media&token=5fb92056-5313-48fc-86a2-4772890de246" />
                                            <p className="m-2 text-2xl font-bold text-center">
                                                Módulo Fincas de Café
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <br />
                            <div className="flex flex-wrap -mx-2">
                                <div className="px-2 w-1/2">
                                    <a href="/certification-module">
                                        <div
                                            className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                                            <img className="object-cover w-full h-56 md:h-64 xl:h-80"
                                                src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/cafepsa%2F%20Certificacion.JPG?alt=media&token=32fec183-fb46-4d60-8263-37252259dd2f" />
                                            <p className="m-2 text-2xl font-bold text-center">
                                                Sellos de Certificación
                                            </p>
                                        </div>
                                    </a>


                                </div>
                                <div className="px-2 w-1/2">
                                    <a href="/batches-module">
                                        <div
                                            className="relative bg-white overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2xl">
                                            <img className="object-cover w-full h-56 md:h-64 xl:h-80"
                                                src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/cafepsa%2FLotes.jpg?alt=media&token=820176a5-4b98-46c5-b1df-1ceec74015b3" />
                                            <p className="m-2 text-2xl font-bold text-center">
                                                Beneficiado Lotes de Café
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <div id="info" className="section relative pt-20 pb-8 md:pt-16 md:pb-0">
                    <div className="container xl:max-w-6xl mx-auto px-4">
                        <div className="flex flex-wrap flex-row -mx-4 text-center">
                            <div
                                className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp"
                                data-wow-duration="1s"
                            >
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-stone-100 shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-black mb-4">
                                        <Blockchain />
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Blockchain</h3>
                                    <p className="text-gray-500">Tecnología y registro de información en una cadena de
                                        bloques segura, transparente y descentralizada.</p>
                                    <br className="w-4" />
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-stone-100 shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <LinkIcon />
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Trazabilidad</h3>
                                    <p className="text-gray-500">Los movimientos en la cadena de valor del café, almacenados
                                        en un blockchain inmutable sin posibilidad de corromper la información.</p>
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-stone-100  shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <FarmIcon />
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Lotes</h3>
                                    <p className="text-gray-500">Cada lote de café, con su productor y finca
                                        correspondiente, es trazado y visible en el blockchain de Ethereum.</p>
                                    <br className="w-4" />
                                </div>
                            </div>
                            <br />
                            <div
                                className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap bg-zinc-100 rounded-lg">
                                <div
                                    className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative ">
                                    <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}
                                        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=CAFEPSA%20El%20trapiche&amp;t=k&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" />
                                    <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                                        <div className="lg:w-1/2 px-6">
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">Dirección: </h2>
                                            El Paraiso, El Paraiso
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">Correo</h2>
                                            <p className="text-indigo-500 mt-1 m-3">
                                                cafepsa@gmail.com
                                            </p>

                                        </div>
                                        <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">Teléfono</h2>
                                            <p className="text-indigo-500 leading-relaxed">
                                                (+504)  2793-5012/9327-9683
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">

                                    <p className="text-gray-900 text-6xl text-center title-font font-bold  mb-1">
                                        83%
                                    </p>

                                    <div className="flex mb-4 border-b-2 justify-center">
                                        <span className="flex items-center">
                                            Perfil de Taza
                                        </span>
                                    </div>
                                    <p className="leading-relaxed">Socios:</p>

                                    <div className="flex mt-4 items-center justify-center pb-2">
                                        <div className=" items-center">
                                            <span className="leading-relaxed">
                                                <>{t('female')}: </>
                                            </span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                            <div className="flex ml-6 items-center">

                                                <span className="mr-3 text-2xl font-black">
                                                    39
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex  items-center justify-center pb-2">
                                        <div className=" items-center">
                                            <span className="leading-relaxed"><>{t('male')}:</></span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                            <div className="flex ml-6 items-center">
                                                <span className="mr-3 text-2xl font-black">
                                                    94
                                                </span>
                                            </div>
                                        </span>
                                    </div>

                                    <div className="flex mt-2 items-center justify-center pb-5">
                                        <div className=" items-center">
                                            <span className="leading-relaxed"><>{t('areas')}:</></span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                            <div className="flex ml-6 items-center">

                                                <span className="mr-3 text-2xl font-black">
                                                    1,439 MZN
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                    <p className="leading-relaxed">Productos / Servicios</p>

                                    <p className="leading-relaxed">
                                        - Comercialización
                                    </p>

                                    <p className="leading-relaxed">
                                        - Trenficiado Humedo
                                    </p>

                                    <p className="leading-relaxed">
                                        - Beenficiado Seco
                                    </p>

                                    <p className="leading-relaxed">
                                        - Servicios de Exportacion
                                    </p>

                                    <p className="leading-relaxed">
                                        - Financiamiento Pre-Cosecha  y Post Cosecha
                                    </p>

                                    <p className="leading-relaxed">
                                        - Biocredito
                                    </p>

                                    <p className="leading-relaxed">
                                        - Asistencia Tecnica,Laboratorio de control de calidad
                                    </p>

                                    <p className="leading-relaxed">
                                        - Servicio de Tostaduria
                                    </p>



                                    <div className="flex mt-6 items-center justify-center pb-5">


                                    </div>
                                    <p className="leading-relaxed"><>{t('certificates')}:</>
                                    </p>

                                    <p className="leading-relaxed">
                                        Orgánico
                                    </p>
                                    <p className="leading-relaxed">
                                        Comercio Justo
                                    </p>
                                    <p className="leading-relaxed">
                                        Con Manos de Mujer
                                    </p>
                                    <p className="leading-relaxed">
                                        Simbolo de pequeños productores
                                    </p>

                                    <br />

                                    <div className=" items-center">
                                        <p className="leading-relaxed"><>{t('review')}:</>
                                        </p>

                                        <span className="leading-relaxed font-black">
                                            <p className="leading-relaxed">
                                                Somos un modelo empresarial que nació bajo la iniciativa de 24  pequeños productores de café, ubicados en el oriente de Honduras, que busca desarrollar e implementar  alternativas  agiles oportunas en  temas de  producción comercialización de café, fortalecimiento de capacidades,  acceso a crédito  y financiamiento bajo condiciones  favorable,  siendo parte del desarrollo sostenible del  entorno.
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fotos"
                    className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                    <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg: md:mb-12">
                        <h2 className="max-w-xl mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                            Cafés Especiales de El Paraíso, S.A. de C.V. (CAFEPSA)
                        </h2>

                    </div>
                    <div className="grid max-w-screen-lg gap-8 row-gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:mx-auto">
                        <img
                            className="object-cover w-full h-56 rounded shadow-lg"
                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/CAFEPSA%2F2.jpg?alt=media&token=5bb2ade1-9321-49d5-8727-be4490e7d9dd"
                            alt="" />
                        <img

                            className="object-cover w-full h-56 rounded shadow-lg"
                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/CAFEPSA%2F4.jpg?alt=media&token=a7ea9ef0-eb11-403a-a4fb-495db509e89b"
                            alt="" />
                        <img

                            className="object-cover w-full h-56 rounded shadow-lg"
                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/CAFEPSA%2F5.JPG?alt=media&token=33db5f33-1ffa-418a-8f0c-e44a07634c3c"
                            alt="" />
                        <img

                            className="object-cover w-full h-56 rounded shadow-lg"
                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/CAFEPSA%2F8.jpg?alt=media&token=68f938c1-69ad-4f88-92f8-a0c6f82ffba7"
                            alt="" />
                    </div>
                </div>

                <div className="bg-gray-100">
                    <footer>
                        <div className="px-4 py-12 pb-0 mx-auto overflow-hidden max-w-7xl sm:px-6 lg:px-8">

                            <div className="text-center p-2 ">
                                <h1 className="text-xl font-black"> Proyecto patrocinado por BID LAB y ejecutado por HEIFER
                                </h1>
                            </div>
                            <nav className="flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
                                <div className="px-5 py-2">
                                    <a href="https://heifer.org" rel="noopener noreferrer" target="_blank">
                                        <img alt="heifer" className="w-15 h-10"
                                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FHEIFER.png?alt=media&token=69941e33-4321-4d62-8025-662b2fd99554"
                                        />
                                    </a>

                                </div>
                                <div className="px-5 py-2">

                                </div>


                                <div className="px-5 py-2">
                                    <a href="https://bidlab.org" rel="noopener noreferrer" target="_blank">
                                        <img alt="bid lab" className="w-15 h-10"
                                            src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FLogo%20BID%20Lab%20-%20Color%20(SPA).png?alt=media&token=e1c9671a-f1f1-4104-b663-502faa89c893"
                                        />
                                    </a>
                                </div>

                            </nav>
                            <p className="text-center m-2">
                                <a
                                    className="text-gray-600 text-lg font-bold"> Powered by:</a>

                            </p>

                            <div className="mx-auto p-4 flex justify-center">
                                <a href="https://affogato.co" rel="noopener noreferrer" target="_blank"
                                    className="self-center">

                                    <img alt="affogato" className="w-15 h-10"
                                        src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FAffogato.png?alt=media&token=de3b790e-d8fc-4662-b081-a4d7964a87b1"
                                    />
                                </a>
                            </div>
                        </div>
                    </footer>

                    <div className="bg-gray-100 pb-4 m-0 p-0">

                        <p className="text-center ">
                            <a
                                className="text-gray-600 text-lg font-medium"> Redes Sociales</a>
                        </p>
                        <div className="flex justify-center m-4 space-x-6">

                            <span className="inline-flex justify-center w-full gap-3 m-auto md:justify-start md:w-auto">



                                <a className="text-gray-500 hover:text-blue-500"
                                    href="https://www.facebook.com/profile.php?id=100067090309183" rel="noopener noreferrer"
                                    target="_blank">
                                    <Facebook />
                                </a>

                            </span>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    </>);
};
