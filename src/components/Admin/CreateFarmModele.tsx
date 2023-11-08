import React, { useEffect, useState } from 'react'
import FormInput from '../common/FormInput'
import { useNavigate } from 'react-router';
import { CooperativeList, RegionList, RegionType } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { getAllFarmers } from '../../db/firebase';



export const CreateFarmModule = () => {
    const [currentRegion, setCurrentRegion] = useState<RegionType>(RegionList[0]);
const [farmers, setFarmers] = useState<Array<any>>([]);
const [farmName, setFarmName] = useState("");
const [farmAddress, setFarmAddress] = useState("");
const [farmNameError, setFarmNameError] = useState("");
const [farmAddressError, setFarmAddressError] = useState("");
const [country, setCountry] = useState("");
const [countryError, setCountryError] = useState("");
const [village, setVillage] = useState("");
const [villageError, setVillageError] = useState("");
const [village2, setVillage2] = useState("");
const [village2Error, setVillage2Error] = useState("");
const [latitude, setLatitude] = useState("");
const [latitudeError, setLatitudeError] = useState("");
const [longitude, setLongitude] = useState("");
const [longitudeError, setLongitudeError] = useState("");
const [typeofProduction, setTypeofProduction] = useState("");
const [typeofProductionError, setTypeofProductionError] = useState("");
const [height, setHeight] = useState("");
const [heightError, setHeightError] = useState("");
const [varieties, setVarieties] = useState("");
const [varietiesError, setVarietiesError] = useState("");
const [area, setArea] = useState("");
const [areaError, setAreaError] = useState("");
const [shadow, setShadow] = useState("");
const [shadowError, setShadowError] = useState("");
const [currentCoop, setCurrentCoop] = useState(CooperativeList[0]);
const [farmerList, setFarmerList] = useState<Array<any>>([]);
const [coopError, setCoopError] = useState("");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [regionError, setRegionError] = useState("");
    



    useEffect(() => {
    
        const load = async () => {
            const location = window.location.host;
            if (location.match("localhost") !== null) {
                setCurrentCoop(CooperativeList[1]);
            }
            if (location.match("copracnil") !== null) {
                setCurrentCoop(CooperativeList[2]);
            }
            if (location.match("comsa") !== null) {
                setCurrentCoop(CooperativeList[3]);
            }
            if (location.match("proexo") !== null) {
                setCurrentCoop(CooperativeList[4]);
            }
            if (location.match("cafepsa") !== null) {
                setCurrentCoop(CooperativeList[5]);
            }
            await getAllFarmers(currentCoop.name).then((result) => {
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        address,
                        fullname,
                    } = farmerData;
                
                    farmerList.push({
                        address,
                        fullname,
                    });
                }
                setFarmers(farmerList);
                console.log(farmers);
                // calculateFarmersCount(result);
            });
        };
        load();
    }, []);




    const createFarm = () => {

        
    }

    const handleFarmNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFarmName(value);
    }


    const handleFarmerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        for (let i = 0; i < farmers.length; i += 1) {
            if (farmers[i].key === key) {
                setFarmAddress(farmers[i]);
                if (key === "0") {
                    setFarmAddressError(t("signup.choose-company"));
                } else {
                    setFarmAddressError("");
                }
            }
        }
    }



    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        for (let i = 0; i < RegionList.length; i += 1) {
            if (RegionList[i].key === key) {
                setCurrentRegion(RegionList[i]);
                if (key === "0") {
                    setRegionError(t("signup.choose-county"));
                } else {
                    setRegionError("");
                }
            }
        }
    };


    const countryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCountry(value);
    }

    const handleVillage2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVillage2(value);
    }

    const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLatitude(value);
    }

    const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLongitude(value);
    }

    const handletypeofProductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTypeofProduction(value);
    }

    const handleCooperativeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        for (let i = 0; i < CooperativeList.length; i += 1) {
            if (CooperativeList[i].key === key) {
                setCurrentCoop(CooperativeList[i]);
                if (key === "0") {
                    setCoopError(t("signup.choose-company"));
                } else {
                    setCoopError("");
                }
            }
        }
    }

   const handleShadowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setShadow(value);
    }

    const handleareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setArea(value);
    }

    const handlevarietiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVarieties(value);
    }

    const handleheightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setHeight(value);
    }


    return ( <>
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 rounded-b-lg ">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 ">
                    <div className="md:col-span-5">
                        <FormInput
                            label={t("farm-name")}
                            value={farmName}
                            placeholder={t("name")}
                            handleOnChange={handleFarmNameChange}
                            errorMsg={farmNameError}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="md:col-span-5 m-2">
                        <h1 className="text-base font-medium"> <> {t("region")}</> </h1>
                        <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handleRegionChange}>
                            <option disabled selected><> {t("region")}</>
                                :
                            </option>
                            {currentRegion.name}
                            {RegionList.map((item) => (<option key={item.key} value={item.key}>
                                {item.name}
                            </option>))}
                        </select>
                    </div>
                    <div className="md:col-span-5 m-2">
                        <h1 className="text-base font-medium"> <> {t("farmer")}</> </h1>
                        <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handleFarmerChange}>
                            <option disabled selected><> {t("search-farmers")}</>
                                :
                            </option>
                            {farmers}
                            {farmers.map((item) => (<option key={item.key} value={item.fullname}>
                                {item.fullname}
                            </option>))}
                        </select>
                    </div>
                    <div className="md:col-span-5">
                        <FormInput
                            label={t("village")}
                            value={country}
                            placeholder={t("village")}
                            handleOnChange={countryChange}
                            errorMsg={countryError}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="md:col-span-5">
                        <FormInput
                            label={t("village2")}
                            value={village}
                            placeholder={t("village2")}
                            handleOnChange={handleVillage2Change}
                            errorMsg={village2Error}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="md:col-span-5">
                        <div className="grid grid-cols-2 gap-2">
                            <FormInput
                                label={t("latitude")}
                                value={latitude}
                                placeholder={t("latitude")}
                                handleOnChange={handleLatitudeChange}
                                errorMsg={latitudeError}
                                className="input input-bordered w-full"
                            />
                            <FormInput
                                label={t("longitude")}
                                value={longitude}
                                placeholder={t("longitude")}
                                handleOnChange={handleLongitudeChange}
                                errorMsg={longitudeError}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5 m-2">
                        <h1 className="text-base font-medium"> <> {t("signup.choose-company")}</></h1>
                        <select id="dropdown-cooperative" className="select select-bordered w-full"
                            onChange={handleCooperativeChange}>
                            <option disabled selected><> {t("signup.choose-company")}</>
                                :
                            </option>
                            {currentCoop.name}

                            {CooperativeList.map((item) => (<option key={item.key} value={item.key}>
                                {item.name}
                            </option>))}
                        </select>
                    </div>


                    <div className="md:col-span-5 m-2">
                        <FormInput
                                label={t("shadow")}
                                value={shadow}
                                placeholder={t("tables.shadow")}
                                handleOnChange={handleShadowChange}
                                errorMsg={shadowError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("area")}
                                value={area}
                                placeholder={t("signup.productive-areas")}
                                handleOnChange={handleareaChange}
                                errorMsg={areaError}
                                className="input input-bordered w-full"
                            />
                        </div>

                    <div className="md:col-span-5">
                        <FormInput
                            label={t("varieties")}
                            value={varieties}
                            placeholder={t("tables.coffee-varieties")}
                            handleOnChange={handlevarietiesChange}
                            errorMsg={varietiesError}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="md:col-span-5">
                        <FormInput
                            label={t("height")}
                            value={height}
                            placeholder={t("tables.height")}
                            handleOnChange={handleheightChange}
                            errorMsg={heightError}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="md:col-span-5">
                        <FormInput
                            label={t("type-production")}
                            value={typeofProduction}
                            placeholder={t("tables.production-system")}
                            handleOnChange={handletypeofProductionChange}
                            errorMsg={typeofProductionError}
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

            </div>
            <br />
            <div className="flex justify-center">
                <button
                    className="btn btn-primary"
                    onClick={() => createFarm()}
                >
                    <u>
                        <>{t("add-farm")}</>
                    </u>                    </button>
                <div className="divider divider-horizontal"></div>
                <button
                    className="btn btn-secondary "
                    onClick={() => navigate("/login", { replace: true })}
                >
                    <u>
                        <>{t("signup.back")}</>
                    </u>
                </button>
            </div>
        </div>
    </>)
}


