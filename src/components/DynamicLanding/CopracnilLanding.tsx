import React from "react";
import "../../styles/batchlist.scss";
import {LinkIcon} from "../icons/link";
import {Blockchain} from "../icons/blockchain";
import {FarmIcon} from "../icons/farm";
import {useTranslation} from "react-i18next";
import {Facebook} from "../icons/Facebook";
import {Instagram} from "../icons/Instagram";
import {Youtube} from "../icons/Youtube";
import {WebSite} from "../icons/WebSite";


export const CopracnilLanding = () => {
    const {t} = useTranslation();

    return (<>
        <section>
            <div id="header" className="hero min-h-screen opacity-90"
                 style={{backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Copranil%2F3.jpeg?alt=media&token=45a94c40-4cc9-40ee-aa4c-2b722d694144")`}}>
                <div className="hero-overlay bg-opacity-60 bg-black"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="max-w-2xl mb-4 text-6xl font-black md:text-6xl xl:text-7xl text-white">
                            Plataforma de trazabilidad de COPRACNIL
                        </h1>
                        <p className="max-w-2xl mb-6 text-3xl font-light lg:mb-8 md:text-lg lg:text-xl xl:text-4xl text-white">
                            Nuestro café trazado con la seguridad de la tecnología de blockchain.
                        </p>
                    </div>
                </div>
            </div>

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
                                    <Blockchain/>
                                </div>
                                <h3 className="text-lg leading-normal mb-2 font-semibold text-black">BlockChain</h3>
                                <p className="text-gray-500">Tecnología y registro de información en una cadena de
                                    bloques segura, transparente y descentralizada.</p>
                                <br className="w-4"/>
                            </div>
                        </div>
                        <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                            <div
                                className="py-8 px-12 mb-12  border-b border-gray-100 bg-stone-100 shadow-lg transform transition duration-300 ease-in-out hover:-translate-y-2">
                                <div className="inline-block text-gray-900 mb-4">
                                    <LinkIcon/>
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
                                    <FarmIcon/>
                                </div>
                                <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Lotes</h3>
                                <p className="text-gray-500">Cada lote de café, con su productor y finca
                                    correspondiente, es trazado y visible en el blockchain de Ethereum.</p>
                                <br className="w-4"/>
                            </div>
                        </div>
                        <br/>
                        <div
                            className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap bg-zinc-100 rounded-lg">
                            <div
                                className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative ">
                                <iframe width="100%" height="100%" className={'absolute inset-0 opacity-75'}
                                        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=COPRANIL,%20Corqu%C3%ADn+(COPRANIL,%20Corqu%C3%ADn)&amp;t=k&amp;z=18&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"/>

                                <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                                    <div className="lg:w-1/2 px-6">
                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">Dirección
                                            : </h2>
                                        H4QM+522, carretera RN, Corquín

                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">Correo</h2>
                                        <p className="text-indigo-500 mt-1 m-3">
                                            presidencia.copranil@gmail.com
                                        </p>
                                        <p className="text-indigo-500 mt-1 m-3">
                                            copranil05@hotmail.com,
                                        </p>
                                    </div>
                                    <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">


                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">Teléfono</h2>

                                        <p className="text-indigo-500 leading-relaxed">
                                            (+504) 9481-6674
                                        </p>

                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">

                                <p className="text-gray-900 text-6xl text-center title-font font-bold  mb-1">
                                    82-83%
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
                                            <>{t('female')}:</>
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

                                <p className="leading-relaxed">Productos / Servicios</p>

                                <p className="leading-relaxed">
                                    - Comercialización y exportación de café
                                </p>
                                <p className="leading-relaxed">
                                    - Beneficio Húmedo
                                </p>

                                <p className="leading-relaxed">
                                    - Secado de café
                                </p>

                                <p className="leading-relaxed">
                                    - Elaboración de fertilizantes y foliares orgánicos a socios certificados
                                </p>

                                <p className="leading-relaxed">
                                    - Asistencia técnica a asociados
                                </p>
                                <p className="leading-relaxed">
                                    - Servicio de tostado molido de café
                                </p>

                                <p className="leading-relaxed">
                                    - Venta de café molido
                                </p>
                                <p className="leading-relaxed">
                                    - Elaboración de viveros maderables
                                </p>
                                <div className="flex mt-6 items-center justify-center pb-5">


                                </div>
                                <p className="leading-relaxed"><>{t('certificates')}:</></p>

                                <p className="leading-relaxed">
                                    Orgánico
                                </p>
                                <p className="leading-relaxed">
                                    Comercio Justo
                                </p>
                                <br/>

                                <div className=" items-center">
                                    <p className="leading-relaxed"><>{t('review')}:</></p>

                                    <span className="leading-relaxed font-black">
                                                <p className="leading-relaxed">
                                                Somos una Cooperativa de pequeños productores/as de café certificado de alta calidad, con principios y valores, que ofrece servicios de comercialización, financiamiento y asistencia técnica a sus afiliados/as; con enfoque de equidad de género y amigable con el medio ambiente, para mejorar la calidad de vida de sus familias.                                                </p>
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="fotos"
                 className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                        COPRACNIL Cooperativas Nuevas Ideas Limitada
                    </h2>

                </div>
                <div className="grid max-w-screen-lg gap-8 row-gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:mx-auto">
                    <img
                        className="object-cover w-full h-56 rounded shadow-lg"
                        src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Copranil%2F1.jpeg?alt=media&token=ad7484f0-43fb-4438-a067-8658e7573e92"
                        alt=""/>
                    <img

                        className="object-cover w-full h-56 rounded shadow-lg"
                        src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Copranil%2F2.jpeg?alt=media&token=ef95faf4-00ba-4bf4-95ba-42a85f754296"
                        alt=""/>
                    <img

                        className="object-cover w-full h-56 rounded shadow-lg"
                        src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Copranil%2F3.jpeg?alt=media&token=45a94c40-4cc9-40ee-aa4c-2b722d694144"
                        alt=""/>
                    <img

                        className="object-cover w-full h-56 rounded shadow-lg"
                        src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Copranil%2F4.jpeg?alt=media&token=d88b0442-82ec-452e-8dfa-053135ca4779"
                        alt=""/>
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
                                <a href="https://bidlab.org" rel="noopener noreferrer" target="_blank">
                                    <img alt="bid lab" className="w-15 h-10" src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FBIDLAB.png?alt=media&token=8463a32b-6f46-4b0b-9b02-8b4d8976fad5"
                                    />
                                </a>
                            </div>

                            <div className="px-5 py-2">
                                <a href="https://heifer.org" rel="noopener noreferrer" target="_blank">
                                    <img alt="heifer" className="w-15 h-10"  src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FHEIFER.png?alt=media&token=69941e33-4321-4d62-8025-662b2fd99554"
                                    />
                                </a>

                            </div>

                            <div className="px-5 py-2">


                            </div>

                        </nav>
                        <p className="text-center m-2">
                            <a
                                className="text-gray-600 text-lg font-bold" > Powered by:</a>

                        </p>

                        <div className="mx-auto p-4 flex justify-center">
                            <a href="https://affogato.co" rel="noopener noreferrer" target="_blank" className="self-center">

                                <img alt="affogato" className="w-15 h-10" src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FAffogato.png?alt=media&token=de3b790e-d8fc-4662-b081-a4d7964a87b1"
                                />
                            </a>
                        </div>
                    </div>
                </footer>

                <div className="bg-gray-100 pb-4 m-0 p-0">

                    <p className="text-center ">
                        <a
                            className="text-gray-600 text-lg font-medium" > Redes Sociales</a>
                    </p>
                    <div className="flex justify-center m-4 space-x-6">

                    <span className="inline-flex justify-center w-full gap-3 m-auto md:justify-start md:w-auto">

                       <a className="text-gray-500 hover:text-blue-500" href="https://copracnil.hn" rel="noopener noreferrer" target="_blank" >
      <WebSite/>
        </a>

                 <a className="text-gray-500 hover:text-blue-500" href="https://www.facebook.com/profile.php?id=100064793832709" rel="noopener noreferrer" target="_blank" >
      <Facebook/>
        </a>


                    </span>
                    </div>

                </div>
            </div>


        </section>
    </>);
};
