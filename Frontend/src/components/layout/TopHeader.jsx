import React from 'react';

const TopHeader = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-40 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-lg font-bold text-slate-900 font-headline-md">Hệ thống Quản lý Tồn kho</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">Kho Trung Tâm</p>
            <p className="text-[10px] text-slate-500">Khu vực: Miền Bắc</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">expand_more</span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;