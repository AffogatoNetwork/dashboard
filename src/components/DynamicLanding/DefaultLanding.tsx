import React from "react";
import {useTranslation} from "react-i18next";
export const DefaultLanding = () => {
    const {t} = useTranslation();

    return (<>

        <body className="overflow-x-hidden w-screen relative services-2-page">
        <div className="wrapper mx-auto text-gray-900 font-normal max-w-[1320px]"><a> </a>
            <div className="overlay"></div>
            <div className="px-[12px] md:px-[36px] xl:px-0 mt-[70px] text-center z-10 relative lg:mt-[99px]">
                <div className="text-center">
                    <h2 className="font-bold font-chivo mx-auto text-gray-900 mb-5 md:mb-[30px] text-[35px] leading-[44px] md:text-[46px] md:leading-[52px] lg:text-heading-1 md:w-[20ch]">Affogato <span
                        className="text-amber-900">trazabilidad</span> facil usando la tecnologia blockchain</h2>
                    <p className="text-quote md:text-lead-lg text-gray-500 mx-auto md:w-[47ch] mb-[50px]">Vea todo el proceso desde la producción hasta el tostado y finalmente en su mesa con un simple escaneo
                    </p>
                </div>
                <div className="flex items-center justify-center mb-[87px]">
                    <button className="btn btn-lg btn-primary text-white">
                        <a href="/farmers">
                            Ir a la Plataforma
                        </a>
                    </button>
                </div>
                <div className="relative mx-auto max-w-[1190px]"><img className="h-full w-full object-cover rounded-2xl"
                                                                      src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2Faffogato-dashboard.png?alt=media&token=ad0329a4-a784-4862-a7f3-aa6207765d78"
                                                                      alt="Agon"/>
                </div>
            </div>
            <div className="px-[12px] md:px-[36px] xl:px-0 mt-[30px] md:mt-[80px] lg:mt-[143px]">
                <h2 className="font-bold font-chivo text-[25px] leading-[30px] md:text-heading-3 text-center mb-[40px] md:mb-[60px] lg:mb-[84px]">Empresas y Cooperativas que confian en nosotros
                </h2>
                <div className="flex flex-wrap items-center justify-center mb-[30px] md:mb-[60px] lg:mb-[80px]"><a
                    className="transition-all duration-300 partner-item p-[15px] md:pr-[15px] xl:w-auto lg:w-[184px] hover:translate-y-[-3px]"
                    href="https://www.proexo.org/#"><img className="w-44 h-32"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2Fproexo.png?alt=media&token=d726955b-e0c4-4f2b-b409-1b6472b07019" alt="Proexo"/></a><a
                    className="transition-all duration-300 partner-item p-[15px] md:pr-[15px] xl:w-auto lg:w-[184px] hover:translate-y-[-3px]"
                    href="https://www.comsa.hn"><img className="w-30 h-32"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2Fcomsa.png?alt=media&token=37064738-74d0-4ba7-9363-07e8b382ce43" alt="Comsa"/></a>
                    <a
                    className="transition-all duration-300 partner-item p-[15px] md:pr-[15px] xl:w-auto lg:w-[184px] hover:translate-y-[-3px]"
                    href=""><img className="w-32 h-32"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2Fcommovel.png?alt=media&token=dbc7c2b0-406c-49f9-afa5-e7dc160114e3" alt="partner logo"/></a>
                    <a
                    className="transition-all duration-300 partner-item p-[15px] md:pr-[15px] xl:w-auto lg:w-[184px] hover:translate-y-[-3px]"
                    href="https://montanaverdehn.com"><img className="w-28 h-28"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2Fcopracnil.png?alt=media&token=64ae7aa5-baea-415a-b0e9-81b4daf3ee17" alt="partner logo"/></a>
                </div>
                <div className="w-full bg-gray-300 h-[1px] mb-[50px] md:mb-[90px] lg:mb-[150px]"></div>
            </div>
            <div
                className="rounded-2xl p-[30px] md:py-[53px] md:px-[48px] gap-5 mx-auto bg-bg-6 md:flex lg:gap-[40px] lg:h-[420px] xl:h-[390px] max-w-[1190px] mt-[70px] lg:mt-[150px]"
                >
                <div className="flex-1 mb-[30px]">
                    <p className="text-capitalized uppercase text-gray-500 tracking-[2px] mb-[13px]">Blockchain </p>
                    <h4 className="font-bold font-chivo text-[28px] leading-[32px] md:text-heading-2 mb-[20px]">Nuestro café trazado con la seguridad de la tecnología de blockchain</h4>
                    <p className="text-text text-gray-500">Codigos QR unicos para los Hash
                    </p>
                </div>
                <div className="relative flex-1"><img
                    className="h-full w-full object-cover rounded-2xl img-shadow lg:absolute lg:max-w-[332px] lg:h-[403px] lg:right-0"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/Proexo%2F4.jpeg?alt=media&token=376da7da-4bbe-4d43-945e-d8d1574cc222" alt="Agon"/><img
                    className="h-full w-full object-cover absolute animate-float max-w-[225px] max-h-[230px] rounded-[14px] bottom-[-20px] left-[-10px]"
                    src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FCaptura%20de%20pantalla%202023-04-11%20a%20la(s)%2001.06.45.png?alt=media&token=41144e0a-0d33-47a1-8b8a-5eb5a3062a15" alt="Agon"/>
                </div>
            </div>
            <footer className="mt-[92px] lg:mt-[150px] xl:mt-[200px] mb-[30px]">
                <div className="px-[12px] md:px-[36px] xl:px-0 mt-[70px]">
                    <div className="flex flex-col items-center gap-2 mb-14 md:flex-row md:justify-between"><img
                        className="h-full w-full object-cover max-w-[162px]" src="https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/logos%2FAffogato.png?alt=media&token=de3b790e-d8fc-4662-b081-a4d7964a87b1"
                        alt="logo"/>
                        <div className="flex items-center flex-col gap-5 md:flex-row lg:gap-[30px]">
                            <p className="text-heading-6 font-chivo font-bold">Quieres trazar tu cafe?</p>
                            <button className="btn btn-lg bg-black text-white">
                                <a href="/signup">
                                    Crea una Cuenta
                                </a>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        </body>
    </>);
};
