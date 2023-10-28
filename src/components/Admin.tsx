import React, {useEffect, useState} from "react";
import {canEdit} from "../db/firebase";
import {useTranslation} from "react-i18next";
import {EditFarmsModule} from "./Admin/EditFarmsModule";
import {EditFarmersModule} from "./Admin/EditFarmersModule";
import {EditCertificationsModule} from "./Admin/EditCertificationsModule";

export const AdminModule = () => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<any>('')
    const [isAdmin , setIsAdmin] = useState<any>(false);
    const [activeTab, setActiveTab] = useState("farmer");

    useEffect(() => {
        const load = async () => {
            const email = JSON.parse(localStorage.getItem('email') || '{}');
            setUserData(email);

            const url = window.location.host.toString();
            let company = ''
            if (url.match("commovel") !== null) {
               company = "COMMOVEL";
            }
            if (url.match("copracnil") !== null) {
                company = "COPRACNIL";
            }
            if (url.match("comsa") !== null) {
                company = "COMSA";
            }
            if (url.match("proexo") !== null) {
                company = "PROEXO";
            }
            if (url.match("cafepsa") !== null) {
                company = "CAFEPSA";
            }
            if (url.match("localhost") !== null) {
                company = "PROEXO";
            }

            await canEdit(userData, company).then((result) => {

                for (let i = 0; i < result.length; i += 1) {
                    const data = result[i].data();
                    const userExist =  data.user

                    if(userExist.includes(email)) {
                        setIsAdmin(true);
                        console.log("yes")

                    } else {
                        setIsAdmin(false);
                    }
                }
            });

        };

        load()

    }, []);


    const renderEditFarmer = () => (<>
        <EditFarmersModule/>
    </>)
    const renderEditFarm = () => (<>
        <EditFarmsModule/>
    </>)

    const renderEditCertifications = () => (<>
        <EditCertificationsModule/>
    </>)


    return (
<>
    <div className="">
        <div className=" flex flex-row mb-1 sm:mb-0 justify-between w-full">
            <div className=" w-full h-full p-1">
                <div className="card shadow-xl bg-white">
                    <div className="w-full p-5 rounded-lg">
                        <div className="text-center text-xl font-bold">
                            <h1> Modulo de Administracion </h1>
                        </div>
                    </div>
                    <div className="m-6">
                        <div className="card-title grid justify-items-stretch">

                            {isAdmin ? (
                                <>
                                    <div className="flex tabs justify-center">
                                        <a className={`${activeTab == 'farmer' && `tab btn-wide tab-lg tab-lifted tab-active`} tab btn-wide tab-lg `}
                                           id="signup-tabs"
                                           onClick={() => setActiveTab("farmer")}
                                        ><>{t("farmer")}</>
                                        </a>
                                        <a className={`${activeTab == 'farm' && `tab btn-wide tab-lg tab-lifted tab-active`} tab btn-wide tab-lg `}
                                           id="signup-tabs"
                                           onClick={() => setActiveTab("farm")}
                                        ><>{t("farm")}</>
                                        </a>

                                        <a className={`${activeTab == 'certifications' && `tab btn-wide tab-lg  tab-lifted tab-active`} tab btn-wide tab-lg `}
                                           id="signup-tabs"
                                           onClick={() => setActiveTab("certifications")}
                                        ><>{t("certifications")}</>
                                        </a>

                                    </div>

                                    {activeTab == 'farmer'  && (<div className={`overflow-hidden`}>
                                        {renderEditFarmer()}

                                    </div>)}
                                    {activeTab == 'farm' && (<div className={`overflow-hidden`}>
                                        {renderEditFarm()}

                                    </div>)}

                                    {activeTab == 'certifications' && (<div className={`overflow-hidden`}>
                                        {renderEditCertifications()}
                                    </div>)}
                                </>
                            ): (
                                <>
                                    <div className='text-center'>
                                        <h1> No tienes permisos de Administrador </h1>
                                    </div>

                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</>
    )

}


