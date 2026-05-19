import React from 'react';

const AuditTable = () => {
  const auditData = [
    { sku: 'SK-9001', name: 'Wireless Mouse', system: 45, actual: 45, diff: 0, note: '' },
    { sku: 'SK-2234', name: 'Laptop Stand', system: 20, actual: 18, diff: -2, note: 'Box damage found at A3 row' },
    { sku: 'SK-4455', name: 'USB-C Cable', system: 100, actual: 105, diff: 5, note: '' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-800">Danh sách đối soát tồn kho</h3>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Lọc</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
            <th className="px-6 py-3">SKU</th>
            <th className="px-6 py-3">Tên sản phẩm</th>
            <th className="px-6 py-3 text-center">Tồn hệ thống</th>
            <th className="px-6 py-3 text-center">Thực tế</th>
            <th className="px-6 py-3 text-center">Chênh lệch</th>
            <th className="px-6 py-3">Ghi chú</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm">
          {auditData.map((item, idx) => (
            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-4 font-mono font-bold text-[#1E56A0]">{item.sku}</td>
              <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
              <td className="px-6 py-4 text-center text-slate-500 bg-slate-50/30">{item.system}</td>
              <td className="px-6 py-4 text-center">
                <input 
                  className={`w-20 text-center py-1 border-2 rounded-lg font-bold outline-none transition-all ${
                    item.diff < 0 ? 'border-red-100 text-red-600 focus:border-red-500' : 
                    item.diff > 0 ? 'border-green-100 text-green-600 focus:border-green-500' : 
                    'border-transparent hover:border-slate-200 focus:border-[#1E56A0]'
                  }`}
                  defaultValue={item.actual}
                  type="number" 
                />
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2 py-1 rounded text-[10px] font-black ${
                  item.diff < 0 ? 'bg-red-50 text-red-600' : 
                  item.diff > 0 ? 'bg-green-50 text-green-600' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  {item.diff > 0 ? `+${item.diff}` : item.diff}
                </span>
              </td>
              <td className="px-6 py-4">
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-xs italic text-slate-400 placeholder:text-slate-200" 
                  placeholder="Thêm ghi chú..." 
                  defaultValue={item.note}
                  type="text" 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;