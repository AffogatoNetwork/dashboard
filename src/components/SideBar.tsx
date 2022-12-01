import React from "react";
import {useState, useEffect} from 'react'
import {motion, useAnimation} from 'framer-motion'
import routes from "../config/routes";
import {useTranslation} from "react-i18next";
import {makeShortAddress} from "../utils/utils";

// Icons
import {HomeIcon} from "./icons/home";
import {ProfileIcon} from "./icons/profile";
import {VerifiedIcon} from "./icons/verified-icon";
import {LocalCafeIcon} from "./icons/local_cafe";
import {LandscapeIcon} from "./icons/landscape";
import {AgricultureIcon} from "./icons/agriculture";
import {VoteIcon} from "./icons/vote-icon";
import {useNavigate} from "react-router-dom";
import {LogOutIcon} from "./icons/logout";
import {AiOutlineMenuFold, AiOutlineMenuUnfold} from "react-icons/ai";

import CoopLogo from "./common/CoopLogo";
import {useAuthContext} from "../states/AuthContext";
import LangChooser from "./common/LangChooser";
import { WorldIcon} from "./icons/world";



const data = [{
    name: '', items: [{
        title: 'home', icon: HomeIcon, href: routes.home, disabled: ''
    }, {
        title: 'farmers', icon: ProfileIcon, href: routes.productores, disabled: ''
    }, {
        title: 'farms', icon: LandscapeIcon, href: routes.fincas, disabled: ''
    }, {
        title: 'batches', icon: AgricultureIcon, href: routes.lotes, disabled: ''
    }, {
        title: 'Certificación', icon: VerifiedIcon, href: routes.certificacion, disabled: ''
    }, {
        title: 'Catación', icon: LocalCafeIcon, href: routes.catacion, disabled: ''
    }, {
        title: 'Crear Lotes', icon: VoteIcon, href: routes.create, disabled: ''

    },

    ]
},]


const datafooter = [

    {
        name: '', items: [{
            title: 'logout', icon: LogOutIcon, disabled: ''
        }]
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
            }
        };
        loadProvider();
    });


    const logout = () => {
        authContext.signOut();
    };

    const navigate = useNavigate();
    const [active, setActive] = useState(false)
    const [primary, SetBackgroundColor] = useState('bg-amber-900')
    const [farm, setFarmName] = useState('Empresa/Cooperativa')
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


    return (<div className='min-h-screen bg-white'>

        <motion.div animate={controls}
                    className='max-w-[250px] animate duration-300 border-r border-gray-700 relative flex flex-col pt-2 min-h-screen group'>

            <div
                className="mx-2 relative  flex justify-center overflow-hidden rounded-full border-gray-400  h-10 w-10 drop-shadow-main border-3 object-cover">
                <CoopLogo className="inline-flex items-center"/>

            </div>


            <div className='grow'>
                {data.map((group, index) => (<div key={index} className='my-2'>
                    {group.items.map((item, index2) => (
                        <div key={index2} onClick={() => navigate(`${item.href}`)}
                             className={`${item.href === window.location.pathname && `${primary} text-white hover:text-gray-50`}  ${item.disabled && 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50 hover:text-gray-600'} inline-flex items-center w-full h-12  mt-2 px-4 py-4 hover:bg-orange-300 hover:text-white font-medium rounded-md cursor-pointer `}>
                            <item.icon className=''/>
                            <motion.p animate={controlText} className='ml-4 text-sm'><>
                                {t(item.title)}
                            </>
                            </motion.p>
                        </div>))}
                </div>))}

                <div tabIndex={0} className={`dropdown dropdown-right dropdown-end inline-flex items-center w-full h-12  mt-2 px-4 py-4 hover:bg-orange-300 hover:text-white font-medium rounded-md cursor-pointer `}>
                        <WorldIcon className="w-8" />
                        <motion.p animate={controlText} className='ml-4 text-sm'>
                            Cambiar idioma
                        </motion.p>
                        <ul tabIndex={0} className="dropdown-content menu p-2 hover:text-black text-black shadow bg-base-100 rounded-box w-52">
                            <LangChooser/>
                        </ul>
                    </div>


            </div>


            {active && <AiOutlineMenuFold onClick={showLess}
                                          className='inline-flex items-center w-full h-12 px-3 mt-2 px-2 py-2 hover:text-orange-300  active:bg-amber-900 active:text-white font-medium rounded-md cursor-pointer'/>}
            {!active && <AiOutlineMenuUnfold onClick={showMore}
                                             className='inline-flex items-center w-full h-12 px-3 mt-2 px-2 py-2 hover:text-orange-300  active:bg-amber-900 active:text-white font-medium rounded-md cursor-pointer'/>}


            <div>
                {datafooter.map((group, index) => (<div key={index} className='my-2'>
                    <motion.p animate={controlTitleText}
                              className='mb-2 ml-4 text-sm font-bold text-gray-500'>{group.name}</motion.p>

                    {group.items.map((item, index2) => (<div key={index2} onClick={() => logout()}
                                                             className={`inline-flex items-center justify-center w-full h-16 mt-auto hover:text-orange-300 bg-gray-100 active:${primary} active:text-white font-medium rounded-md`}>
                            <item.icon className=' active:text-white'/>
                            <motion.p animate={controlText}
                                      className='ml-4 text-sm font-bold hover:text-orange-300 active:text-white'>
                                <>
                                    {t(item.title)}
                                </>
                            </motion.p>
                        </div>

                    ))}
                </div>))}
            </div>
            <br/>

        </motion.div>

    </div>)
}
