import React from "react";
import {setMulticallAddress} from "ethers-multicall";
// import { useTranslation } from "react-i18next";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";
import { LinkIcon } from "../icons/link";
import { FarmIcon } from "../icons/farm";
import { Blockchain } from "../icons/blockchain";

export const Landing = () => {
    setMulticallAddress(10, "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a");

    return (
        <>
            <section className="">
                <div
                    className="relative flex flex-col-reverse px-4 py-16 mx-auto lg:block lg:flex-col lg:py-32 xl:py-48 md:px-8 sm:max-w-xl md:max-w-full">
                    <div
                        className="z-0 flex justify-center h-full -mx-4 overflow-hidden lg:pt-24 lg:pb-16 lg:pr-8 xl:pr-0 lg:w-1/2 lg:absolute lg:justify-end lg:bottom-0 lg:left-0 lg:items-center">
                        <img
                            src="https://kitwind.io/assets/kometa/laptop.png"
                            className="object-cover object-right w-full h-auto lg:w-auto lg:h-full"
                            alt=""
                        />
                    </div>
                    <div className="relative flex justify-end max-w-xl mx-auto xl:pr-32 lg:max-w-screen-xl">
                        <div className="mb-16 lg:pr-5 lg:max-w-lg lg:mb-0">
                            <div className="max-w-xl mb-6">
                                <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                                    Plataforma de trazabilidad con tecnología BlockChain.
                                    <br/> Empresa/Cooperativa
                                </h1>
                                <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Creada
                                    con el proposito de hacer de la trazabilidad del cafe algo mas </p>
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
                                    <p className="text-gray-500">This is a wider card with supporting text below as a
                                        natural
                                        content.</p>
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-zinc-50 transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <LinkIcon/>
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Trazabilidad</h3>
                                    <p className="text-gray-500">This is a wider card with supporting text below as a
                                        natural
                                        content.</p>
                                </div>
                            </div>
                            <div className="flex-shrink px-4 max-w-full w-full sm:w-1/2 lg:w-1/3 lg:px-6 wow fadeInUp">
                                <div
                                    className="py-8 px-12 mb-12  border-b border-gray-100 bg-zinc-50 transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="inline-block text-gray-900 mb-4">
                                        <FarmIcon/>
                                    </div>
                                    <h3 className="text-lg leading-normal mb-2 font-semibold text-black">Lotes</h3>
                                    <p className="text-gray-500">This is a wider card with supporting text below as a
                                        natural
                                        content.</p>
                                </div>
                            </div>
                            <br/>
                            <div
                                className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap bg-zinc-100 rounded-lg">
                                <div
                                    className="lg:w-2/3 md:w-1/2 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative ">
                                    <iframe width="100%" height="100%" className="absolute inset-0 opacity-75" title="map"
                                            src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=%C4%B0zmir+(My%20Business%20Name)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
                                    ></iframe>
                                    <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                                        <div className="lg:w-1/2 px-6">
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">Dirección</h2>
                                            <p className="mt-1">Photo booth tattooed </p>
                                        </div>
                                        <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                                            <a className="text-indigo-500 leading-relaxed">example@email.com</a>
                                            <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                                            <p className="leading-relaxed">123-456-7890</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                    <h1 className="text-gray-900 text-6xl text-center title-font font-bold  mb-1">83%</h1>
                                    <div className="flex mb-4 border-b-2 justify-center">
          <span className="flex items-center">
          Perfil de Taza
          </span>
                                    </div>
                                    <div className="flex mt-6 items-center justify-center pb-5">
                                        <div className=" items-center">
                                            <span className="leading-relaxed">Socios:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">
                                            <span className="mr-3 text-2xl font-black">246</span>
                                        </div>
                                            </span>
                                    </div>
                                    <p className="leading-relaxed">Fam locavore kickstarter</p>


                                    <div className="flex mt-6 items-center justify-center pb-5">
                                        <div className=" items-center">
                                            <span className="leading-relaxed font-black">Area Productiva:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">
                                            <span className="mr-3 text-2xl font-black">2245</span>
                                        </div>
                                            </span>
                                    </div>
                                    <p className="leading-relaxed">Fam locavore kickstarter</p>


                                    <div className="flex mt-6 items-center justify-center pb-5">
                                        <div className=" items-center">
                                            <span className="leading-relaxed font-black">Producción:</span>
                                        </div>
                                        <span className="flex ml-3 pl-3 py-2 space-x-2s">
                                        <div className="flex ml-6 items-center">
                                            <span className="mr-3 text-2xl font-black">59989</span>
                                        </div>
                                            </span>
                                    </div>
                                    <p className="leading-relaxed">Fam locavore kickstarter</p>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};
