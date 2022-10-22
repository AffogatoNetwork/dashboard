import React from "react";
import Topbar from "./Topbar";
import Head from 'next/head';
import Sidebar from "./Sidebar";

function Dashboard({ children }: { children: JSX.Element }) {
  return (

    <>
      <div className="fltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80">
        <Topbar />
        <Sidebar/>
        <div className="mx-auto w-full max-w-[2460px] text-sm md:pt-14 4xl:pt-24">

          <div className="inner-container">{children}</div>

        </div>
      </div>

    </>
  );
}

export default Dashboard;




