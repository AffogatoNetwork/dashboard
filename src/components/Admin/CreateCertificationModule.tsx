import React, { useEffect, useState } from 'react'
import FormInput from '../common/FormInput';
import { useTranslation } from "react-i18next";
import { getCertifications, saveCertificationData } from '../../db/firebase';
import Loading from "../Loading";

export const CreateCertificationModule = () => {
const [certification, setCertification] = useState<any>([]);
const [certificationList, setCertificationList] = useState<Array<any>>([]);
const [certificationNames, setCertificationNames] = useState<Array<any>>([]);
const [certificationError, setCertificationError] = useState("");
const [currentCoop, setCurrentCoop] = useState("");
const { t } = useTranslation();
const [loading, setLoading] = useState(false);




useEffect(() => {

    const load = async () => {
        const location = window.location.host;
        console.log(location);
        let currentCoop = "";
        if (location.match("COMMOVEL") !== null) {
            currentCoop = "COMMOVEL"
        }
        if (location.match("copracnil") !== null) {
            currentCoop = "COPRACNIL"
        }
        if (location.match("comsa") !== null) {
            currentCoop = "COMSA"
        }
        if (location.match("proexo") !== null) {
            currentCoop = "PROEXO"
        }
        if (location.match("cafepsa") !== null) {
            currentCoop = "CAFEPSA"
        } else {
            currentCoop = "PROEXO"
        }
        setCurrentCoop(currentCoop);
        console.log(currentCoop);
        getCertifications(currentCoop).then((data: any) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                const element = data[i].data();
                const {
                    certification
                } = element;
                certificationList.push(certification);
                console.log(certificationList);
            }
            setCertificationNames(certificationList);
            console.log(setCertificationList);
        });
    };
    load();
}, []);


    const createVariety = async () =>{
        setLoading(true);
        try {
            await saveCertificationData(certification, currentCoop).then(() => {
                setLoading(false);
                return true;
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleCertificationChange = (event: any) => {
        const value = event.target.value;
        setCertification(value);
    };

    if (loading) {
        return (
            <Loading label={t("loading").concat("...")} className="loading-wrapper" />
        );
    }


    return (<>
        <div className='bg-white p-4 px-4 md;p-8 mb-6 rounded-b-lg'>
            {loading ? <Loading label={t("loading").concat("...")} className="loading-wrapper" /> : 
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-2 justify-items-center'>
                <div className="md:col-span-1">
                    <FormInput
                        label={"Certificaciones"}
                        value={certification}
                        placeholder={"Nombre de Certificado"}
                        handleOnChange={handleCertificationChange}
                        errorMsg={certificationError}
                        className="input input-bordered w-full"
                    />
                                        <button className='btn btn-primary' onClick={() => createVariety()}> Agregar Certificado</button>

                </div>
               
                <div className='col-span-1 '>
                    <h1 className='bold'>
                        Lista de Certificados
                        {certificationList.map((certification: any) => (
                            <li key={certification}>{certification}</li>
                        ))}
                    </h1>
                </div>

            </div>
            }
        </div>
    </>)
}
