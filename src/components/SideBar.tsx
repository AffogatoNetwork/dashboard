import React, {useEffect, useState} from "react";
import {motion, useAnimation} from 'framer-motion'
import routes from "../config/routes";
import {useTranslation} from "react-i18next";
import {makeShortAddress} from "../utils/utils";

// Icons
import {HomeIcon} from "./icons/home";
import {ProfileIcon} from "./icons/profile";
import {VerifiedIcon} from "./icons/verified-icon";
import {LandscapeIcon} from "./icons/landscape";
import {AgricultureIcon} from "./icons/agriculture";
import {VoteIcon} from "./icons/vote-icon";
import {useNavigate} from "react-router-dom";
import {LogOutIcon} from "./icons/logout";
import {AiOutlineMenuFold, AiOutlineMenuUnfold} from "react-icons/ai";

import CoopLogo from "./common/CoopLogo";
import {useAuthContext} from "../states/AuthContext";
import LangChooser from "./common/LangChooser";
import {WorldIcon} from "./icons/world";
import {IconLogin} from "./icons/login";


const data = [{
    name: '', items: [{
        title: 'farmers', icon: ProfileIcon, href: routes.productores, disabled: ''
    }, {
        title: 'farms', icon: LandscapeIcon, href: routes.fincas, disabled: ''
    }, {
        title: 'batches', icon: AgricultureIcon, href: routes.lotes, disabled: ''
    }, {
        title: 'certificates', icon: VerifiedIcon, href: routes.certificacion, disabled: ''
    }
    ]
},]




export default function Home() {
    const {t} = useTranslation();
    const {authContext, authState} = useAuthContext();
    const [state] = authState;
    const [ownerAddress, setOwnerAddress] = useState("");
    useEffect(() => {
        const loadProvider = async () => {
            if (state.provider != null) {
                const signer = state.provider.getSigner();
                const address = await signer.getAddress();
                setOwnerAddress(address);
                localStorage.setItem('addres', ownerAddress);
            }
            localStorage.setItem('addres', ownerAddress);
        };
        loadProvider();
    });


    const logout = () => {
        authContext.signOut();
    };


    const navigate = useNavigate();
    const [active, setActive] = useState(false)
    const [primary,] = useState('bg-white')
    const controls = useAnimation()
    const controlText = useAnimation()
    const controlTitleText = useAnimation()


    const showMore = () => {
        controls.start({
            width: '250px', transition: {duration: 0.001}
        })
        controlText.start({
            opacity: 1, display: 'block', transition: {delay: 0.3}
        })
        controlTitleText.start({
            opacity: 1, transition: {delay: 0.3}
        })

        setActive(true)
    }

    const showLess = () => {
        controls.start({
            width: '55px', transition: {duration: 0.001}
        })

        controlText.start({
            opacity: 0, display: 'none',
        })

        controlTitleText.start({
            opacity: 0,
        })

        setActive(false)

    }


    useEffect(() => {
        showMore()
    }, [])


    return (<div className='min-h-screen bg-base-100'>

        <motion.div animate={controls}
                    className='max-w-[250px] animate duration-300  relative flex flex-col pt-2 min-h-screen group'>


            <div className="flex justify-center md:m-4 m-2 ">
                <div className="w-14 h-14">
                    <CoopLogo className="inline-block"/>

                </div>
            </div>
            <div className="flex justify-center md:m-4 m-2 ">
                <div className="text-sm">
                    {makeShortAddress(ownerAddress)}
                </div>

            </div>


            <div className='grow'>
                {data.map((group, index) => (<div key={index} className='ml-2'>
                    {group.items.map((item, index2) => (
                        <div key={index2} onClick={() => navigate(`${item.href}`)}
                             className={`${item.href === window.location.pathname && `${primary}  text-amber-900 hover:text-amber-900`}  ${item.disabled && 'cursor-not-allowed bg-gray-100 rounded-l-lg text-gray-500 opacity-50 hover:text-amber-900'} inline-flex items-center w-full h-12  mt-2 px-4 py-4 hover:bg-white rounded-l-lg rounded hover:text-amber-900 font-medium  cursor-pointer `}>
                            <item.icon className=''/>
                            <motion.p animate={controlText} className='ml-4 text-sm'><>
                                {t(item.title)}
                            </>
                            </motion.p>
                        </div>))}
                </div>))}
                <div tabIndex={1} onClick={() => navigate(`/create`)}
                     className={`${ownerAddress && window.location.pathname == '/create' && `${primary} rounded-l-lg text-white hover:bg-white hover:text-amber-900 visible`}  ${!ownerAddress && 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50 hover:text-amber-900 hidden'} inline-flex items-center w-full h-12  mt-2 px-4 py-4  font-medium rounded-md cursor-pointer `}
                >
                    <VoteIcon className="w-8"/>
                    <motion.p animate={controlText} className='ml-4 text-sm'>
                        <>{t('add-batches')}</>
                    </motion.p>
                </div>
                <div tabIndex={0}
                     className={`dropdown dropdown-right dropdown-end inline-flex items-center w-full h-12 rounded-l-lg mt-2 px-4 py-4 hover:bg-white hover:text-amber-900 font-medium rounded-md cursor-pointer ml-2`}>
                    <WorldIcon className="w-8"/>
                    <motion.p animate={controlText} className='ml-4 text-sm'>
                        <>{t('change-lang')}</>
                    </motion.p>
                    <ul tabIndex={0}
                        className="dropdown-content menu p-2 hover:text-black text-black shadow bg-base-100 rounded-box  rounded-l-lg w-52">
                        <LangChooser/>
                    </ul>
                </div>

                <br/>
                <br/>
                {active && <AiOutlineMenuFold onClick={showLess}
                                              className='inline-flex items-center w-full h-12 px-3 mt-2 py-2 hover:text-amber-900  active:bg-white active:text-white font-medium rounded-md cursor-pointer'/>}
                {!active && <AiOutlineMenuUnfold onClick={showMore}
                                                 className='inline-flex items-center w-full h-12 px-3 mt-2 py-2 hover:text-amber-900  active:bg-white active:text-white font-medium rounded-md cursor-pointer'/>}


                <div>

                    {ownerAddress ? (
                        <div className='m-2'>
                            <motion.p animate={controlTitleText}
                                      className='mb-2 ml-4 text-sm font-bold text-gray-500'></motion.p>

                            <div onClick={() => logout()}
                                 className={`inline-flex items-center button justify-center w-full h-16 mt-auto hover:text-amber-900 bg-gray-100  font-medium rounded-md`}>
                                <LogOutIcon className=' hover:text-white'/>

                                <motion.p animate={controlText}
                                          className='ml-4 text-sm font-bold hover:text-amber-900'>
                                    <>
                                        <>{t('logout')}</>
                                    </>
                                </motion.p>
                            </div>

                        </div>

                    ) : (
                        <div className='my-2'>
                            <motion.p animate={controlTitleText}
                                      className='mb-2 ml-4 text-sm font-bold text-red-500'></motion.p>

                            <div onClick={() => navigate("/login", {replace: true})}
                                 className={`inline-flex items-center button justify-center w-full h-16 mt-auto hover:text-amber-900 bg-gray-100  font-medium rounded-md`}>
                                <IconLogin className='hover:text-white'/>
                                <motion.p animate={controlText}
                                          className='ml-4 text-sm font-bold hover:text-amber-900'>
                                    <>
                                        <>{t('login.access')}</>
                                    </>
                                </motion.p>
                            </div>

                        </div>
                    )}


                </div>

            </div>

        </motion.div>

    </div>)
}
