import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MASTER_PRODUCTS = [
  { sku: "IPH-15-PRO-256", name: "iPhone 15 Pro Max 256GB", sub: "Natural Titanium", stock: 452, price: 1199, img: "https://vnecdn.net" },
  { sku: "MBP-M3P-14-512", name: "MacBook Pro 14\" M3 Pro", sub: "Space Black - 18GB RAM", stock: 86, price: 1999, img: "https://cdn-apple.com" },
  { sku: "AW-S9-45-GPS", name: "Watch Series 9 GPS 45mm", sub: "Midnight Aluminum", stock: 1024, price: 429, img: "https://cdn-apple.com" }
];

export default function CreateOutboundScreen() {
  const navigate = useNavigate();
  const [general, setGeneral] = useState({
    reason: "", warehouse: "Main Kho hàng (W01)", 
    date: new Date().toISOString().split('T')[0], 
    ref: `SO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  });
  const [items, setItems] = useState([]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === "name") {
          const found = MASTER_PRODUCTS.find(p => p.name === value);
          return found ? { ...item, ...found, qty: 1 } : { ...item, [field]: value };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, i) => acc + (Number(i.qty || 0) * Number(i.price || 0)), 0);
  const totalAmount = subtotal * 1.1;

  const saveReceipt = (status) => {
    if (items.length === 0) return alert("Vui lòng thêm ít nhất một sản phẩm!");
    const saved = JSON.parse(localStorage.getItem("outbound_data") || "[]");
    const newId = status === "DRAFT" ? `DFT-OUT-${Date.now().toString().slice(-4)}` : `RE-${new Date().getFullYear()}-${String(saved.length + 1).padStart(3, '0')}`;
    
    const newDoc = {
      id: newId, date: general.date, creator: "Admin User", avatar: "AU",
      warehouse: general.warehouse, items: items.reduce((acc, i) => acc + Number(i.qty || 0), 0),
      total: totalAmount, status: status, type: "out"
    };

    localStorage.setItem("outbound_data", JSON.stringify([newDoc, ...saved]));
    alert(`${status} saved successfully!`);
    navigate("/in-out");
  };

  return (
    <div className="space-y-6 pb-20 font-inter text-slate-700">
      <div className="bg-white rounded-xl border p-6 grid grid-cols-4 gap-6 shadow-sm">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Lý do</label>
          <input value={general.reason} onChange={e => setGeneral({...general, reason: e.target.value})} className="w-full border p-2 rounded text-sm bg-slate-50/50 outline-none" placeholder="Lý do for dispatch..." />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Kho hàng</label>
          <select value={general.warehouse} onChange={e => setGeneral({...general, warehouse: e.target.value})} className="w-full border p-2 rounded bg-slate-50/50 text-sm"><option>Main Kho hàng (W01)</option></select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Ngày</label>
          <input type="date" value={general.date} onChange={e => setGeneral({...general, date: e.target.value})} className="w-full border p-2 rounded text-sm bg-slate-50/50" />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Số tham chiếu</label>
          <input value={general.ref} readOnly className="w-full border p-2 rounded text-sm font-bold bg-slate-100" />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center font-bold text-sm">
          Danh sách sản phẩm
          <button onClick={() => setItems([...items, { id: Date.now(), sku: "", name: "", sub: "", stock: 0, price: 0, img: "", qty: 1 }])} className="text-[#1E56A0] flex items-center gap-1">+ Thêm sản phẩm</button>
        </div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-slate-50 border-b text-[11px] font-bold text-slate-400 uppercase">
            <tr><th className="px-6 py-4">SKU</th><th>Sản phẩm</th><th className="text-center">Số lượng</th><th className="text-right">Giá</th><th className="text-center">Thao tác</th></tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-slate-400">{item.sku || "---"}</td>
                <td className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden flex items-center justify-center">
                    {item.img ? <img src={item.img} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-300">image</span>}
                  </div>
                  <input list="prods" value={item.name} onChange={e => handleItemChange(item.id, "name", e.target.value)} className="font-bold outline-none flex-1" placeholder="Tìm kiếm sản phẩm..." />
                </td>
                <td><input type="number" value={item.qty} onChange={e => handleItemChange(item.id, "qty", e.target.value)} className="w-16 mx-auto block border rounded text-center py-1 font-bold" /></td>
                <td className="text-right font-bold">${(item.price || 0).toLocaleString()}</td>
                <td className="text-center"><button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500">delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <datalist id="prods">{MASTER_PRODUCTS.map(p => <option key={p.sku} value={p.name} />)}</datalist>
        <div className="p-8 border-t bg-slate-50/20 flex justify-end">
          <div className="w-64 text-right space-y-1">
            <p className="text-sm font-bold text-slate-500 italic">Tổng cộng (Bao gồm VAT 10%)</p>
            <p className="text-2xl font-black text-[#1E56A0] font-inter">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate("/in-out")} className="px-6 py-2 font-bold text-slate-400">Hủy</button>
        <button onClick={() => saveReceipt("DRAFT")} className="px-6 py-2 border border-[#1E56A0] text-[#1E56A0] rounded-lg font-bold hover:bg-blue-50">Lưu nháp</button>
        <button onClick={() => saveReceipt("COMPLETED")} className="px-8 py-2 bg-[#1E56A0] text-white rounded-lg font-bold shadow-lg">Xác nhận xuất kho</button>
      </div>
    </div>
  );
}
