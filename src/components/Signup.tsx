import React, {useEffect, useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import MultipleValueTextInput from "react-multivalue-text-input";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import User from "../assets/user.png";
import {useAuthContext} from "../states/AuthContext";
import CoopLogo from "./common/CoopLogo";
import Loading from "./Loading";
import FormInput from "./common/FormInput";
import "../styles/signup.scss";
import {errorNotification, isValidCellphone, isValidEmail, notifyUser,} from "../utils/utils";
import {CooperativeList, CooperativeType, GenderList, RegionList, RegionType,} from "../utils/constants";

const Signup = () => {
    const {t} = useTranslation();
    const areaCode = "+504";
    const navigate = useNavigate();
    const {authContext, authState} = useAuthContext();
    const [state] = authState;
    const [activeTab, setActiveTab] = useState("farmer");
    const [selectedImage, setSelectedImage] = useState("");
    const [imageFile, setImageFile] = useState();
    const [userName, setUserName] = useState("");
    const [farmerId, setFarmerId] = useState("");
    const [cooperativeId, setCooperativeId] = useState("");
    const [fullname, setFullname] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [farmerIdError, setFarmerIdError] = useState("");
    const [fullnameError, setFullnameError] = useState("");
    const [coopError, setCoopError] = useState("");
    const [currentGender, setCurrentGender] = useState<RegionType>(GenderList[0]);
    const [currentCoop, setCurrentCoop] = useState<CooperativeType>(CooperativeList[0]);
    const [currentRegion, setCurrentRegion] = useState<RegionType>(RegionList[0]);
    const [regionError, setRegionError] = useState("");
    const [village, setVillage] = useState("");
    const [villageError, setVillageError] = useState("");
    const [village2, setVillage2] = useState("");
    const [village2Error, setVillage2Error] = useState("");
    const [bio, setBio] = useState("");
    const [bioError, setBioError] = useState("");
    const hiddenFileInput = useRef(null);
    // Cooperative fields
    const [isEmailUser, setEmailUser] = useState(true);
    const [cellphone, setCellphone] = useState("");
    const [cellphoneError, setCellphoneError] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [addressLineError, setAddressLineError] = useState("");
    const [socialReason, setSocialReason] = useState("");
    const [socialReasonError, setSocialReasonError] = useState("");
    const [cupProfile, setCupProfile] = useState("");
    const [cupProfileError, setCupProfileError] = useState("");
    const [longitude, setLongitude] = useState("");
    const [longitudeError, setLongitudeError] = useState("");
    const [latitude, setLatitude] = useState("");
    const [latitudeError, setLatitudeError] = useState("");
    const [review, setReview] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [productiveAreas, setProductiveAreas] = useState("");
    const [productiveAreasError, setProductiveAreasError] = useState("");
    const [products, setProducts] = useState<Array<string>>([]);
    const [socialNetworks, setSocialNetworks] = useState<Array<string>>([]);
    const [website, setWebsite] = useState("");
    const [websiteError, setWebsiteError] = useState("");
    const [managerName, setManagerName] = useState("");
    const [managerNameError, setManagerNameError] = useState("");
    const [noPartnersM, setNoPartnersM] = useState("");
    const [noPartnersMError, setNoPartnersMError] = useState("");
    const [noPartnersF, setNoPartnersF] = useState("");
    const [noPartnersFError, setNoPartnersFError] = useState("");

    const cleanFields = () => {
        setUserName("");
        setFarmerId("");
        setSelectedImage("");
        setCurrentCoop(CooperativeList[0]);
    };

    const setCooperative = () => {
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
    };

    useEffect(() => {
        setCooperative();
        const checkAccount = () => {
            if (state.accountCreated) {
                notifyUser("La cuenta ha sido creada!");
                cleanFields();
            } else {
                errorNotification("No se pudo crear la cuenta!");
            }
        };
        const checkIsLoggedIn = () => {
            if (state.isLoggedIn) {
            }
        };
        if (state.accountCreated || state.creatingAccountError) {
            checkAccount();
        } else {
            checkIsLoggedIn();
        }
        // eslint-disable-next-line
    }, [state.isLoggedIn, state.creatingAccountError, state.accountCreated]);

    const isValid = (): boolean => {
        let valid = true;
        if (!isValidCellphone(userName) && !isValidEmail(userName)) {
            setUserNameError("El valor no es valido.");
            valid = false;
        }
        if (farmerId.trim().length > 25) {
            setFarmerIdError("Valor debe de tener menos de 25 carácteres.");
            valid = false;
        }
        if (currentCoop.key === "0") {
            setCoopError("Seleccione una empresa.");
            valid = false;
        }
        return valid;
    };

    const farmerData = {
        address: "",
        farmerId,
        fullname,
        bio,
        gender: currentGender.key,
        country: "Honduras",
        region: currentRegion.key,
        company: currentCoop.name,
        cooperativeId,
        village,
        village2,
    };

    const companyData = {
        address: "",
        name: currentCoop.name,
        cellphone: isEmailUser ? cellphone : userName,
        email: isEmailUser ? userName : cellphone,
        addressLine,
        socialReason,
        latitude,
        longitude,
        review,
        avgCupProfile: cupProfile,
        website,
        socialNetworks,
        productiveAreas,
        products,
        managerName,
        malePartners: noPartnersM,
        femalePartners: noPartnersF,
    };

    const magicLogin = async () => {
        if (isValid()) {
            const data = {
                emailLogin: true,
                credential: userName.trim(),
                cooperative: currentCoop,
                farmerId,
                isFarmer: activeTab === "farmer",
                farmerData,
                imageFile,
                companyData,
            };
            if (isValidEmail(userName.trim())) {
                authContext.createAccount(data);
            } else if (isValidCellphone(userName.trim())) {
                data.credential = areaCode.concat(userName.trim());
                data.emailLogin = false;
                authContext.createAccount(data);
            }
        } else {
            errorNotification("Los datos no son validos");
        }
    };

    const handleOnImageChange = (event: any) => {
        if (event.target.files !== null) {
            setImageFile(event.target.files[0]);
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleClick = (event: any) => {
        if (hiddenFileInput) {
            // @ts-ignore
            hiddenFileInput.current.click();
        } else {
            console.log(event);
        }
    };

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setUserName(input);
        if (isValidCellphone(input) || isValidEmail(input)) {
            setEmailUser(isValidEmail(input));
            setUserNameError("");
        } else {
            setUserNameError(t("errors.no-valid"));
        }
    };

    const handleIdProductorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setCooperativeId(input);
        if (input.trim().length > 25) {
            setFarmerIdError(t("errors.max-length", {length: 25}));
        } else {
            setFarmerIdError("");
        }
    };


    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setFarmerId(input);
        if (input.trim().length > 70) {
            setFullnameError(t("errors.max-length", {length: 70}));
        } else {
            setFullnameError("");
        }
    };


    const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setFullname(input);
        if (input.trim().length > 70) {
            setFullnameError(t("errors.max-length", {length: 70}));
        } else {
            setFullnameError("");
        }
    };

    const handleVillageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setVillage(input);
        if (input.trim().length > 70) {
            setVillageError(t("errors.max-length", {length: 25}));
        } else {
            setVillageError("");
        }
    };

    const handleVillage2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setVillage2(input);
        if (input.trim().length > 70) {
            setVillage2Error(t("errors.max-length", {length: 25}));
        } else {
            setVillage2Error("");
        }
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setBio(input);
        if (input.trim().length > 700) {
            setBioError(t("errors.max-length", {length: 700}));
        } else {
            setBioError("");
        }
    };

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
    };

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

    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        for (let i = 0; i < GenderList.length; i += 1) {
            if (GenderList[i].key === key) {
                setCurrentGender(GenderList[i]);
            }
        }
    };

    // Cooperative handlers
    const handleCellphoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setCellphone(input);
        const valid = isEmailUser ? isValidCellphone(input) : isValidEmail(input);
        if (!valid) {
            setCellphoneError(t("errors.no-valid"));
        } else {
            setCellphoneError("");
        }
    };

    const handleAddressLineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setAddressLine(input);
        if (input.trim().length > 150) {
            setAddressLineError(t("errors.max-length", {length: 150}));
        } else {
            setAddressLineError("");
        }
    };

    const handleSocialReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setSocialReason(input);
        if (input.trim().length > 70) {
            setSocialReasonError(t("errors.max-length", {length: 70}));
        } else {
            setSocialReasonError("");
        }
    };

    const handleCupProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setCupProfile(input);
        if (Number.isNaN(input)) {
            setCupProfileError(t("errors.no-valid"));
        } else {
            setCupProfileError("");
        }
    };

    const handleLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setLongitude(input);
        if (Number.isNaN(input)) {
            setLongitudeError(t("errors.no-valid"));
        } else {
            setLongitudeError("");
        }
    };

    const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setLatitude(input);
        if (Number.isNaN(input)) {
            setLatitudeError(t("errors.no-valid"));
        } else {
            setLatitudeError("");
        }
    };

    const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setReview(input);
        if (input.trim().length > 700) {
            setReviewError(t("errors.max-length", {length: 700}));
        } else {
            setReviewError("");
        }
    };

    const handleProductivesAreasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setProductiveAreas(input);
        if (input.trim().length > 300) {
            setProductiveAreasError(t("errors.max-length", {length: 300}));
        } else {
            setProductiveAreasError("");
        }
    };

    const handleManagerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setManagerName(input);
        if (input.trim().length > 80) {
            setManagerNameError(t("errors.max-length", {length: 80}));
        } else {
            setManagerNameError("");
        }
    };

    const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setWebsite(input);
        if (Number.isNaN(input)) {
            setWebsiteError(t("errors.no-valid"));
        } else {
            setWebsiteError("");
        }
    };

    const handleNoPartnersMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setNoPartnersM(input);
        if (Number.isNaN(input)) {
            setNoPartnersMError(t("errors.no-valid"));
        } else {
            setNoPartnersMError("");
        }
    };

    const handleNoPartnersFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setNoPartnersF(input);
        if (input.trim().length > 120) {
            setNoPartnersFError(t("errors.max-length", {length: 120}));
        } else {
            setNoPartnersFError("");
        }
    };

    const emailCellphoneLabel = () => t("email").concat(" ").concat(t("o")).concat(" ").concat(t("cellphone"));

    const avgCupProfileLabel = () => t("cup-profile").concat(" ").concat(t("average"));

    const RenderForm = () => (

        <>
            <div className="shadow-xl bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 rounded-b-lg ">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 ">
                        <div className="md:col-span-5">
                            <FormInput
                                label={emailCellphoneLabel()}
                                value={userName}
                                placeholder={t("placeholders.email")}
                                handleOnChange={handleUserInputChange}
                                errorMsg={userNameError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={isEmailUser ? t("cellphone") : t("email")}
                                value={cellphone}
                                placeholder={isEmailUser ? t("placeholders.cellphone") : t("placeholders.email")}
                                handleOnChange={handleCellphoneChange}
                                errorMsg={cellphoneError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("signup.manager-name")}
                                value={managerName}
                                placeholder={t("placeholders.fullname")}
                                handleOnChange={handleManagerNameChange}
                                errorMsg={managerNameError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("signup.company-name")}
                                value={socialReason}
                                placeholder={t("name")}
                                handleOnChange={handleSocialReasonChange}
                                errorMsg={socialReasonError}
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
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 ">
                        <div className="md:col-span-5">
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput
                                    label={t("male-partners")}
                                    value={noPartnersM}
                                    placeholder={t("male-partners")}
                                    handleOnChange={handleNoPartnersMChange}
                                    errorMsg={noPartnersMError}
                                    className="input input-bordered w-full"
                                />
                                <FormInput
                                    label={t("female-partners")}
                                    value={noPartnersF}
                                    placeholder={t("female-partners")}
                                    handleOnChange={handleNoPartnersFChange}
                                    errorMsg={noPartnersFError}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>


                        <div className="md:col-span-5">
                            <FormInput
                                label={t("signup.productive-areas")}
                                value={productiveAreas}
                                placeholder={t("areas")}
                                handleOnChange={handleProductivesAreasChange}
                                errorMsg={productiveAreasError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">

                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("address")}
                                value={addressLine}
                                placeholder={t("address")}
                                handleOnChange={handleAddressLineChange}
                                errorMsg={addressLineError}
                                className="input input-bordered w-full "
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("village")}
                                value={village}
                                placeholder={t("village")}
                                handleOnChange={handleVillageChange}
                                errorMsg={villageError}
                                className="input input-bordered w-full "
                            />
                        </div>
                        <div className="md:col-span-5 m-2">
                            <Form.Label>
                                <>{t("review")}</>
                            </Form.Label>
                            <Form.Control
                                value={review}
                                as="textarea"
                                rows={4}
                                placeholder={t("review")}
                                onChange={handleReviewChange}
                                className="textarea textarea-bordered w-full"
                            />
                            {bioError !== "" && (<span className="error-message">{reviewError}</span>)}
                        </div>
                    </div>
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5 m-2">
                            <h1 className="text-base font-medium"><>{t("signup.choose-company")}</></h1>
                            <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handleCooperativeChange}>
                                <option disabled selected><> {t("signup.choose-company")}</>
                                    :
                                </option>
                                {currentCoop.name}
                                {CooperativeList.map((item) => (<option key={item.key} value={item.key}>
                                    {item.name}
                                </option>))}
                            </select>
                            {coopError !== "" && (<span className="error-message">{coopError}</span>)}
                        </div>

                        <div className="md:col-span-5">
                            <FormInput
                                label={avgCupProfileLabel()}
                                value={cupProfile}
                                placeholder={t("average")}
                                handleOnChange={handleCupProfileChange}
                                errorMsg={cupProfileError}
                                className="input input-bordered w-full"
                            />
                        </div>


                        <div className="md:col-span-5 m-4">
                            <MultipleValueTextInput
                                onItemAdded={(item: any, allItems: Array<string>) => {

                                    setProducts(allItems);
                                }}
                                onItemDeleted={(item: any, allItems: Array<string>) => {

                                    setProducts(allItems);
                                }}
                                label="Productos o Servicios"
                                name="social-networks"
                                placeholder={t("placeholders.enter-products")}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("website")}
                                value={website}
                                placeholder={t("placeholders.email")}
                                handleOnChange={handleWebsiteChange}
                                errorMsg={websiteError}
                                className="input input-bordered w-full"
                            />


                        </div>

                        <div className="md:col-span-5 m-2">
                            <MultipleValueTextInput
                                onItemAdded={(item: any, allItems: Array<string>) => {

                                    setSocialNetworks(allItems);
                                }}
                                onItemDeleted={(item: any, allItems: Array<string>) => {

                                    setSocialNetworks(allItems);
                                }}
                                label={t("social-networks")}
                                name="social-networks"
                                placeholder={t("placeholders.social-networks")}
                                className="input input-bordered "
                            />
                        </div>


                        </div>
                </div>
                {state.creatingAccountError && (<div className="account-created">
                    <h3>
                        <>{t("errors.creating-account")}</>
                    </h3>
                </div>)}
                <br/>
                <div className="flex justify-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => magicLogin()}
                    >
                        <>{t("signup.create-account")}</>
                    </button>
                    <div className="divider divider-horizontal"></div>
                    <button
                        className="btn btn-secondary "
                        onClick={() => navigate("/login", {replace: true})}
                    >
                        <u>
                            <>{t("signup.back")}</>
                        </u>
                    </button>
                </div>
            </div>
        </>
        );

    const RenderFarmerForm = () => (
        <>
            <div className="shadow-xl bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 rounded-b-lg ">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5 ">
                        <div className="md:col-span-5">
                            <div className="flex avatar w-24 bg-red-500  mx-auto">
                                <img
                                    src={selectedImage !== "" ? selectedImage : User}
                                    className="rounded-xl"
                                    onClick={handleClick}
                                />
                                <Form.Control
                                    type="file"
                                    placeholder="Seleccione imagen."
                                    onChange={handleOnImageChange}
                                    ref={hiddenFileInput}
                                    style={{display: "none"}}
                                    className="input input-bordered "
                                />
                            </div>
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={emailCellphoneLabel()}
                                value={userName}
                                placeholder={t("placeholders.email")}
                                handleOnChange={handleUserInputChange}
                                errorMsg={userNameError}
                                className="input input-bordered w-full "
                            />
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("id")}
                                value={farmerId}
                                placeholder={t("placeholders.id")}
                                handleOnChange={handleIdChange}
                                errorMsg={fullnameError}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="md:col-span-5">
                            <FormInput
                                label={t("fullname")}
                                value={fullname}
                                placeholder={t("placeholders.fullname")}
                                handleOnChange={handleFullnameChange}
                                errorMsg={fullnameError}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="md:col-span-5">
                            <FormInput
                             
                                label={t("company-code")}
                                value={cooperativeId}
                                placeholder={t("company-code")}
                                handleOnChange={handleIdProductorChange}
                                errorMsg={farmerIdError}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="md:col-span-5 m-4">
                            <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handleGenderChange}>
                                <option disabled selected><> {t("gender")}</>
                                    :
                                </option>
                                {currentGender.name}
                                {GenderList.map((item) => (<option key={item.key} value={item.key}>
                                    {item.name}
                                </option>))}
                            </select>
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
                            {coopError !== "" && (<span className="error-message">{coopError}</span>)}
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
                            {coopError !== "" && (<span className="error-message">{regionError}</span>)}
                        </div>
                        <div className="md:col-span-5">
                            <FormInput
                                label={t("village")}
                                value={village}
                                placeholder={t("village")}
                                handleOnChange={handleVillageChange}
                                errorMsg={villageError}
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
                        <div className="md:col-span-5 m-4">
                            <Form.Label>
                                <>{t("bio")}</>
                            </Form.Label>
                            <Form.Control
                                value={bio}
                                as="textarea"
                                rows={5}
                                placeholder={t("placeholders.bio")}
                                onChange={handleBioChange}
                                className="textarea textarea-bordered w-full"
                            />
                            {bioError !== "" && (<span className="error-message">{bioError}</span>)}
                        </div>

                    </div>

                </div>
                <br/>
                <div className="flex justify-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => magicLogin()}
                    >
                        <>{t("signup.create-account")}</>
                    </button>
                    <div className="divider divider-horizontal"></div>
                    <button
                        className="btn btn-secondary "
                        onClick={() => navigate("/login", {replace: true})}
                    >
                        <u>
                            <>{t("signup.back")}</>
                        </u>
                    </button>
                </div>
            </div>
        </>
        );





    if (state.creatingAccount) {
        return (<Loading label={t("loading").concat("...")} className="loading-wrapper"/>);
    }

    return (<div className="">
        <div className="">
            <div>
                <div>
                    <div className="grid ">
                        <div className="h-24 w-24 place-self-center">
                            <CoopLogo className="logo"/>
                        </div>
                        <br/>
                    </div>

                    {!state.accountCreated ? (<div className="">
                        <div className="bg-base-100 pt-4 rounded-t-xl m-12 lg:mx-64">
                            <div className="flex tabs justify-center">
                                <a className={`${activeTab == 'farmer' && `tab btn-wide tab-lg  tab-lifted tab-active`} tab btn-wide tab-lg `}
                                   id="signup-tabs"
                                   onClick={() => setActiveTab("farmer")}
                                ><>{t("farmer")}</>
                                </a>
                                <a className={`${activeTab == 'cooperative' && `tab btn-wide tab-lg tab-lifted tab-active`} tab btn-wide tab-lg `}
                                   id="signup-tabs"
                                   onClick={() => setActiveTab("cooperative")}
                                ><>{t("company")}</>
                                </a>
                            </div>

                            {activeTab == 'farmer' ? (<div>
                                {RenderFarmerForm()}
                            </div>) : (<div className="">
                                {RenderForm()}
                            </div>)}
                        </div>
                    </div>) : (<div className="account-created">
                        {activeTab === "farmer" ? (<h6>
                            <>{t("signup.success")}</>
                        </h6>) : (<h6>
                            <>{t("signup.success2")}</>
                        </h6>)}
                        <button
                            className="btn auth-method"
                            onClick={() => {
                                authContext.fakeSignOut();
                                navigate("/login", {replace: true});
                            }}
                        >
                            <>{t("login.access")}</>
                        </button>

                    </div>)}
                </div>
            </div>
        </div>
    </div>);
};

export default Signup;
