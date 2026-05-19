import React from 'react';

const ReportFilters = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {/* Loại báo cáo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loại báo cáo</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none">
              <option>Báo cáo Xuất - Nhập - Tồn</option>
              <option>Giá trị tồn kho</option>
              <option>Cảnh báo hàng sắp hết</option>
            </select>
          </div>

          {/* Kho hàng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kho hàng</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none">
              <option>Kho tổng (Hà Nội)</option>
              <option>Chi nhánh (TP.HCM)</option>
            </select>
          </div>

          {/* Khoảng thời gian */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Thời gian</label>
            <input 
              type="text" 
              defaultValue="01/10/2023 - 31/10/2023"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-2 bg-[#107c41] hover:bg-[#0e6b38] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all">
            <span className="material-symbols-outlined text-[20px]">description</span>
            Xuất Excel
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-[20px]">print</span>
            In
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportFilters;