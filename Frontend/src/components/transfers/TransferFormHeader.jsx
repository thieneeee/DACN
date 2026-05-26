import React from 'react';

const TransferFormHeader = ({ formData, setFormData, warehouses }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider">Kho nguồn</label>
          <div className="relative">
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#1E56A0] outline-none appearance-none"
              value={formData.from_warehouse_id}
              onChange={(e) => setFormData({...formData, from_warehouse_id: e.target.value})}
            >
              <option value="">Chọn kho đi...</option>
              {warehouses.map(w => (
                <option key={w.db_id} value={w.db_id}>{w.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider">Kho đích</label>
          <div className="relative">
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#1E56A0] outline-none appearance-none"
              value={formData.to_warehouse_id}
              onChange={(e) => setFormData({...formData, to_warehouse_id: e.target.value})}
            >
              <option value="">Chọn kho đến...</option>
              {warehouses.map(w => (
                <option key={w.db_id} value={w.db_id}>{w.name}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider">Ngày điều chuyển</label>
          <div className="relative">
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1E56A0] outline-none"
              value={formData.transfer_date}
              onChange={(e) => setFormData({...formData, transfer_date: e.target.value})}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransferFormHeader;