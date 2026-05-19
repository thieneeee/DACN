import React from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { Outlet } from 'react-router-dom'; 

const MasterLayout = () => { 
  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar />
      <TopHeader />
      <main className="ml-[240px] pt-24 pb-8 px-6 min-h-screen">
        <Outlet /> 
      </main>
    </div>
  );
};

export default MasterLayout;