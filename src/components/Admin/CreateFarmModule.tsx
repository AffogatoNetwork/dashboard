import React, { useEffect, useState } from 'react'
import FormInput from '../common/FormInput'
import { useNavigate } from 'react-router';
import { RegionList, RegionType } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { getAllFarmers, getCertifications, getVarieties, saveFarm } from '../../db/firebase';



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
    const [currentCoop, setCurrentCoop] = useState("");
    const [farmerList, setFarmerList] = useState<Array<any>>([]);
    const [certificationList, setCertificationList] = useState<Array<any>>([]);
    const [certificationNames, setCertificationNames] = useState<Array<any>>([]);
    const [varietyList, setVarietyList] = useState<Array<any>>([]);
    const [varietyNames, setVarietyNames] = useState<Array<any>>([]);
    const [coopError, setCoopError] = useState("");
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [regionError, setRegionError] = useState("");




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
            getAllFarmers(currentCoop).then((result) => {
                console.log(result);
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

            getCertifications(currentCoop).then((data: any) => {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i].data();
                    const {
                        certification
                    } = element;
                    certificationList.push(certification);
                }
                setCertificationNames(certificationList);
            });
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




    const createFarm = () => {
        saveFarm({
            farmerAddress: farmAddress,
            company: currentCoop,
            name: farmName,
            height: height,
            area: area,
            certifications: "", // Provide a string value
            latitude: latitude,
            longitude: longitude,
            bio: '',
            country: "Honduras",
            region: currentRegion.name,
            village: village,
            village2: village,
            varieties: varieties,
            shadow: shadow,
            familyMembers: "",
            ethnicGroup: "",
        }).then((result) => {
            console.log(result);
            // Reset forms
            setFarmName("");
            setFarmAddress("");
            setLatitude("");
            setLongitude("");
            setTypeofProduction("");
            setHeight("");
            setVarieties("");
            setArea("");
            setShadow("");
            setCurrentCoop("");
            setRegionError("");
            // Show success message
            alert("Farm created successfully!");
            navigate("/farms", { replace: true });
        });
    }

    const handleFarmNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFarmName(value);
    }


    const handleFarmerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        console.log(key);
        setFarmAddress(key);
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



    const handleShadowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setShadow(value);
    }

    const handleareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setArea(value);
    }

    const handlevarietiesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setVarieties(value);
    }

    const handleheightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setHeight(value);
    }


    return (<>
        <div className="bg-white p-4 px-4 md:p-8 mb-6 rounded-b-lg ">
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
                            {farmers.map((item) => (<option key={item.key} value={item.address}>
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
                            value={village2}
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
                    <div className="md:col-span-5">
                    <h1 className="text-base font-medium"> <> {"Variedades"}</> </h1>
                        <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handlevarietiesChange}>
                            <option disabled selected><> {"Seleccione una Variedad"}</>
                                :
                            </option>
                            {varietyList.map((item) => (<option key={item} value={item}>
                                {item}
                            </option>))}
                        </select>
                    </div>

                    <div className="md:col-span-5">
                    <h1 className="text-base font-medium"> <> {"Certificados"}</> </h1>
                        <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handlevarietiesChange}>
                            <option disabled selected><> {"Seleccione un Certificado"}</>
                                :
                            </option>
                            {certificationList.map((item) => (<option key={item} value={item}>
                                {item}
                            </option>))}
                        </select>
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


