import React, { JSX } from 'react';
import SideBar from './SideBar';

function Dashboard({ children }: { children: JSX.Element }) {
  return (
    <>
      <div
        className="flex "
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          position: 'fixed',
          top: '0',
          left: '0',
        }}
      >
        <SideBar />
        <main className="w-full relative overflow-y-scroll bg-base-100">
          <section>
            <div className="mx-auto w-full max-w-[2460px]">
              <div className="inner-container  m-8 -ml-1">{children}</div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
