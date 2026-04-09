import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import routes from '../config/routes';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { authData, UserData } from '../db/firebase';

// Icons
import { HomeIcon } from './icons/home';
import { ProfileIcon } from './icons/profile';
import { VerifiedIcon } from './icons/verified-icon';
import { LandscapeIcon } from './icons/landscape';
import { AgricultureIcon } from './icons/agriculture';
import { VoteIcon } from './icons/vote-icon';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon } from './icons/logout';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';

import CoopLogo from './common/CoopLogo';
import { useAuthContext } from '../states/AuthContext';
import LangChooser from './common/LangChooser';
import { IconLogin } from './icons/login';

let data = [
  {
    name: '',
    items: [
      {
        title: 'home',
        icon: HomeIcon,
        href: routes.home,
        disabled: '',
      },
      {
        title: 'farmers',
        icon: ProfileIcon,
        href: routes.productores,
        disabled: '',
      },
      {
        title: 'farms',
        icon: LandscapeIcon,
        href: routes.fincas,
        disabled: '',
      },
      {
        title: 'batches',
        icon: AgricultureIcon,
        href: routes.lotes,
        disabled: '',
      },
      {
        title: 'certifications',
        icon: VerifiedIcon,
        href: routes.certificacion,
        disabled: '',
      },
    ],
  },
];

export default function Home() {
  const { t } = useTranslation();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [ownerAddress, setOwnerAddress] = useState('');
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    photo: '',
  });
  const auth = authData();
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
  };

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

    let data = UserData();
    setUserData(data);
    loadProvider();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        navigate('/');
      })
      .catch((error) => {
        // An error happened.
      });

    authContext.signOut();
  };

  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [primary] = useState('bg-white');
  const [isExpanded, setIsExpanded] = useState(true);

  const getCooperative = (companyName: string) => {
    if (companyName === 'CAFEPSA') {
      data = [
        {
          name: '',
          items: [
            {
              title: 'home',
              icon: HomeIcon,
              href: routes.home,
              disabled: '',
            },
            {
              title: 'producers profile',
              icon: ProfileIcon,
              href: routes.cafepsaFarmers,
              disabled: '',
            },
            {
              title: 'module-farms',
              icon: LandscapeIcon,
              href: routes.cafepsaFarms,
              disabled: '',
            },
            {
              title: 'coffe-batches-benefied',
              icon: AgricultureIcon,
              href: routes.cafepsaBatches,
              disabled: '',
            },
            {
              title: 'certifications',
              icon: VerifiedIcon,
              href: routes.cafepsaCertification,
              disabled: '',
            },
          ],
        },
      ];
    }
  };

  // Removed framer motion methods showMore, showLess

  useEffect(() => {
    let companyName = '';
    const url = window.location.host.toString();
    if (url.match('commovel') !== null) {
      companyName = 'COMMOVEL';
    }
    if (url.match('copracnil') !== null) {
      companyName = 'COPRACNIL';
    }
    if (url.match('comsa') !== null) {
      companyName = 'COMSA';
    }
    if (url.match('proexo') !== null) {
      companyName = 'PROEXO';
    }
    if (url.match('cafepsa') !== null) {
      companyName = 'CAFEPSA';
    }
    if (url.match('localhost') !== null) {
      companyName = 'CAFEPSA';
    }


    getCooperative(companyName);
  }, []);

  return (
    <div className={`min-h-screen bg-base-100 transition-all duration-300 relative border-r border-gray-100 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-amber-700 hover:shadow-md transition-all z-50 hidden sm:block"
      >
        {isExpanded ? <AiOutlineMenuFold size={20} /> : <AiOutlineMenuUnfold size={20} />}
      </button>

      <div className="flex flex-col pt-2 min-h-screen h-full w-full overflow-hidden">
        <div className="flex justify-center md:m-4 m-2 min-w-[56px]">
          <div className="w-14 h-14 flex-shrink-0">
            <CoopLogo className="inline-block" />
          </div>
        </div>

        <div className={`flex flex-col items-center mx-2 text-sm text-center min-w-[150px] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${!isExpanded && 'h-0 overflow-hidden'}`}>
          <h1 className="truncate w-full font-semibold px-2"> {userData?.name} </h1>
          <h1 className="truncate w-full text-xs text-gray-500 mb-2 px-2"> {userData?.email} </h1>
          <button
            className="m-2 btn btn-xs btn-accent text-white"
            onClick={() => navigate(`/admin`)}
          >
            Ajustes
          </button>
        </div>

        <div className="grow mt-4 flex flex-col px-2 max-w-full overflow-hidden">
          {data.map((group, index) => (
            <div key={index} className="">
              {group.items.map((item, index2) => (
                <div
                  key={index2}
                  onClick={() => navigate(`${item.href}`)}
                  className={`${item.href === window.location.pathname && `${primary} text-amber-900 border-l-4 border-amber-900 bg-amber-50`} ${item.disabled && 'cursor-not-allowed text-gray-500 opacity-50'} inline-flex items-center w-full h-12 mt-1 px-4 hover:bg-amber-50 hover:text-amber-900 font-medium cursor-pointer rounded-lg transition-colors ${!isExpanded && 'justify-center border-l-0 px-0'}`}
                  title={t(item.title) as string}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-6">
                    <item.icon className="" />
                  </div>
                  <p className={`ml-4 text-sm truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 h-0 hidden'}`}>
                    <>{t(item.title)}</>
                  </p>
                </div>
              ))}
            </div>
          ))}
          <div
            tabIndex={1}
            onClick={() => navigate(`/create`)}
            className={`${ownerAddress && window.location.pathname == '/create' && `${primary} text-white hover:bg-white hover:text-amber-900 visible`} ${!ownerAddress && 'hidden'} inline-flex items-center w-full h-12 mt-2 px-4 font-medium rounded-lg cursor-pointer ${!isExpanded && 'justify-center px-0'}`}
            title={t('add-batches') as string}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-6">
              <VoteIcon className="w-6" />
            </div>
            <p className={`ml-4 text-sm truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 h-0 hidden'}`}>
              <>{t('add-batches')}</>
            </p>
          </div>
          
          <div className="mt-auto mb-4">
            {userData.name ? (
              <div
                onClick={() => logout()}
                className={`inline-flex items-center justify-center w-full h-12 mt-2 hover:bg-red-50 hover:text-red-700 bg-gray-50 text-gray-600 font-medium rounded-lg cursor-pointer transition-colors ${!isExpanded && 'px-0'}`}
                title={t('logout') as string}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-6">
                  <LogOutIcon className="" />
                </div>
                <p className={`ml-4 text-sm font-bold truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 h-0 hidden'}`}>
                  <>{t('logout')}</>
                </p>
              </div>
            ) : (
              <div
                onClick={() => navigate('/login', { replace: true })}
                className={`inline-flex items-center justify-center w-full h-12 mt-2 hover:bg-amber-50 hover:text-amber-900 bg-gray-50 text-gray-600 font-medium rounded-lg cursor-pointer transition-colors ${!isExpanded && 'px-0'}`}
                title={t('login.access') as string}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-6">
                  <IconLogin className="" />
                </div>
                <p className={`ml-4 text-sm font-bold truncate transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 h-0 hidden'}`}>
                  <>{t('login.access')}</>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <LangChooser />
    </div>
  );
}
