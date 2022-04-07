import React, { useEffect, useState } from "react";
import Image from "react-bootstrap/esm/Image";
import Logo from "../assets/logo.png";
import Nav from "react-bootstrap/esm/Nav";

type props = {
  accountType: string;
};

type MenuItemType = {
  active: boolean;
  url: string;
  title: string;
  icon: string;
};

const Sidebar = ({ accountType }: props) => {
  const [menuItems, setMenuItems] = useState<Array<MenuItemType>>([]);

  useEffect(() => {
    const mItems = Array<MenuItemType>();
    mItems.push({
      active: false,
      url: "",
      title: "Dashboard",
      icon: "fa-columns"
    });

    if (accountType === "farmer") {
      mItems.push(
        {
          active: false,
          url: "farms",
          title: "Granjas",
          icon: "fa-apple-alt"
        },
        {
          active: false,
          url: "coffeeBatches",
          title: "Lote de Café",
          icon: "fa-seedling"
        },
        {
          active: false,
          url: "permissions",
          title: "Permisos",
          icon: "fa-users"
        },
        {
          active: false,
          url: "tastings",
          title: "Perfil de Taza",
          icon: "fa-coffee"
        }
      );
    }
    if (accountType === "taster") {
      mItems.push({
        active: false,
        url: "tastings",
        title: "Perfiles de tasas",
        icon: "fa-coffee"
      });
    }
    if (accountType === "cooperative") {
      mItems.push(
        {
          active: false,
          url: "producers",
          title: "Productores",
          icon: "fa-user-alt"
        },
        {
          active: false,
          url: "farms",
          title: "Granjas",
          icon: "fa-apple-alt"
        },
        {
          active: false,
          url: "coffeeBatches",
          title: "Lotes de Café",
          icon: "fa-seedling"
        },
        {
          active: false,
          url: "permissions",
          title: "Permisos",
          icon: "fa-users"
        }
      );
    }
    setMenuItems(mItems);
  }, []);

  return (    
    <Nav className="sidebar">
      <div className="user">
        <Image className="logo" src={Logo} />
        <i className="fa-solid fa-user"></i>
      </div>
      {menuItems.map((item) => {
        return <Nav.Link href="#">{item.title}</Nav.Link>;
      })} 
    </Nav>
  );
};

export default Sidebar;
