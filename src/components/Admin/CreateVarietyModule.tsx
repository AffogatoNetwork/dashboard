import React, { useEffect, useState } from 'react'
import FormInput from '../common/FormInput';
import { useTranslation } from "react-i18next";
import { getVarieties, saveVarietyData } from '../../db/firebase';
import Loading from "../Loading";

export const CreateVarietyModule = () => {
    const [variety, setVariety] = useState<any>([]);
    const [varietyList, setVarietyList] = useState<Array<any>>([]);
    const [varietyNames, setVarietyNames] = useState<Array<any>>([]);
    const [varietyError, setVarietyError] = useState("");
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
            getVarieties().then((data: any) => {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].data();
                    const {
                        variety
                    } = element;
                    varietyList.push(variety);
                    console.log(varietyList);
                }
                setVarietyNames(varietyList);
                console.log(varietyNames);
            });
        };
        load();
    }, []);


    const createVariety = async () => {
        setLoading(true);
        try {
            await saveVarietyData(variety, currentCoop).then(() => {
                setLoading(false);
                return true;
            });

        } catch (error) {
            console.log(error);
        }

    };

    const handleVarietyChange = (event: any) => {
        const value = event.target.value;
        setVariety(value);
    };

    if (loading) {
        return (
            <Loading label={t("loading").concat("...")} className="loading-wrapper" />
        );
    }


    return (<>
        <div className='bg-white p-4 px-4 md;p-8 mb-6 rounded-b-lg'>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-2 justify-items-center'>
                <div className="md:col-span-1">
                    <FormInput
                        label={t("varieties")}
                        value={variety}
                        placeholder={t("varieties")}
                        handleOnChange={handleVarietyChange}
                        errorMsg={varietyError}
                        className="input input-bordered w-full"
                    />
                                        <button className='btn btn-primary' onClick={() => createVariety()}> Agregar Variedad</button>

                </div>
               
                <div className='col-span-1 '>
                    <h1 className='bold'>
                        Lista de Variedades
                        {varietyList.map((variety: any) => (
                            <li key={variety}>{variety}</li>
                        ))}
                    </h1>
                </div>

            </div>
        </div>
    </>)
}
