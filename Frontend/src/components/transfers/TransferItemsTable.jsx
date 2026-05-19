import React from 'react';

const TransferItemsTable = () => {
  // Dữ liệu mẫu (sau này bạn có thể chuyển thành state)
  const items = [
    { id: 1, sku: 'WH-X204-A', name: 'Precision Sensor Module v4', category: 'Electronic Components / Sensors', available: 1240, qty: 150 },
    { id: 2, sku: 'BK-L98-Y', name: 'Reinforced Brackets (Bulk)', category: 'Hardware / Construction', available: 850, qty: 40 },
    { id: 3, sku: 'CB-FL-M1', name: 'Fiber Optic Cable (100m)', category: 'Connectivity / Networking', available: 12, qty: 5 },
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Sản phẩm điều chuyển</h3>
        <button className="flex items-center gap-2 text-[#1E56A0] font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên sản phẩm</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Sẵn có</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32">Số lượng</th>
              <th className="px-6 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.sku}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-medium">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold">
                    {item.available.toLocaleString()} Units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-1 focus:ring-[#1E56A0] outline-none"
                    defaultValue={item.qty}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-12 text-sm">
        <span className="text-slate-500">Số loại (SKU): <strong className="text-slate-900">{items.length}</strong></span>
        <span className="text-slate-500">Tổng số lượng: <strong className="text-slate-900">195</strong></span>
      </div>
    </section>
  );
};

export default TransferItemsTable;