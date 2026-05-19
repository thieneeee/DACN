import React from 'react';

const WarehouseCard = ({ warehouse }) => {
  const isOnline = warehouse.status === 'Hoạt động';

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E56A0]">
            <span className="material-symbols-outlined text-[28px]">
              {warehouse.type === 'store' ? 'store' : warehouse.type === 'factory' ? 'factory' : 'warehouse'}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 font-manrope">{warehouse.name}</h4>
            <div className="flex items-center text-slate-400 text-[11px] mt-0.5">
              <span className="material-symbols-outlined text-[14px] mr-1">pin_drop</span>
              ID: {warehouse.id}
            </div>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isOnline} className="sr-only peer" readOnly />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1E56A0]"></div>
        </label>
      </div>

      <div className="space-y-3 border-t border-slate-50 pt-4">
        <div className="flex items-start">
          <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2 mt-0.5">location_on</span>
          <p className="text-[13px] text-slate-600 leading-relaxed">{warehouse.address}</p>
        </div>
        <div className="flex items-center">
          <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">person</span>
          <p className="text-[13px] text-slate-600">Quản lý: <span className="font-semibold text-slate-800">{warehouse.manager}</span></p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {warehouse.status}
        </div>
        <button className="text-[#1E56A0] hover:underline text-[13px] font-semibold flex items-center">
          Chi tiết <span className="material-symbols-outlined text-[16px] ml-1">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default WarehouseCard;