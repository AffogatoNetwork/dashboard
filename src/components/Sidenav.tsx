import React from "react";
import { Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import CoopLogo from "./common/CoopLogo";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Iconos
import { HomeIcon } from "./icons/home";
import { ProfileIcon } from "./icons/profile";
import { LinkIcon } from "./icons/link";
import { VerifiedIcon } from "./icons/verified-icon";
import { LocalCafeIcon } from "./icons/local_cafe";
import { LandscapeIcon } from "./icons/landscape";
import { AgricultureIcon } from "./icons/agriculture";
import { VoteIcon } from "./icons/vote-icon";
import { LogOutIcon } from "./icons/logout";


const SideNav = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Sidebar collapsedWidth="60px" customBreakPoint="800px" backgroundColor="#ffff">
      <div className="px-0 pb-5">
        <div className="pb-6 pt-">
          <div className="flex items-center rounded-lg  bg-gray-100 p-5 dark:bg-light-dark">
            <div className="relative shrink-0 overflow-hidden dark:border-gray-400 rounded-full border-white h-10 w-10 drop-shadow-main border-3 object-contain">
              <CoopLogo className=""/>
            </div>

            <div className="ltr:pl-3 rtl:pr-3"><h3
              className="text-sm font-medium uppercase tracking-wide text-gray-900 dark:text-white">Coperativa/Empresa</h3>
              <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">mail@affogato.com</span></div>
          </div>
        </div>


        <Menu className="w-full">


          <MenuItem  icon={<HomeIcon name="Home" />} onClick={() => navigate("/")}>
            <>
              {t("home")}
            </>
          </MenuItem>
          <MenuItem  icon={<ProfileIcon name="Productores" />} onClick={() => navigate("/farmers")}>
            <>
              {t("farmers")}
            </>
          </MenuItem>
          <MenuItem  icon={<VoteIcon name="Agregar Lote" />} onClick={() => navigate("/create")}>
            <>
              {t("add-batch")}
            </>
          </MenuItem>
          <MenuItem  icon={<AgricultureIcon name="Lotes" />} onClick={() => navigate("/list")}>
            <>
              {t("batches")}
            </>
          </MenuItem>
          <MenuItem  icon={<LandscapeIcon name="Fincas" />} onClick={() => navigate("/farms")}>
            <>
              {t("farms")}
            </>
          </MenuItem>
          <MenuItem  icon={<LocalCafeIcon name="Catación" />}>
            <>
              {t("cupping")}
            </>
          </MenuItem>
          <MenuItem  icon={<VerifiedIcon name="Certificación" />}>
            <>
              {t("certification")}
            </>
          </MenuItem>
          <MenuItem  icon={<LinkIcon name="Trazabilidad" />}>
            <>
              {t("traceability")}
            </>
          </MenuItem>

          <MenuItem className="border-t" icon={<LogOutIcon name="logout" />}>
            <>
              {t("logout")}
            </>
          </MenuItem>

        </Menu>
      </div>
    </Sidebar>
  );
};

export default SideNav;
