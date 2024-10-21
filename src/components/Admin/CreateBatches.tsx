import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import { Input } from '@mui/material';
import FarmerSelect from '../common/FarmerSelect';
import { CooperativeImage, CooperativeList } from '../../utils/constants';
import { createBatch } from '../../db/firebase';
import { useNavigate } from 'react-router';

export const CreateBatchesModule = () => {
  const [currentCoop, setCurrentCoop] = useState('');
  const [coopAddress, setCoopAddress] = useState<string | null>('');
  const [coopImage, setCoopImage] = useState<string | null>('');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    Farmer: {},
    farm: {
      name: '',
      description: '',
      id_lote: '',
      urlCatacion: '',
      urlTrilla: '',
    },
    wetMill: {
      entry_id: '',
      drying_id: '',
      facility: '',
      latitude: '',
      longitude: '',
      variety: '',
      process: '',
      drying_type: '',
      drying_hours: '',
      date: '',
      weight: '',
      certifications: '',
      note: '',
    },
    dryMill: {
      export_id: '',
      export_drying_id: '',
      facility: '',
      latitude: '',
      longitude: '',
      date: '',
      prep_type: '',
      variety: '',
      quality: '',
      coffee_type: '',
      origin_cert: '',
      threshing_process: '',
      threshing_yield: '',
      damage_percent: '',
      weight: '',
      note: '',
      buyer: '',
    },
    cupProfile: {
      acidity: '',
      aftertaste: '',
      aroma: '',
      body: '',
      flavor: '',
      note: '',
      sweetness: '',
      general_description: '',
      cup_profile: '',
      scaa_url: '',
    },
    roasting: {
      roast_date: '',
      roast_type: '',
      grind_type: '',
      packaging: '',
      bag_size: '',
    },
  });

  type FormData = {
    Farmer: { [key: number]: string };
    farm: {
      name: string;
      description: string;
      id_lote: string;
      urlCatacion: string;
      urlTrilla: string;
    };
    wetMill: {
      entry_id: string;
      drying_id: string;
      facility: string;
      latitude: string;
      longitude: string;
      variety: string;
      process: string;
      drying_type: string;
      drying_hours: string;
      date: string;
      weight: string;
      certifications: string;
      note: string;
    };
    dryMill: {
      export_id: string;
      export_drying_id: string;
      facility: string;
      latitude: string;
      longitude: string;
      date: string;
      prep_type: string;
      variety: string;
      quality: string;
      coffee_type: string;
      origin_cert: string;
      threshing_process: string;
      threshing_yield: string;
      damage_percent: string;
      weight: string;
      note: string;
      buyer: string;
    };
    cupProfile: {
      acidity: string;
      aftertaste: string;
      aroma: string;
      body: string;
      flavor: string;
      note: string;
      sweetness: string;
      general_description: string;
      cup_profile: string;
      scaa_url: string;
    };
    roasting: {
      roast_date: string;
      roast_type: string;
      grind_type: string;
      packaging: string;
      bag_size: string;
    };
  };

  const requiredFields: { [key in keyof FormData]: string[] } = {
    farm: ['name', 'description', 'id_lote'],
    wetMill: ['entry_id', 'facility', 'process'],
    dryMill: ['export_id', 'facility', 'prep_type'],
    cupProfile: ['acidity', 'aroma', 'body', 'flavor'],
    roasting: ['roast_date', 'roast_type'],
    Farmer: ['0'],
  };

  const getFirstAddressByCooperativeName = (name: string): string | null => {
    const cooperative = CooperativeList.find((coop) => coop.name === name);
    return cooperative && cooperative.addresses.length > 0
      ? cooperative.addresses[0]
      : null;
  };

  const getImageByCooperativeName = (name: string): string | null => {
    const cooperative = CooperativeImage.find((coop) => coop.name === name);
    return cooperative ? cooperative.image : null;
  };

  const resetForm = () => {
    setFormData({
      Farmer: {},
      farm: {
        name: '',
        description: '',
        id_lote: '',
        urlCatacion: '',
        urlTrilla: '',
      },
      wetMill: {
        entry_id: '',
        drying_id: '',
        facility: '',
        latitude: '',
        longitude: '',
        variety: '',
        process: '',
        drying_type: '',
        drying_hours: '',
        date: '',
        weight: '',
        certifications: '',
        note: '',
      },
      dryMill: {
        export_id: '',
        export_drying_id: '',
        facility: '',
        latitude: '',
        longitude: '',
        date: '',
        prep_type: '',
        variety: '',
        quality: '',
        coffee_type: '',
        origin_cert: '',
        threshing_process: '',
        threshing_yield: '',
        damage_percent: '',
        weight: '',
        note: '',
        buyer: '',
      },
      cupProfile: {
        acidity: '',
        aftertaste: '',
        aroma: '',
        body: '',
        flavor: '',
        note: '',
        sweetness: '',
        general_description: '',
        cup_profile: '',
        scaa_url: '',
      },
      roasting: {
        roast_date: '',
        roast_type: '',
        grind_type: '',
        packaging: '',
        bag_size: '',
      },
    });
    setSelectedFarmers([]);
    setCurrentStep(0);
    setCoopAddress('');
    setCoopImage('');
    setCurrentCoop('');
  };

  useEffect(() => {
    const load = async () => {
      const location = window.location.host;
      let currentCoop = '';
      if (location.match('COMMOVEL')) {
        currentCoop = 'COMMOVEL';
      } else if (location.match('copracnil')) {
        currentCoop = 'COPRACNIL';
      } else if (location.match('comsa')) {
        currentCoop = 'COMSA';
      } else if (location.match('proexo')) {
        currentCoop = 'PROEXO';
      } else if (location.match('cafepsa')) {
        currentCoop = 'CAFEPSA';
      } else {
        currentCoop = 'PROEXO';
      }
      setCurrentCoop(currentCoop);
      const firstAddress = getFirstAddressByCooperativeName(currentCoop);
      const image = getImageByCooperativeName(currentCoop);
      setCoopImage(image);
      setCoopAddress(firstAddress);
    };
    load();

    const currentSection = Object.keys(formData)[currentStep] as keyof FormData;
    const sectionData = formData[currentSection];
    const requiredFieldsForSection = requiredFields[currentSection];

    const isFarmerValid = () => {
      return Object.keys(formData.farm).length > 0; // Ensure at least one farmer is selected
    };

    const isValid = requiredFieldsForSection.every((field) => {
      if (field === 'Farmer') {
        return isFarmerValid();
      }
      return (sectionData as any)[field] !== '';
    });

    setIsFormValid(isValid);
  }, [formData, currentStep]);

  const fieldConfig: {
    [key in keyof FormData]: {
      [key: string]: { type: string; placeholder: string };
    };
  } = {
    farm: {
      name: { type: 'text', placeholder: 'Nombre de la Finca' },
      description: { type: 'textarea', placeholder: 'Descripción de la Finca' },
      id_lote: { type: 'text', placeholder: 'ID del Lote' },
      urlCatacion: { type: 'url', placeholder: 'URL de Catación' },
      urlTrilla: { type: 'url', placeholder: 'URL de Trilla' },
    },
    wetMill: {
      entry_id: { type: 'text', placeholder: 'ID de Entrada' },
      drying_id: { type: 'text', placeholder: 'ID de Secado' },
      facility: { type: 'text', placeholder: 'Instalación' },
      latitude: { type: 'number', placeholder: 'Latitud' },
      longitude: { type: 'number', placeholder: 'Longitud' },
      variety: { type: 'text', placeholder: 'Variedad' },
      process: { type: 'text', placeholder: 'Proceso' },
      drying_type: { type: 'text', placeholder: 'Tipo de Secado' },
      drying_hours: { type: 'number', placeholder: 'Horas de Secado' },
      date: { type: 'date', placeholder: 'Fecha de Beneficio' },
      weight: { type: 'number', placeholder: 'Peso (kg)' },
      certifications: { type: 'text', placeholder: 'Certificaciones' },
      note: { type: 'textarea', placeholder: 'Notas Adicionales' },
    },
    dryMill: {
      export_id: { type: 'text', placeholder: 'ID de Exportación' },
      export_drying_id: {
        type: 'text',
        placeholder: 'ID de Secado para Exportación',
      },
      facility: { type: 'text', placeholder: 'Instalación' },
      latitude: { type: 'number', placeholder: 'Latitud' },
      longitude: { type: 'number', placeholder: 'Longitud' },
      date: { type: 'date', placeholder: 'Fecha de Secado' },
      prep_type: { type: 'text', placeholder: 'Tipo de Preparación' },
      variety: { type: 'text', placeholder: 'Variedad' },
      quality: { type: 'text', placeholder: 'Calidad' },
      coffee_type: { type: 'text', placeholder: 'Tipo de Café' },
      origin_cert: { type: 'text', placeholder: 'Certificado de Origen' },
      threshing_process: { type: 'text', placeholder: 'Proceso de Trillado' },
      threshing_yield: {
        type: 'number',
        placeholder: 'Rendimiento de Trillado (%)',
      },
      damage_percent: {
        type: 'number',
        placeholder: 'Porcentaje de Daños (%)',
      },
      weight: { type: 'number', placeholder: 'Peso (kg)' },
      note: { type: 'textarea', placeholder: 'Notas Adicionales' },
      buyer: { type: 'text', placeholder: 'Comprador' },
    },
    cupProfile: {
      acidity: { type: 'text', placeholder: 'Acidez' },
      aftertaste: { type: 'text', placeholder: 'Regusto' },
      aroma: { type: 'text', placeholder: 'Aroma' },
      body: { type: 'text', placeholder: 'Cuerpo' },
      flavor: { type: 'text', placeholder: 'Sabor' },
      note: { type: 'textarea', placeholder: 'Notas de Cata' },
      sweetness: { type: 'text', placeholder: 'Dulzura' },
      general_description: {
        type: 'textarea',
        placeholder: 'Descripción General',
      },
      cup_profile: { type: 'text', placeholder: 'Perfil de Taza' },
      scaa_url: { type: 'url', placeholder: 'URL del Perfil SCAA' },
    },
    roasting: {
      roast_date: { type: 'date', placeholder: 'Fecha de Tostado' },
      roast_type: { type: 'text', placeholder: 'Tipo de Tostado' },
      grind_type: { type: 'text', placeholder: 'Tipo de Molienda' },
      packaging: { type: 'text', placeholder: 'Empaque' },
      bag_size: { type: 'number', placeholder: 'Tamaño de la Bolsa (g)' },
    },
    Farmer: {
      '0': { type: 'select', placeholder: 'Seleccionar Productores' }, // Assuming this is handled by a select input
    },
  };

  const handleFarmerSelect = (farmers: string[]) => {
    setSelectedFarmers(farmers);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof FormData
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < Object.keys(formData).length - 1 && isFormValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (currentStep === Object.keys(formData).length - 1) {
      // Finalize form data with `currentCoop` as `parentId`
      console.log(selectedFarmers);
      formData.Farmer = selectedFarmers; // Make sure this is an array

      const farmsDirty = `/farms/${selectedFarmers.join(', ')}`;

      let firebaseData = {
        Name: formData.farm.id_lote || formData.farm.name.trim(),
        Farm: farmsDirty,
        Cooperative: coopAddress,
        Description: formData.farm.description,
        Farmers: selectedFarmers || [], // Ensure it's an array
        image: coopImage,
        urlCatacion: formData.farm.urlCatacion,
        urlTrilla: formData.farm.urlTrilla,
        parentId: currentCoop,
        ipfsHash: formData.farm.id_lote,
        Profile: {
          acidity: formData.cupProfile.acidity,
          aftertaste: formData.cupProfile.aftertaste,
          aroma: formData.cupProfile.aroma,
          body: formData.cupProfile.body,
          flavor: formData.cupProfile.flavor,
          note: formData.cupProfile.note,
          sweetness: formData.cupProfile.sweetness,
          general_description: formData.cupProfile.general_description,
          cup_profile: formData.cupProfile.cup_profile,
          scaa_url: formData.cupProfile.scaa_url,
        },
        Roasting: {
          roast_date: formData.roasting.roast_date,
          roast_type: formData.roasting.roast_type,
          grind_type: formData.roasting.grind_type,
          packaging: formData.roasting.packaging,
          bag_size: formData.roasting.bag_size,
        },
        dryMill: {
          export_id: formData.dryMill.export_id,
          export_drying_id: formData.dryMill.export_drying_id,
          facility: formData.dryMill.facility,
          latitude: formData.dryMill.latitude,
          longitude: formData.dryMill.longitude,
          date: formData.dryMill.date,
          prep_type: formData.dryMill.prep_type,
          variety: formData.dryMill.variety,
          quality: formData.dryMill.quality,
          coffee_type: formData.dryMill.coffee_type,
          origin_cert: formData.dryMill.origin_cert,
          threshing_process: formData.dryMill.threshing_process,
          threshing_yield: formData.dryMill.threshing_yield,
          damage_percent: formData.dryMill.damage_percent,
          weight: formData.dryMill.weight,
          note: formData.dryMill.note,
          buyer: formData.dryMill.buyer,
        },
        wetMill: {
          entry_id: formData.wetMill.entry_id,
          drying_id: formData.wetMill.drying_id,
          facility: formData.wetMill.facility,
          latitude: formData.wetMill.latitude,
          longitude: formData.wetMill.longitude,
          variety: formData.wetMill.variety,
          process: formData.wetMill.process,
          drying_type: formData.wetMill.drying_type,
          drying_hours: formData.wetMill.drying_hours,
          date: formData.wetMill.date,
          weight: formData.wetMill.weight,
          certifications: formData.wetMill.certifications,
          note: formData.wetMill,
        },
      };

      createBatch(firebaseData).then((result) => {
        console.log(result);
        if (result) {
          resetForm();
        }
        alert('Lote Creado');
        navigate('/batches-module', { replace: true });
      });

      console.log(firebaseData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const renderStep = () => {
    const currentSection = Object.keys(formData)[currentStep] as keyof FormData;
    const sectionData = formData[currentSection];

    if (!sectionData) {
      return <div>Error: Section data not available</div>;
    }

    if (currentStep === 0) {
      return (
        <div className="grid grid-cols-1 gap-5 ">
          <div className="grid grid-cols-1 gap-4 gap-y-2 text-sm  ">
            <label>Seleccionar Productores</label>
            <FarmerSelect
              currentCoop={currentCoop}
              onSelect={handleFarmerSelect}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(sectionData).map(([key, value]) => {
          // Access the type and placeholder from fieldConfig
          const config = fieldConfig[currentSection]?.[key];

          if (!config) {
            return null; // Skip fields without a config
          }

          const { type, placeholder } = config;

          return (
            <div key={key}>
              <label className="w-full sm:w-24 md:w-32 lg:w-48">
                {t(`${key.replace('_', '-')}`) as string}{' '}
                {requiredFields[currentSection]?.includes(key) && '*'}
              </label>

              {/* Render input based on type */}
              <Input
                type={type} // Use dynamic type from config
                name={key}
                id={key}
                value={value}
                className="input-bordered input w-full"
                onChange={(e) => handleInputChange(e, currentSection)}
                placeholder={placeholder} // Use dynamic placeholder from config
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="my-6 justify-center rounded-b-lg bg-white p-4 px-4 md:p-8 ">
        <div className="my-4 text-center">
          Paso {currentStep + 1} de {Object.keys(formData).length}
        </div>
        <div className="text-center text-xl font-bold">
          {currentStep === 0 ? <h1>Añadir Productores</h1> : <></>}
        </div>

        <div className="text-center text-xl font-bold">
          {currentStep === 1 ? <h1>Datos de Lote</h1> : <></>}
        </div>

        <div className="text-center text-xl font-bold">
          {currentStep === 2 ? (
            <h1> Añadir datos de Beneficio Húmedo </h1>
          ) : (
            <></>
          )}
        </div>

        <div className="text-center text-xl font-bold">
          {currentStep === 3 ? (
            <h1> Añadir datos de Beneficio Seco </h1>
          ) : (
            <></>
          )}
        </div>

        <div className="text-center text-xl font-bold">
          {currentStep === 4 ? (
            <h1> Añadir datos de Perfil de Taza </h1>
          ) : (
            <></>
          )}
        </div>

        <div className="text-center text-xl font-bold">
          {currentStep === 5 ? <h1> Añadir datos de Tostaduria </h1> : <></>}
        </div>

        <div>{renderStep()}</div>

        <div className="mt-4 flex justify-center">
          <button
            className="btn-secondary btn mx-2"
            disabled={currentStep === 0}
            onClick={handlePrevious}
          >
            Anterior
          </button>
          <button
            className="btn-primary btn mx-2"
            disabled={!isFormValid}
            onClick={handleNext}
          >
            {currentStep === Object.keys(formData).length - 1
              ? 'Crear Lote'
              : 'Siguiente'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateBatchesModule;
