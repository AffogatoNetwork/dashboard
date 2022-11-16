import React, {useEffect} from "react";
import {setMulticallAddress} from "ethers-multicall";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";
import { LinkIcon } from "../icons/link";
import { FarmIcon } from "../icons/farm";
import { Blockchain } from "../icons/blockchain";
import {FarmList} from "../../utils/constants"
import CoopLocation from "../common/CoopLocation";
export const Landing = () => {
    setMulticallAddress(10, "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a");


    const location = window.location.host;
    let FarmData: { key: string; id: string; nombre: string; Msocios: number; Fsocios: number; email: string; telefono: string; direccion: string; lat: string; long: string; perfiltaza: string; bio: string; area: string; productos: string[]; gerente: string; website: string; social: string; certificados: string[]; imagen1: string; imagen2: string; imagen3: string; imagen4: string;  } | { key: string; id: string; nombre: string; Msocios: number; Fsocios: number; email: string; telefono: string; direccion: string; lat: string; long: string; perfiltaza: string; bio: string; area: string; productos: string[]; gerente: string; website: string; social: string; certificados: string[]; imagen1?: undefined; imagen2?: undefined; imagen3?: undefined; imagen4?: undefined; };

    
    FarmGet(location);

    useEffect(() => {
        let location = window.location.host;
        FarmGet(location)
    });

    function FarmGet(location: string){
        if (location.match("commovel") !== null) {
            FarmData = FarmList[1]
            console.log("commovel")
        }

        if (location.match("copranil") !== null) {
            FarmData = FarmList[2]
            console.log("copranil")
        }
        if (location.match("comsa") !== null) {
            FarmData = FarmList[3]
            console.log("comsa")
        }

        if (location.match("proexo") !== null) {
            FarmData = FarmList[4]
            console.log("proexo")
        } if (location.match("affogato") !== null) {
            console.log("affogato")
            FarmData = FarmList[0]
        } else {
            FarmData = FarmList[0]
            console.log(location)

        }
    }




    return (

        <>

            <section >
                <div className="relative overflow-y-scroll w-full h-auto">
                <div
                    className="relative flex flex-col-reverse px-4 py-16 mx-auto lg:block lg:flex-col lg:py-32 xl:py-48 md:px-8 sm:max-w-xl md:max-w-full">
                    <div
                        className="z-0 flex justify-center h-full -mx-4 overflow-hidden lg:pt-24 lg:pb-16 lg:pr-8 xl:pr-0 lg:w-1/2 lg:absolute lg:justify-end lg:bottom-0 lg:left-0 lg:items-center">
                        <img
                            src={require('../../assets/coffe.png')}
                            className="object-cover object-right w-full h-auto lg:w-auto lg:h-full"
                            alt=""
                        />
                    </div>
                    <div className="relative flex justify-end max-w-xl mx-auto xl:pr-32 lg:max-w-screen-xl">
                        <div className="mb-16 lg:pr-5 lg:max-w-lg lg:mb-0">
                            <div className="max-w-xl mb-6">
                                    <br/>
                                            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                                            Plataforma de trazabilidad de
                                       {" " + FarmData!.nombre}
                                   </h1>

<p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
    Nuestro café trazado con la seguridad de la tecnología de blockchain.

</p>


                                <br className="hidden md:block"/>
                            </div>
                        </div>
                    </div>
                </div>


                <br/>
                <div id="info" className="section relative pt-20 pb-8 md:pt-16 md:pb-0">
                    <div className="container xl:max-w-6xl mx-auto px-4">
                        <div className="flex flex-wrap flex-row -mx-4 text-center">
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp"
                                 data-wow-duration="1s"
                            >
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-zinc-50 transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-black mb-4">
                                        <Blockchain/>
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">BlockChain</h3>
                                    <p className="text-gray-500">Tecnología y registro de información en una cadena de bloques segura, transparente y descentralizada.</p>
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-zinc-50 transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <LinkIcon/>
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Trazabilidad</h3>
                                    <p className="text-gray-500">Los movimientos en la cadena de valor del café, almacenados en un blockchain inmutable sin posibilidad de corromper la información.</p>
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-zinc-50 transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <FarmIcon/>
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Lotes</h3>
                                    <p className="text-gray-500">Cada lote de café, con su productor y finca correspondiente, es trazado y visible en el blockchain de Ethereum.</p>
                                </div>
                            </div>
                            <br/>
                            <div
                                className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap bg-zinc-100 rounded-lg">
                                <div
                                    className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative ">
                                    <CoopLocation className=""/>

                                    <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                                        <div className="lg:w-1/2 px-6">
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">Dirección</h2>
                                            {FarmData!.direccion}

                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">EMAIL</h2>

                                                    <p className="text-indigo-500 mt-1 m-3">
                                                        {FarmData!.email}
                                                    </p>

                                        </div>
                                        <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">


                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>

                                                <p className="text-indigo-500 leading-relaxed">
                                                    {FarmData!.telefono}
                                                </p>

                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">

                                            <p className="text-gray-900 text-6xl text-center title-font font-bold  mb-1">
                                                {FarmData!.perfiltaza}
                                            </p>


                                    <div className="flex mb-4 border-b-2 justify-center">
          <span className="flex items-center">
          Perfil de Taza
          </span>
                                    </div>
                                    <p className="leading-relaxed">Socios:</p>

                                    <div className="flex mt-4 items-center justify-center pb-2">
                                        <div className=" items-center">
                                            <span className="leading-relaxed">Mujeres:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">

                                                    <span className="mr-3 text-2xl font-black">
                                                        {FarmData!.Fsocios}
                                                    </span>
                                        </div>
                                            </span>
                                    </div>
                                    <div className="flex  items-center justify-center pb-2">
                                        <div className=" items-center">
                                            <span className="leading-relaxed">Hombres:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">
                                                    <span className="mr-3 text-2xl font-black">
                                                        {FarmData!.Msocios}
                                                    </span>
                                        </div>
                                            </span>
                                    </div>

                                    <div className="flex mt-2 items-center justify-center pb-5">
                                        <div className=" items-center">
                                            <span className="leading-relaxed font-black">Area Productiva:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">

                                                    <span className="mr-3 text-2xl font-black">
                                                        {FarmData!.area}
                                                    </span>
                                        </div>
                                            </span>
                                    </div>
                                    <p className="leading-relaxed">Productos / Servicios</p>

                                            <p className="leading-relaxed">
                                                        {FarmData!.productos}
                                                    </p>

                                    <div className="flex mt-6 items-center justify-center pb-5">


                                    </div>
                                    <p className="leading-relaxed">Certificados</p>

                                            <p className="leading-relaxed">
                                                {FarmData!.certificados}
                                            </p>
                                    <br/>

                                    <div className=" items-center">
                                        <p className="leading-relaxed">Reseña</p>

                                        <span className="leading-relaxed font-black">
                                                <p className="leading-relaxed">
                                                    {FarmData!.bio}
                                                </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                <div id="fotos" className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                    <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                            {FarmData!.nombre}
                        </h2>

                    </div>
                    <div className="grid max-w-screen-lg gap-8 row-gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:mx-auto">
                        <img src={ FarmData!.imagen1}
                            className="object-cover w-full h-56 rounded shadow-lg"
                            alt=""
                        />
                        <img
                            src={ FarmData!.imagen2}
                            className="object-cover w-full h-56 rounded shadow-lg"
                            alt=""
                        />
                        <img
                            src={ FarmData!.imagen3}
                            className="object-cover w-full h-56 rounded shadow-lg"
                            alt=""
                        />
                        <img
                            src={ FarmData!.imagen4}
                            className="object-cover w-full h-56 rounded shadow-lg"
                            alt=""
                        />
                    </div>

                </div>


            </section>
              
        </>
    );
};
