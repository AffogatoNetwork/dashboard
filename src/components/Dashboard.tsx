import React from "react";
import Topbar from "./Topbar";
import SideNav from "./Sidenav";

function Dashboard({ children }: { children: JSX.Element }) {

  return (
    <>
      <div className="flex " style={{width:'100%',  height: '100%', minHeight: '400px',position:"fixed", top: '0',
        left: '0',}}>
        <SideNav/>
        <main className="w-full relative overflow-y-scroll"  >
          <Topbar />
          <section>
            <div className="mx-auto w-full max-w-[2460px] text-sm md:pt-14 4xl:pt-24">
              <div className="inner-container ">{children}</div>
            </div>
          </section>

        </main>

      </div>

    </>
  );
}

export default Dashboard;




