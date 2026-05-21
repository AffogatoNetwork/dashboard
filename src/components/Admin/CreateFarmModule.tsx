import React, { useEffect, useState } from 'react';
import FormInput from '../common/FormInput';
import { useNavigate } from 'react-router';
import { RegionList, RegionType } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import {
  getAllFarmers,
  getCertifications,
  getFarmerFarms,
  getVarieties,
  saveFarm,
} from '../../db/firebase';

export const CreateFarmModule = () => {
  const [currentRegion, setCurrentRegion] = useState<RegionType>(RegionList[0]);
  const [farmers, setFarmers] = useState<Array<any>>([]);
  const [farmName, setFarmName] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [farmNameError, setFarmNameError] = useState('');
  const [farmAddressError, setFarmAddressError] = useState('');
  const [country, setCountry] = useState('');
  const [countryError, setCountryError] = useState('');
  const [village, setVillage] = useState('');
  const [villageError, setVillageError] = useState('');
  const [village2, setVillage2] = useState('');
  const [village2Error, setVillage2Error] = useState('');
  const [latitude, setLatitude] = useState('');
  const [latitudeError, setLatitudeError] = useState('');
  const [longitude, setLongitude] = useState('');
  const [longitudeError, setLongitudeError] = useState('');
  const [typeofProduction, setTypeofProduction] = useState('');
  const [typeofProductionError, setTypeofProductionError] = useState('');
  const [height, setHeight] = useState('');
  const [heightError, setHeightError] = useState('');
  const [varieties, setVarieties] = useState('');
  const [varietiesError, setVarietiesError] = useState('');
  const [area, setArea] = useState('');
  const [areaError, setAreaError] = useState('');
  const [shadow, setShadow] = useState('');
  const [shadowError, setShadowError] = useState('');
  const [currentCoop, setCurrentCoop] = useState('');
  const [farmerList, setFarmerList] = useState<Array<any>>([]);
  const [certificationList, setCertificationList] = useState<Array<any>>([]);
  const [certificationNames, setCertificationNames] = useState<Array<any>>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [varietyList, setVarietyList] = useState<Array<any>>([]);
  const [varietyNames, setVarietyNames] = useState<Array<any>>([]);
  const [coopError, setCoopError] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regionError, setRegionError] = useState('');
  const [createdFarmId, setCreatedFarmId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createError, setCreateError] = useState('');
  const [farmerFullname, setFarmerFullname] = useState('');
  const [existingFarms, setExistingFarms] = useState<any[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);

  useEffect(() => {
    const load = async () => {
      const location = window.location.host;
      let currentCoop = '';
      if (location.match('COMMOVEL') !== null) {
        currentCoop = 'COMMOVEL';
      } else if (location.match('copracnil') !== null) {
        currentCoop = 'COPRACNIL';
      } else if (location.match('comsa') !== null) {
        currentCoop = 'COMSA';
      } else if (location.match('proexo') !== null) {
        currentCoop = 'PROEXO';
      } else if (location.match('cafepsa') !== null) {
        currentCoop = 'CAFEPSA';
      } else {
        currentCoop = 'PROEXO';
      }
      setCurrentCoop(currentCoop);
      getAllFarmers(currentCoop).then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const farmerData = result[i].data();
          const { address, fullname } = farmerData;

          farmerList.push({
            address,
            fullname,
          });
        }
        setFarmers(farmerList);
      });

      getCertifications(currentCoop).then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          const element = data[i].data();
          const { certification } = element;
          certificationList.push(certification);
        }
        setCertificationNames(certificationList);
      });
      getVarieties().then((data: any) => {
        for (let i = 0; i < data.length; i++) {
          const element = data[i].data();
          const { variety } = element;
          varietyList.push(variety);
        }
        setVarietyNames(varietyList);
      });
    };

    load();
  }, []);

  const doSaveFarm = (nameToUse: string) => {
    setCreateError('');
    setShowConflictModal(false);
    saveFarm({
      farmerAddress: farmAddress,
      fullname: farmerFullname,
      company: currentCoop,
      name: nameToUse,
      height: height,
      area: area,
      certifications: selectedCertifications.join(', '),
      latitude: latitude,
      longitude: longitude,
      bio: '',
      country: 'Honduras',
      region: currentRegion.name,
      village: village,
      village2: village2,
      varieties: varieties,
      shadow: shadow,
      familyMembers: '',
      ethnicGroup: '',
    }).then((docId) => {
      setFarmName('');
      setFarmAddress('');
      setFarmerFullname('');
      setExistingFarms([]);
      setPendingCreate(false);
      setLatitude('');
      setLongitude('');
      setTypeofProduction('');
      setHeight('');
      setVarieties('');
      setArea('');
      setShadow('');
      setSelectedCertifications([]);
      setRegionError('');
      setCreatedFarmId(docId);
      setShowSuccessModal(true);
    }).catch((err) => {
      setCreateError(err?.message || 'Failed to create farm. Please try again.');
    });
  };

  const createFarm = () => {
    if (existingFarms.length > 0 && !pendingCreate) {
      setShowConflictModal(true);
      return;
    }
    doSaveFarm(farmName);
  };

  const handleFarmNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFarmName(value);
  };

  const handleFarmerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value;
    setFarmAddress(key);
    setPendingCreate(false);
    setExistingFarms([]);
    const farmer = farmers.find((f) => f.address === key);
    setFarmerFullname(farmer?.fullname ?? '');
    getFarmerFarms(key).then((farms) => {
      setExistingFarms(farms ?? []);
    });
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.value;
    for (let i = 0; i < RegionList.length; i += 1) {
      if (RegionList[i].key === key) {
        setCurrentRegion(RegionList[i]);
        if (key === '0') {
          setRegionError(t('signup.choose-county') || '');
        } else {
          setRegionError('');
        }
      }
    }
  };

  const countryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCountry(value);
  };

  const handleVillage2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVillage2(value);
  };

  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLatitude(value);
  };

  const handleLongitudeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setLongitude(value);
  };

  const handletypeofProductionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setTypeofProduction(value);
  };

  const handleShadowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShadow(value);
  };

  const handleareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setArea(value);
  };

  const handlevarietiesChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setVarieties(value);
  };

  const handleVillageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVillage(value);
  };

  const handleCertificationToggle = (cert: string) => {
    setSelectedCertifications(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleheightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHeight(value);
  };

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">{t('farm-created') || 'Farm Created'}</h2>
            <p className="text-gray-600 mb-4">{t('farm-id') || 'Farm ID'}:</p>
            <p className="font-mono text-sm bg-gray-100 rounded px-3 py-2 break-all mb-6 select-all">
              {createdFarmId}
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/farms', { replace: true });
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Finca existente</h2>
            <p className="text-gray-600 mb-4">
              Este productor ya tiene {existingFarms.length > 1 ? 'estas fincas' : 'esta finca'}:
            </p>
            <ul className="mb-6 flex flex-col gap-2">
              {existingFarms.map((farm) => (
                <li key={farm.name}>
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => doSaveFarm(farm.name)}
                  >
                    Actualizar &quot;{farm.name}&quot;
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => { setPendingCreate(true); setShowConflictModal(false); doSaveFarm(farmName); }}
              >
                Crear nueva finca
              </button>
              <button
                className="btn btn-ghost btn-sm w-full"
                onClick={() => setShowConflictModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {createError && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700 text-sm">
          {createError}
        </div>
      )}
      <div className="mb-6 rounded-b-lg bg-white p-4 px-4 md:p-8 ">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 gap-y-2 text-sm md:grid-cols-5 ">
            <div className="md:col-span-5">
              <FormInput
                label={t('farm-name')}
                value={farmName}
                placeholder={t('name')}
                handleOnChange={handleFarmNameChange}
                errorMsg={farmNameError}
                className="input-bordered input w-full"
              />
            </div>
            <div className="m-2 md:col-span-5">
              <h1 className="text-base font-medium">
                {' '}
                <> {t('region')}</>{' '}
              </h1>
              <select
                id="dropdown-cooperative"
                className="select-bordered select w-full"
                onChange={handleRegionChange}
              >
                <option disabled selected>
                  <> {t('region')}</>:
                </option>
                {currentRegion.name}
                {RegionList.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="m-2 md:col-span-5">
              <h1 className="text-base font-medium">
                {' '}
                <> {t('farmer')}</>{' '}
              </h1>
              <select
                id="dropdown-cooperative"
                className="select-bordered select w-full"
                onChange={handleFarmerChange}
              >
                <option disabled selected>
                  <> {t('search-farmers')}</>:
                </option>
                {farmers.map((item) => (
                  <option key={item.key} value={item.address}>
                    {item.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5">
              <FormInput
                label={t('village')}
                value={village}
                placeholder={t('village')}
                handleOnChange={handleVillageChange}
                errorMsg={villageError}
                className="input-bordered input w-full"
              />
            </div>
            <div className="md:col-span-5">
              <FormInput
                label={t('village2')}
                value={village2}
                placeholder={t('village2')}
                handleOnChange={handleVillage2Change}
                errorMsg={village2Error}
                className="input-bordered input w-full"
              />
            </div>

            <div className="md:col-span-5">
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  label={t('latitude')}
                  value={latitude}
                  placeholder={t('latitude')}
                  handleOnChange={handleLatitudeChange}
                  errorMsg={latitudeError}
                  className="input-bordered input w-full"
                />
                <FormInput
                  label={t('longitude')}
                  value={longitude}
                  placeholder={t('longitude')}
                  handleOnChange={handleLongitudeChange}
                  errorMsg={longitudeError}
                  className="input-bordered input w-full"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 gap-y-2 text-sm md:grid-cols-5">
            <div className="m-2 md:col-span-5">
              <FormInput
                label={t('shadow')}
                value={shadow}
                placeholder={t('tables.shadow')}
                handleOnChange={handleShadowChange}
                errorMsg={shadowError}
                className="input-bordered input w-full"
              />
            </div>
            <div className="md:col-span-5">
              <FormInput
                label={t('area')}
                value={area}
                placeholder={t('signup.productive-areas')}
                handleOnChange={handleareaChange}
                errorMsg={areaError}
                className="input-bordered input w-full"
              />
            </div>

            <div className="md:col-span-5">
              <FormInput
                label={t('height')}
                value={height}
                placeholder={t('tables.height')}
                handleOnChange={handleheightChange}
                errorMsg={heightError}
                className="input-bordered input w-full"
              />
            </div>
            <div className="md:col-span-5">
              <FormInput
                label={t('type-production')}
                value={typeofProduction}
                placeholder={t('tables.production-system')}
                handleOnChange={handletypeofProductionChange}
                errorMsg={typeofProductionError}
                className="input-bordered input w-full"
              />
            </div>
            <div className="md:col-span-5">
              <h1 className="text-base font-medium">
                {t('varieties')}{' '}
              </h1>
              <select
                id="dropdown-cooperative"
                className="select-bordered select w-full"
                onChange={handlevarietiesChange}
              >
                <option disabled selected>
                  {t('select-variety')}
                </option>
                {varietyList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5">
              <h1 className="text-base font-medium mb-2">
                {t('certifications')}
              </h1>
              <div className="flex flex-wrap gap-3">
                {certificationNames.map((cert) => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={selectedCertifications.includes(cert)}
                      onChange={() => handleCertificationToggle(cert)}
                    />
                    <span className="text-sm">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="flex justify-center">
          <button className="btn-primary btn" onClick={() => createFarm()}>
            <u>
              <>{t('add-farm')}</>
            </u>{' '}
          </button>
          <div className="divider divider-horizontal"></div>
          <button
            className="btn-secondary btn "
            onClick={() => navigate('/login', { replace: true })}
          >
            <u>
              <>{t('signup.back')}</>
            </u>
          </button>
        </div>
      </div>
    </>
  );
};
