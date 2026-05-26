import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function CreateOutboundScreen() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [productsMaster, setProductsMaster] = useState([]);

  useEffect(() => {
    // Lấy product data thực tế
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProductsMaster(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const [general, setGeneral] = useState({
    reason: "", warehouse: "Main Kho hàng (W01)", 
    date: new Date().toISOString().split('T')[0], 
    ref: `SO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0')}`
  });
  const [items, setItems] = useState([{ id: Date.now(), sku: "", name: "", sub: "", stock: 0, price: 0, img: "", qty: 1 }]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === "name") {
          const found = productsMaster.find(p => p.name === value);
          return found ? { ...item, ...found, qty: 1 } : { ...item, [field]: value };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((acc, i) => acc + (Number(i.qty || 0) * Number(i.price || 0)), 0);
  const totalAmount = subtotal * 1.1; // Bao gồm VAT 10% như frontend demo yêu cầu hoặc bỏ

  const saveReceipt = async (status) => {
    if (items.length === 0) return alert("Vui lòng thêm ít nhất một sản phẩm!");
    
    const payload = {
        type: "OUT",
        reference: general.ref,
        note: general.reason || `Phiếu xuất ${status} bởi ${user?.full_name || 'Admin'}`,
        items: items.map(item => ({
            product_id: item.db_id || item.id,
            quantity: Number(item.qty)
        }))
    };

    // Chuẩn hóa id
    payload.items.forEach((item, index) => {
       const matchedProduct = productsMaster.find(p => p.name === items[index].name);
       if (matchedProduct) item.product_id = matchedProduct.id;
    });

    try {
        await axios.post("http://localhost:5000/api/transactions", payload);
        alert(`Tạo phiếu xuất thành công!`);
        navigate("/in-out");
    } catch (error) {
        console.error(error);
        alert("Lỗi tạo phiếu xuất: " + (error.response?.data?.error || error.message));
    }
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
                    {item.img || item.image_url ? <img src={item.img || item.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-300">image</span>}
                  </div>
                  <input list="prods" value={item.name} onChange={e => handleItemChange(item.id, "name", e.target.value)} className="font-bold outline-none flex-1" placeholder="Tìm kiếm sản phẩm..." />
                </td>
                <td><input type="number" value={item.qty} onChange={e => handleItemChange(item.id, "qty", e.target.value)} className="w-16 mx-auto block border rounded text-center py-1 font-bold" /></td>
                <td className="text-right font-bold">{Number(item.price || 0).toLocaleString()} ₫</td>
                <td className="text-center"><button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="material-symbols-outlined text-[18px] text-slate-300 hover:text-red-500">delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <datalist id="prods">{productsMaster.map(p => <option key={p.sku} value={p.name} />)}</datalist>
        <div className="p-8 border-t bg-slate-50/20 flex justify-end">
          <div className="w-64 text-right space-y-1">
            <p className="text-sm font-bold text-slate-500 italic">Tổng cộng (Bao gồm VAT 10%)</p>
            <p className="text-2xl font-black text-[#1E56A0] font-inter">{totalAmount.toLocaleString(undefined, {maximumFractionDigits: 0})} ₫</p>
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
