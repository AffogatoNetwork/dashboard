import React, { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import CoopLogo from "./common/CoopLogo";

import { useTranslation } from "react-i18next";
import {NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../states/AuthContext";

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
import { makeShortAddress } from "../utils/utils";
import LangChooser from "./common/LangChooser";


const SideNav = () => {
  const { t } = useTranslation();
  const { authContext, authState } = useAuthContext();
  const [state] = authState;
  const navigate = useNavigate();
  const [ownerAddress, setOwnerAddress] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      if (state.provider != null) {
        const signer = state.provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setOwnerAddress(address);
      }
    };
    loadProvider();
  });


  const logout = () => {
    authContext.signOut();
  };
  return (
    <Sidebar collapsedWidth="60px"  backgroundColor="#ffff">
      <div className="px-0 pb-5">
        <div className="pb-6 pt-">
          <div className="flex items-center rounded-lg  bg-gray-100 p-5 dark:bg-light-dark">
            <div className="relative shrink-0 overflow-hidden dark:border-gray-400 rounded-full border-white h-10 w-10 drop-shadow-main border-3 object-contain">
              <CoopLogo className=""/>
            </div>

            <div className="ltr:pl-3 rtl:pr-3"><h3
              className="text-sm font-medium uppercase tracking-wide text-gray-900 dark:text-white">Coperativa/Empresa</h3>
              <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400"> {makeShortAddress(ownerAddress)}
</span></div>
          </div>
        </div>


        <Menu className="w-full">


          <MenuItem  icon={<HomeIcon name="Home" />} onClick={() => navigate("/")}>
            <>
              {t("home")}
            </>

          </MenuItem>
          <MenuItem active={window.location.pathname === "/farmers"} icon={<ProfileIcon name="Productores" />} onClick={() => navigate("/farmers")}>
            <>
              {t("farmers")}
            </>
          </MenuItem>
          <MenuItem  active={window.location.pathname === "/create"} icon={<VoteIcon name="Agregar Lote" />} onClick={() => navigate("/create")}>
            <>
              Crear Lotes
            </>
          </MenuItem>
          <MenuItem active={window.location.pathname === "/list"} icon={<AgricultureIcon name="Lotes" />} onClick={() => navigate("/list")}>
            <>
              {t("batches")}
            </>
          </MenuItem>
          <MenuItem active={window.location.pathname === "/farms"} icon={<LandscapeIcon name="Fincas" />} onClick={() => navigate("/farms")}
          >
            <>
              {t("farms")}
            </>
          </MenuItem>
                   <MenuItem disabled icon={<LocalCafeIcon name="Catación" />}>
            Catación
          </MenuItem>
          <MenuItem disabled icon={<VerifiedIcon name="Certificación" />}>
            <>
              Certificación
            </>
          </MenuItem>

          <MenuItem disabled icon={<LinkIcon name="Trazabilidad" />}>
            Trazabilidad
          </MenuItem>

          <MenuItem className="border-t" icon={<LogOutIcon name="logout" />} onClick={() => logout()}>
            <>
              {t("logout")}
            </>
          </MenuItem>
        </Menu>
        <div className="p-4 w-24 h-14">
          <LangChooser type="dropdown" />
        </div>

      </div>
    </Sidebar>
  );
};

export default SideNav;
