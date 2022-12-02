import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../states/AuthContext";
import CoopLogo from "./common/CoopLogo";
import LangChooser from "./common/LangChooser";
import {isValidCellphone, isValidEmail,} from "../utils/utils";

const Login = () => {
    const {t} = useTranslation();
    const areaCode = "+504";
    const navigate = useNavigate();
    const {authContext, authState} = useAuthContext();
    const [state] = authState;
    const [userInput, setUserInput] = useState("");
    const [userInputError, setUserInputError] = useState("");
    let name = 'Empresa cooperativa';
    let image = 'https://montanaverdehn.com/wp-content/uploads/2022/02/commovel-finca-main-slider-v1-2.jpg';

    const location = window.location.host;

    switch (location) {
        case 'comsa': {
            name = 'Comsa';
            image ='https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Banners%2FCOMSA.jpg?alt=media&token=bc36aa90-dc6f-4bb6-b40d-c17310dbd5f9';
            break;
        }
        case "commovel": {
            name = 'Commovel';
            image = 'https://montanaverdehn.com/wp-content/uploads/2022/02/commovel-finca-main-slider-v1-2.jpg';
            break;

        }
        case "copranil": {
            name = 'Copranil';
            image = 'https://www.copranil.hn/wp-content/uploads/2021/03/LA-PARTICIPACION-DE-LA-MUJER-ENFOQUE-FUNDAMENTAL.jpeg';
            break;
        }
        case "proexo": {
            name = 'Proexo';
            image = 'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Banners%2FPROEXO.jpg?alt=media&token=ec371948-d535-4994-aa54-7e6a7fb2dda3';
            break;
        }
        default: {
            name = 'Empresa/Cooperativa';
            image = 'https://montanaverdehn.com/wp-content/uploads/2022/02/commovel-finca-main-slider-v1-2.jpg';
            break;
        }
    }

    useEffect(() => {
        function check() {
        }
        check();
        // eslint-disable-next-line
    }, [state.isLoggedIn, state.isSignInError]);

    const magicLogin = async () => {
        if (isValidEmail(userInput)) {
            authContext.signIn({emailLogin: true, credential: userInput});
        } else if (isValidCellphone(userInput)) {
            authContext.signIn({
                emailLogin: false, credential: areaCode.concat(userInput),
            });
        }
    };

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>,) => {
        const input = event.target.value;
        setUserInput(input);
        if (isValidCellphone(input) || isValidEmail(input)) {
            setUserInputError("");
        } else {
            setUserInputError("El valor no es valido.");
        }
    };

    return (<>
        <div className="bg-no-repeat bg-cover bg-center relative bg-[#71ac44]"
             style={{backgroundImage: `url(${image})`}}>
            <div className="bg-opacity-60 bg-black">
                <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
                    <div className="flex-col flex self-center p-10 sm:max-w-5xl md:pl-2 xl:max-w-2xl z-10">
                        <div className="hidden lg:flex flex-col text-white">
                            <h1 className="mb-3 font-bold text-5xl "><>{t("welcome")}</>: {name}
                            </h1>
                            <p className="pr-3 md:text-light">Nuestro café trazado con la seguridad de la tecnología de blockchain. </p>
                        </div>
                    </div>
                    <div className="flex justify-center self-center  z-10">
                        <div className="p-12 bg-white mx-auto rounded-2xl w-100 flex flex-col justify-center items-center ">
                            <div className="w-14 pb-4">
                                <CoopLogo className=""/>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-2xl text-gray-800">
                                    <>{t("login.title")}</>
                                </h3>
                            </div>
                            <div className="space-y-5 form-control" onSubmit={() => magicLogin()}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 tracking-wide">Email:</label>
                                    <input
                                        className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                                        type="email"
                                        value={userInput}
                                        placeholder={t("placeholders.email")}
                                        onChange={handleUserInputChange}/>
                                </div>

                                <div>
                                    <button type="submit"
                                            className="w-full flex justify-center bg-amber-900 hover:bg-black text-gray-100 p-3 tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                                            onClick={() => magicLogin()}>
                                        <>{t("login.access")}</>
                                    </button>
                                    <p className="pt-6 text-sm link link-info text-gray-500"
                                       onClick={() => navigate("/signup", {replace: true})}>
                                        <>{t("login.create-account")}</>
                                    </p>

                                    <br/>
                                    <div className="flex items-center space-x-4">
                                        <hr className="w-full border border-gray-300"/>
                                        <div className="font-semibold text-gray-400">O</div>
                                        <hr className="w-full border border-gray-300"/>
                                    </div>
                                    <br/>
                                    <button type="submit"
                                            className="w-full flex justify-center bg-yellow-700 hover:bg-yellow-900 text-gray-100 p-3 tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                                            onClick={() => navigate("/coffeebatches", {replace: true})}>
                                        <>{t("login.buyer-access")}</>
                                    </button>
                                </div>
                            </div>
                            <div className="pt-5 text-center text-gray-400 text-xs">
                           <span>
                           <LangChooser/>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default Login;
