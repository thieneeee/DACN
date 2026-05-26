import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function CreateInboundScreen() {
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

  const [info, setInfo] = useState({ supplier: "", warehouse: "Main Kho hàng (W01)", date: new Date().toISOString().split('T')[0], ref: `PO-${Date.now().toString().slice(-6)}`, note: "" });
  const [items, setItems] = useState([{ id: Date.now(), sku: "", name: "", qty: 1, price: 0, expiry: "" }]);

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

  const grandTotal = items.reduce((acc, i) => acc + (Number(i.qty || 0) * Number(i.price || 0)), 0);

  const saveInbound = async (status) => {
    if (items.length === 0) return alert("Vui lòng thêm sản phẩm!");
    
    // Cấu trúc payload gọi api transaction
    const payload = {
        type: "IN",
        reference: info.ref,
        note: info.note || `Phiếu nhập ${status} bởi ${user?.full_name || 'Admin'}`,
        items: items.map(item => ({
            product_id: item.db_id || item.id, // cần trỏ đúng db id của product
            quantity: Number(item.qty)
        }))
    };

    // Chuẩn hóa format product_id từ id gốc của DB
    payload.items.forEach((item, index) => {
       const matchedProduct = productsMaster.find(p => p.name === items[index].name);
       if (matchedProduct) item.product_id = matchedProduct.id;
    });

    try {
        await axios.post("http://localhost:5000/api/transactions", payload);
        alert(`Tạo phiếu nhập thành công!`);
        navigate("/in-out");
    } catch (error) {
        console.error(error);
        alert("Lỗi tạo phiếu: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="space-y-6 pb-10 font-inter text-slate-700">
      <div className="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-4 gap-6">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Nhà cung cấp</label>
          <input value={info.supplier} onChange={e => setInfo({...info, supplier: e.target.value})} className="w-full border p-2 rounded text-sm bg-slate-50/50 outline-none" placeholder="Nhập tên nhà cung cấp..." />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Kho hàng</label>
          <select value={info.warehouse} onChange={e => setInfo({...info, warehouse: e.target.value})} className="w-full border p-2 rounded text-sm bg-slate-50/50"><option>Main Kho hàng (W01)</option></select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Ghi chú</label>
          <input value={info.note} onChange={e => setInfo({...info, note: e.target.value})} className="w-full border p-2 rounded text-sm bg-slate-50/50 outline-none" placeholder="Ghi chú phiếu nhập..."/>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase">Số tham chiếu</label>
          <input value={info.ref} onChange={e => setInfo({...info, ref: e.target.value})} className="w-full border p-2 rounded text-sm font-bold bg-slate-50/50 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center font-bold text-sm">
          Danh sách sản phẩm
          <button onClick={() => setItems([...items, { id: Date.now(), sku: "", name: "", qty: 1, price: 0, expiry: "" }])} className="text-[#1E56A0]">+ Thêm sản phẩm</button>
        </div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-slate-50 border-b text-[11px] font-bold text-slate-400 uppercase">
            <tr><th className="px-6 py-4">SKU</th><th>Sản phẩm</th><th className="text-center">Số lượng</th><th className="text-center">Ngày hết hạn</th><th className="text-right">Giá</th><th className="text-center">Thao tác</th></tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-bold text-blue-600">{item.sku || "---"}</td>
                <td><input list="in-prods" value={item.name} onChange={e => handleItemChange(item.id, "name", e.target.value)} className="w-full font-bold outline-none bg-transparent" placeholder="Nhập tên..." /></td>
                <td><input type="number" value={item.qty} onChange={e => handleItemChange(item.id, "qty", e.target.value)} className="w-16 mx-auto block border rounded text-center py-1 font-bold" /></td>
                <td><input value={item.expiry} onChange={e => handleItemChange(item.id, "expiry", e.target.value)} className="w-full text-center text-slate-400 outline-none" placeholder="YYYY-MM-DD" /></td>
                <td className="text-right font-bold">{Number(item.price || 0).toLocaleString()} ₫</td>
                <td className="text-center">
                   <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="material-symbols-outlined text-[18px] text-slate-300 hover:text-red-500">delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <datalist id="in-prods">{productsMaster.map(p => <option key={p.sku} value={p.name} />)}</datalist>
        <div className="p-6 border-t bg-slate-50/30 flex justify-end items-center gap-6 font-black text-[#1E56A0]">
          <span>Tổng cộng:</span>
          <span className="text-xl">{grandTotal.toLocaleString()} ₫</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate("/in-out")} className="px-6 py-2 font-bold text-slate-400">Hủy</button>
        <button onClick={() => saveInbound("DRAFT")} className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-blue-600 bg-white hover:bg-slate-50 transition-all">Lưu nháp</button>
        <button onClick={() => saveInbound("COMPLETED")} className="px-8 py-2 bg-[#001B3E] text-white rounded-lg font-bold shadow-lg">Xác nhận nhập kho</button>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="bg-[#f0fff4] p-5 rounded-xl border border-green-100 flex gap-4">
              <span className="material-symbols-outlined text-green-500">verified_user</span>
              <div><h4 className="font-bold text-sm text-green-800 tracking-tighter">Kiểm tra tuân thủ</h4><p className="text-[11px] text-green-600 mt-1">Đảm bảo sản phẩm khớp số lượng trên chứng từ.</p></div>
          </div>
          <div className="bg-[#fffaf0] p-5 rounded-xl border border-orange-100 flex gap-4">
              <span className="material-symbols-outlined text-orange-500">warning</span>
              <div><h4 className="font-bold text-sm text-orange-800 tracking-tighter">Cảnh báo hết hạn</h4><p className="text-[11px] text-orange-600 mt-1">Đánh dấu các mặt hàng có hạn sử dụng dưới 6 tháng.</p></div>
          </div>
          <div className="bg-[#1E56A0] p-5 rounded-xl text-white">
              <h4 className="font-bold text-sm">Phân tích nhập kho</h4>
              <p className="text-[11px] opacity-80 mt-1 italic">Tối ưu hóa lịch trình nhận hàng trong tương lai.</p>
              <button className="mt-3 text-[11px] font-bold underline">Xem Báo cáo</button>
          </div>
      </div>
    </div>
  );
}
