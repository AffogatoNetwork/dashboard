import React from "react";
import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import routes from "../config/routes";
import {useTranslation} from "react-i18next";

// Icons
import {HomeIcon} from "./icons/home";
import {ProfileIcon} from "./icons/profile";
import {LinkIcon} from "./icons/link";
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


const data = [
    {
        name: '',
        items: [
            {
                title: 'home',
                icon: HomeIcon,
                href: routes.home,
                disabled: ''
            },
            {
                title: 'farmers',
                icon: ProfileIcon,
                href: routes.productores,
                disabled: ''
            },
            {
                title: 'Crear Lotes',
                icon: VoteIcon,
                href: routes.create,
                disabled: ''
            },
            {
                title: 'batches',
                icon: AgricultureIcon,
                href: routes.lotes,
                disabled: ''
            },

            {
                title: 'farms',
                icon: LandscapeIcon,
                href: routes.fincas,
                disabled: ''
            },
            {
                title: 'Catación',
                icon: LocalCafeIcon,
                href: '',
                disabled: 'disabled'
            },
            {
                title: 'Certificación',
                icon: VerifiedIcon,
                href: '',
                disabled: 'disabled'
            },
            {
                title: 'Trazabilidad',
                icon: LinkIcon,
                href: '',
                disabled: 'disabled'
            },
        ]
    },
]


const datafooter = [

    {
        name: '',
        items: [
            {
                title: 'logout',
                icon: LogOutIcon,
                disabled: ''
            }
        ]
    },
]



export default function Home() {
    const {t} = useTranslation();
    const {authContext, authState} = useAuthContext();
    const logout = () => {
        authContext.signOut();
    };
    const navigate = useNavigate();
    const [active, setActive] = useState(false)
    const controls = useAnimation()
    const controlText = useAnimation()
    const controlTitleText = useAnimation()

    const showMore = () => {
        controls.start({
            width: '250px',
            transition: { duration: 0.001 }
        })
        controlText.start({
            opacity: 1,
            display: 'block',
            transition: {delay:0.3}
        })
        controlTitleText.start({
            opacity: 1,
            transition: {delay:0.3}
        })

        setActive(true)
    }

    const showLess = () => {
        controls.start({
            width: '55px',
            transition: { duration: 0.001 }
        })

        controlText.start({
            opacity: 0,
            display: 'none',
        })

        controlTitleText.start({
            opacity: 0,
        })

        setActive(false)

    }



    useEffect(() => {
        showMore()
    },[])




    return (
        <div className='min-h-screen bg-white' >

            <motion.div animate={controls} className='max-w-[250px]  animate duration-300 border-r border-gray-700 relative flex flex-col py-10 min-h-screen group' >



                <div className={`${active && 'border-amber-900 border shadow-amber-400/60 shadow-lg rounded-lg px-4'}   max-w-[220px] h-[120px] flex justify-center mx-2  flex-col mb-4`} >
                    <div className="relative shrink-0 overflow-hidden rounded-full border-gray-400  h-10 w-10 drop-shadow-main border-3 object-cover">
                        <CoopLogo className=""/>
                    </div>

                </div>



                <div className='grow'>
                    {data.map((group, index) => (
                        <div key={index} className='my-2' >
                            {group.items.map((item, index2) => (
                                <div key={index2} onClick={() => navigate(`${item.href}`)}
                                     className={`${item.href === window.location.pathname  && 'bg-red-500 text-white hover:text-white'}  ${item.disabled && 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50 hover:text-gray-500'} inline-flex items-center w-full h-12  mt-2 px-4 py-4 hover:text-red-500  font-medium rounded-md cursor-pointer `} >
                                    <item.icon className='' />
                                    <motion.p animate={controlText} className='ml-4 text-sm' >   <>
                                        {t(item.title)}
                                    </> </motion.p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {active && <AiOutlineMenuFold onClick={showLess} className='inline-flex items-center w-full h-12 px-3 mt-2 px-2 py-2 hover:text-red-500  active:bg-red-500 active:text-white font-medium rounded-md cursor-pointer' />}
                {!active && <AiOutlineMenuUnfold onClick={showMore} className='inline-flex items-center w-full h-12 px-3 mt-2 px-2 py-2 hover:text-red-500  active:bg-red-500 active:text-white font-medium rounded-md cursor-pointer' />}



                <div>
                    {datafooter.map((group, index) => (
                        <div key={index} className='my-2' >
                            <motion.p animate={controlTitleText} className='mb-2 ml-4 text-sm font-bold text-gray-500' >{group.name}</motion.p>

                            {group.items.map((item, index2) => (
                                <div key={index2} onClick={() => logout()}
                                     className={`inline-flex items-center justify-center w-full h-16 mt-auto hover:text-red-500 bg-gray-100 active:bg-red-500 active:text-white font-medium rounded-md`} >
                                    <item.icon className='hover:text-red-500 active:text-white' />
                                    <motion.p animate={controlText} className='ml-4 text-sm font-bold hover:text-red-500 active:text-white' >
                                        <>
                                            {t(item.title)}
                                    </>
                                    </motion.p>
                                </div>

                            ))}
                        </div>
                    ))}
                </div>


            </motion.div>



        </div>
    )
}