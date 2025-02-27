import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../states/AuthContext';
import CoopLogo from './common/CoopLogo';
import LangChooser from './common/LangChooser';
import { isValidCellphone, isValidEmail } from '../utils/utils';
import background from '../assets/coffee.jpg';
import { AiOutlineGoogle } from 'react-icons/ai';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = () => {
  const { t } = useTranslation();
  const areaCode = '+504';
  const navigate = useNavigate();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const [userInput, setUserInput] = useState('');
  const [userInputError, setUserInputError] = useState('');

  useEffect(() => {
    function check() {
      if (state.isLoggedIn) {
        navigate('/farmers', { replace: true });
      } else if (state.isLoggedIn) {
        setUserInput('');
      }
    }
    check();
    // eslint-disable-next-line
  }, [state.isLoggedIn, state.isSignInError]);

  const magicLogin = async () => {
    try {
      if (isValidEmail(userInput)) {
        authContext.signIn({ emailLogin: true, credential: userInput });
        localStorage.setItem('host', window.location.host);
      } else if (isValidCellphone(userInput)) {
        localStorage.setItem('host', window.location.host);
        authContext.signIn({
          emailLogin: false,
          credential: areaCode.concat(userInput),
        });
      }
    } catch (e) {}
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target.value;

    setUserInput(input);
    if (isValidCellphone(input) || isValidEmail(input)) {
      setUserInputError('');
    } else {
      setUserInputError('El valor no es valido.');
    }
  };

  const handleLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user.email);
        localStorage.setItem('email', JSON.stringify(user.email));
        navigate('/farmers-module');
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative bg-black -m-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-opacity-80 bg-black">
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
          <div className="flex-col flex self-center p-10 sm:max-w-5xl md:pl-2 xl: z-10">
            <div className="hidden lg:flex flex-col text-white">
              <h1 className="mb-3 font-bold text-5xl ">
                <>{t('welcome')}</>: a la Plataforma de Trazabilidad
              </h1>
              <p className="pr-3 md:text-light">
                Nuestro café trazado con la seguridad de la tecnología de
                blockchain.{' '}
              </p>
            </div>
          </div>
          <div className="flex justify-center self-center  z-10">
            <div className="p-12 bg-white mx-auto rounded-2xl w-100 flex flex-col justify-center items-center ">
              <div className="w-14 pb-4">
                <CoopLogo className="" />
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-2xl text-gray-800">
                  <>{t('login.title')}</>
                </h3>
              </div>
              <div
                className="space-y-5 form-control"
                onSubmit={() => magicLogin()}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Email:
                  </label>
                  <input
                    className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                    type="email"
                    value={userInput}
                    placeholder={t('placeholders.email') as string}
                    onChange={handleUserInputChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-amber-900 hover:bg-black text-gray-100 p-3 tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={() => magicLogin()}
                  >
                    <>{t('login.access')}</>
                  </button>

                  <button
                    type="submit"
                    className="mt-5 w-full flex justify-center items-center bg-[#EA2F07] hover:bg-black text-gray-100 p-3 tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                    onClick={() => handleLoginWithGoogle()}
                  >
                    <>
                      <AiOutlineGoogle className="text-2xl mr-2" />
                      {t('login.access-google')}
                    </>
                  </button>

                  <p
                    className="pt-6 text-sm link link-info text-gray-500"
                    onClick={() => navigate('/signup', { replace: true })}
                  >
                    <>{t('login.create-account')}</>
                  </p>
                  <br />
                </div>
              </div>
              <div className="pt-5 text-center text-gray-400 text-xs">
                <h4>
                  Estamos haciendo cambios por favor elegir el bòton de Iniciar
                  con Google
                </h4>
                <h4>
                  para poder editar y tener permisos Administrativos las cuentas
                  debes estar en la lista de Administradores y tener inicio
                  seguro con 2FA
                </h4>
              </div>
              <div className="pt-5 text-center text-gray-400 text-xs">
                <span>
                  <LangChooser />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
