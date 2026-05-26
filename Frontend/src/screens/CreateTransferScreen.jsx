import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransferFormHeader from '../components/transfers/TransferFormHeader';
import TransferItemsTable from '../components/transfers/TransferItemsTable';

const CreateTransferScreen = () => {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    from_warehouse_id: '',
    to_warehouse_id: '',
    transfer_date: new Date().toISOString().slice(0, 10),
    items: []
  });

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách kho", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách sản phẩm", err);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.from_warehouse_id || !formData.to_warehouse_id) {
      alert("Vui lòng chọn kho đi và kho đến.");
      return;
    }
    if (formData.from_warehouse_id === formData.to_warehouse_id) {
      alert("Kho đi và kho đến không được trùng nhau.");
      return;
    }
    if (formData.items.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    setLoading(true);
    try {
      // Create transfer payload
      const payload = {
        transfer_code: "TRF-" + Date.now().toString().slice(-6),
        from_warehouse_id: formData.from_warehouse_id,
        to_warehouse_id: formData.to_warehouse_id,
        created_by: 1, // hardcode for now, should come from auth
        status: isDraft ? 'PENDING' : 'IN_TRANSIT',
        notes: "Điều chuyển ngày: " + formData.transfer_date,
        items: formData.items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity
        }))
      };

      await axios.post("http://localhost:5000/api/transfers", payload);
      alert(isDraft ? "Đã lưu bản nháp thành công!" : "Tạo phiếu điều chuyển thành công!");
      navigate('/transfers');
    } catch (err) {
      console.error("Lỗi tạo đơn điều chuyển", err);
      alert("Có lỗi xảy ra khi tạo đơn điều chuyển.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Nút quay lại */}
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => navigate('/transfers')}
          className="flex items-center text-slate-500 hover:text-[#1E56A0] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm font-medium">Quay lại danh sách</span>
        </button>
      </div>

      <TransferFormHeader formData={formData} setFormData={setFormData} warehouses={warehouses} />

      <TransferItemsTable formData={formData} setFormData={setFormData} products={products} />

      {/* Bottom Thao tács Section */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-slate-500 italic text-[13px]">
          <span className="material-symbols-outlined text-sm">info</span>
          Mã điều chuyển sẽ được hệ thống tạo tự động.
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-2.5 bg-white border border-slate-300 text-[#1E56A0] font-semibold rounded-lg hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Lưu bản nháp
          </button>
          <button 
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-8 py-2.5 bg-[#1E56A0] text-white font-semibold rounded-lg hover:bg-[#16427d] transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Bắt đầu điều chuyển'}
          </button>
        </div>
      </div>

      {/* Contextual Helper (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-blue-700">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Thời gian vận chuyển dự kiến</h4>
            <p className="text-[13px] text-blue-800/70">Vận chuyển nội bộ giữa các kho khu vực thường mất từ 2-4 ngày làm việc.</p>
          </div>
        </div>
        <div className="bg-slate-100/50 p-6 rounded-xl border border-slate-200 flex gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 text-slate-600">
            <span className="material-symbols-outlined">inventory</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Giữ chỗ tồn kho</h4>
            <p className="text-[13px] text-slate-600">Lưu bản nháp không giữ chỗ hàng trong kho. Hàng chỉ được xuất đi khi lệnh điều chuyển được xác nhận.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransferScreen;