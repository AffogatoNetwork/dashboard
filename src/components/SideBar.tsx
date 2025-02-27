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
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

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

  const showMore = () => {
    controls.start({
      width: '250px',
      transition: { duration: 0.001 },
    });
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });

    setActive(true);
  };

  const showLess = () => {
    controls.start({
      width: '55px',
      transition: { duration: 0.001 },
    });

    controlText.start({
      opacity: 0,
      display: 'none',
    });

    controlTitleText.start({
      opacity: 0,
    });

    setActive(false);
  };

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

    showMore();
    getCooperative(companyName);
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-[250px] animate duration-300  relative flex flex-col pt-2 min-h-screen group">
        <div className="flex justify-center md:m-4 m-2 ">
          <div className="w-14 h-14">
            <CoopLogo className="inline-block" />
          </div>
        </div>

        <div className="flex justify-center md:m-4 m-2 ">
          <div className="text-sm text-center">
            <h1> {userData?.name} </h1>
            <h1> {userData?.email} </h1>
            <br />
            <button
              className="m-2 btn btn-accent text-white"
              onClick={() => navigate(`/admin`)}
            >
              {' '}
              Modulo de Administrador{' '}
            </button>
          </div>
        </div>

        <div className="grow">
          {data.map((group, index) => (
            <div key={index} className="ml-2">
              {group.items.map((item, index2) => (
                <div
                  key={index2}
                  onClick={() => navigate(`${item.href}`)}
                  className={`${item.href === window.location.pathname && `${primary}  text-amber-900 hover:text-amber-900`}  ${item.disabled && 'cursor-not-allowed bg-gray-100 rounded-l-lg text-gray-500 opacity-50 hover:text-amber-900'} inline-flex items-center w-full h-12  mt-2 px-4 py-4 hover:bg-white rounded-l-lg rounded hover:text-amber-900 font-medium  cursor-pointer `}
                >
                  <item.icon className="" />
                  <p className="ml-4 text-sm">
                    <>{t(item.title)}</>
                  </p>
                </div>
              ))}
            </div>
          ))}
          <div
            tabIndex={1}
            onClick={() => navigate(`/create`)}
            className={`${ownerAddress && window.location.pathname == '/create' && `${primary} rounded-l-lg text-white hover:bg-white hover:text-amber-900 visible`}  ${!ownerAddress && 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50 hover:text-amber-900 hidden'} inline-flex items-center w-full h-12  mt-2 px-4 py-4  font-medium rounded-md cursor-pointer `}
          >
            <VoteIcon className="w-8" />
            <p className="ml-4 text-sm">
              <>{t('add-batches')}</>
            </p>
          </div>
          <div className="divider">
            {' '}
            <>{t('change-lang')}</>
          </div>
          <div className="m-2 ">
            <LangChooser />
          </div>

          <br />
          <br />

          <div>
            {userData.name ? (
              <div className="m-2">
                <p className="mb-2 ml-4 text-sm font-bold text-gray-500"></p>

                <div
                  onClick={() => logout()}
                  className={`inline-flex items-center button justify-center w-full h-16 mt-auto hover:text-amber-900 bg-gray-100  font-medium rounded-md`}
                >
                  <LogOutIcon className=" hover:text-white" />

                  <p className="ml-4 text-sm font-bold hover:text-amber-900">
                    <>
                      <>{t('logout')}</>
                    </>
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-2">
                <p className="mb-2 ml-4 text-sm font-bold text-red-500"></p>

                <div
                  onClick={() => navigate('/login', { replace: true })}
                  className={`inline-flex items-center button justify-center w-full h-16 mt-auto hover:text-amber-900 bg-gray-100  font-medium rounded-md`}
                >
                  <IconLogin className="hover:text-white" />
                  <p className="ml-4 text-sm font-bold hover:text-amber-900">
                    <>
                      <>{t('login.access')}</>
                    </>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
