import React from 'react';

const AuditFooter = () => {
  return (
    <footer className="fixed bottom-0 right-0 w-[calc(100%-240px)] h-20 bg-white border-t border-slate-200 z-40 flex items-center justify-between px-8 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {/* Thông tin tiến độ bên trái */}
      <div className="flex items-center space-x-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tiến trình đợt này</span>
          <div className="flex items-center space-x-3 mt-0.5">
            <span className="text-2xl font-black text-[#1E56A0] font-manrope">24 / 150</span>
            <span className="text-xs text-slate-400 italic">mã hàng đã quét</span>
          </div>
        </div>

        <div className="h-10 w-px bg-slate-100 hidden md:block"></div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Người thực hiện</span>
          <div className="flex items-center space-x-2 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700">Alex Nguyen</span>
          </div>
        </div>
      </div>

      {/* Nhóm nút hành động bên phải */}
      <div className="flex items-center space-x-4">
        <button className="px-6 py-2.5 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all active:scale-95">
          LƯU NHÁP
        </button>
        
        <button className="px-8 py-2.5 bg-[#1E56A0] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center space-x-2">
          <span className="material-symbols-outlined text-lg">fact_check</span>
          <span>HOÀN TẤT KIỂM KÊ</span>
        </button>
      </div>
    </footer>
  );
};

export default AuditFooter;