import React from "react";
import "../styles/app.scss";
import "react-toastify/dist/ReactToastify.css";
import CoopLogo from "./common/CoopLogo";
import { Blockchain } from "./icons/blockchain";
import Button from '../components/ui/button';
import { HomeIcon } from "./icons/home";
import { ProfileIcon } from "./icons/profile";
import { AgricultureIcon } from "./icons/agriculture";
import { LandscapeIcon } from "./icons/landscape";
import { LocalCafeIcon } from "./icons/local_cafe";
import { VerifiedIcon } from "./icons/verified-icon";
import { LinkIcon } from "./icons/link";
import { VoteIcon } from "./icons/vote-icon";
import AuthorCard from "./ui/author-card";
import AuthorImage from '../assets/images/author.jpg';


const Sidebar = () => {

  return (
    <>
      <aside
        className="top-0 z-40 h-full w-full max-w-full border-dashed border-gray-200 bg-body ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-gray-700 dark:bg-dark xs:w-80 xl:fixed  xl:w-72 2xl:w-80 hidden xl:block">
        <div className="m-4">

        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
          Brand</h2>

        <div className="flex flex-col items-center mt-6 -mx-2 ">
          <div className="object-cover w-24 h-24 mx-2 my-3 rounded-full">
            <CoopLogo className=''/>
          </div>
          <AuthorCard
          image={AuthorImage}
          name="Coperativa/Empresa"
          role="mail@affogato.com"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <a className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
               href="/#">
              <HomeIcon/>

              <span className="mx-4 font-medium">Home</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="farmers">
              <ProfileIcon/>


              <span className="mx-4 font-medium">Productores</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="create">

              <VoteIcon/>
              <span className="mx-4 font-medium">Crear Lotes</span>
            </a>



            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="list">

              <AgricultureIcon/>
              <span className="mx-4 font-medium">Lotes</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="farms">
              <LandscapeIcon/>
              <span className="mx-4 font-medium">Fincas</span>
            </a>
            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#">
              <VerifiedIcon/>
              <span className="mx-4 font-medium">Certificación</span>
            </a>
            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#">
              <LinkIcon/>
              <span className="mx-4 font-medium">Trazabilidad</span>
            </a>

            <a
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
              href="#">
              <Blockchain/>
              <span className="mx-4 font-medium">Settings</span>
            </a>

            <Button
              title="Close"
              color="primary"
              shape="rounded"
              variant="solid"
              size="large"
              className="flex items-center text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700"
            >

            </Button>

          </nav>
        </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
