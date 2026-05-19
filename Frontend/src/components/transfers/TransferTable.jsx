const TransferTable = ({ data, onSelect, activeId }) => {
  return (
    <div className="flex-[3] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="text-[12px] text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 font-semibold border-b">Mã đơn</th>
              <th className="px-4 py-3 font-semibold border-b">Thời gian</th>
              <th className="px-4 py-3 font-semibold border-b">Lộ trình</th>
              <th className="px-4 py-3 font-semibold border-b text-center">SL</th>
              <th className="px-4 py-3 font-semibold border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={`cursor-pointer transition-colors ${
                  activeId === item.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-4 py-4 font-bold text-[#1E56A0]">{item.id}</td>
                <td className="px-4 py-4 text-slate-600">{item.date}</td>
                <td className="px-4 py-4">
                   <div className="flex items-center gap-2 font-medium">
                     {item.from} <span className="material-symbols-outlined text-xs text-slate-400">arrow_forward</span> {item.to}
                   </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">{item.itemsCount}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 w-24 mb-1">
                    <div className={`h-1 flex-1 rounded ${item.progress >= 33 ? 'bg-[#1E56A0]' : 'bg-slate-200'}`} />
                    <div className={`h-1 flex-1 rounded ${item.progress >= 66 ? 'bg-[#1E56A0]' : 'bg-slate-200'}`} />
                    <div className={`h-1 flex-1 rounded ${item.progress >= 100 ? 'bg-[#1E56A0]' : 'bg-slate-200'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[#1E56A0] uppercase tracking-tighter">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TransferTable;