const TransferDetailPanel = ({ data }) => {
  if (!data) return <div className="flex-1 bg-white rounded-xl border p-10 text-center">Chọn đơn hàng để xem</div>;

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto flex flex-col min-w-[320px] animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Chi tiết điều chuyển</h3>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{data.id} • {data.status}</p>
      </div>

      {/* Logistics */}
      <div className="p-5 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#1E56A0]">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Đơn vị vận chuyển</p>
              <p className="text-sm font-semibold text-slate-800">{data.carrier}</p>
            </div>
          </div>
        </div>

        {/* SKUs */}
        <div className="space-y-3">
          <h4 className="text-[12px] font-bold text-slate-900 uppercase">Danh sách hàng hóa</h4>
          {data.skus.map((sku, index) => (
            <div key={index} className="flex items-center justify-between p-2 border border-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-100 shrink-0" />
                <div>
                  <p className="text-sm font-bold leading-tight">{sku.name}</p>
                  <p className="text-[10px] text-slate-400">{sku.sku}</p>
                </div>
              </div>
              <span className="font-bold text-[#1E56A0]">x{sku.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto p-4 border-t bg-slate-50 flex gap-2">
        <button className="flex-1 bg-white border border-slate-300 py-2 rounded text-xs font-bold hover:bg-slate-100 transition-colors">In vận đơn</button>
        <button className="flex-1 bg-[#1E56A0] text-white py-2 rounded text-xs font-bold hover:opacity-90">Theo dõi</button>
      </div>
    </div>
  );
};
export default TransferDetailPanel;