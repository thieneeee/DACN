import React from 'react';

const AuditScanner = () => {
  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* Barcode Scanner Input */}
      <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          Nhập liệu nhanh (SKU/Barcode)
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#1E56A0] text-2xl">barcode_scanner</span>
          <input 
            className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-blue-50 rounded-xl focus:ring-2 focus:ring-[#1E56A0] focus:border-transparent transition-all text-lg font-medium placeholder:text-slate-300 outline-none" 
            placeholder="Quét mã vạch hoặc nhập SKU (vd: SK-9001)..." 
            type="text"
          />
          <button className="absolute right-4 bg-[#1E56A0] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition-all active:scale-95">
            XÁC NHẬN
          </button>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Máy quét đã kết nối</span>
          </div>
          <p className="text-xs text-slate-500">Gần đây: <span className="font-bold text-slate-700">Wireless Mouse (SK-9001)</span> - 2 phút trước</p>
        </div>
      </div>

      {/* Audit Progress Card */}
      <div className="col-span-12 lg:col-span-4 bg-[#1E56A0] text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm opacity-80 font-medium">Tiến độ kiểm kê</h3>
            <p className="text-4xl font-black mt-2 tracking-tighter">16% <span className="text-lg font-normal opacity-60">Hoàn tất</span></p>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full mt-4">
            <div className="bg-white h-2 rounded-full w-[16%]"></div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest">Lệch tồn kho</p>
              <p className="text-lg font-bold">07 sản phẩm</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-30">troubleshoot</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditScanner;