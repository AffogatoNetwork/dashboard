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
    const [createdVariety, setCreatedVariety] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createError, setCreateError] = useState('');




    useEffect(() => {

        const load = async () => {
            const location = window.location.host;
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
            getVarieties().then((data: any) => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].data();
                    const {
                        variety
                    } = element;
                    varietyList.push(variety);
                }
                setVarietyNames(varietyList);
            });
        };
        load();
    }, []);


    const createVariety = async () => {
        if (!variety.trim()) {
            setVarietyError('Ingresa el nombre de la variedad');
            return;
        }
        setVarietyError('');
        setCreateError('');
        setLoading(true);
        try {
            await saveVarietyData(variety, currentCoop);
            setCreatedVariety(variety);
            setVariety('');
            setShowSuccessModal(true);
        } catch (error: any) {
            setCreateError(error?.message || 'Error al guardar la variedad. Intenta de nuevo.');
        } finally {
            setLoading(false);
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
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Variedad Creada</h2>
            <p className="text-gray-600 mb-4">Variedad:</p>
            <p className="font-mono text-sm bg-gray-100 rounded px-3 py-2 break-all mb-6 select-all">
              {createdVariety}
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {createError && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700 text-sm">
          {createError}
        </div>
      )}
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
