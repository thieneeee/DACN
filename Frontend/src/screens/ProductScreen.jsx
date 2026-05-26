import React, { useState, useEffect } from "react";
import MasterLayout from '../components/layout/MasterLayout';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sku: '', name: '', category_id: 1, supplier_id: 1, 
    price: 0, stock_count: 0, min_stock_level: 10, image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Loi khi tai du lieu san pham");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // --- CRUD ACTIONS ---
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        sku: product.sku, name: product.name, category_id: product.category_id, 
        supplier_id: product.supplier_id, price: product.price, 
        stock_count: product.stock_count, min_stock_level: product.min_stock_level,
        image_url: product.image_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        sku: '', name: '', category_id: 1, supplier_id: 1, 
        price: '', stock_count: 0, min_stock_level: 10, image_url: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}`
        : `http://localhost:5000/api/products`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Lỗi khi lưu sản phẩm");
      
      alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
      handleCloseModal();
      fetchProducts(); // Tải lại danh sách
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm (Có thể do đang dính khóa ngoại giao dịch)");
      alert("Xóa thành công!");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 min-h-screen bg-[#F4F7FE]">
      <section className="mb-6 bg-white p-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Danh sách Sản phẩm</h2>
        
        <div className="flex-1 max-w-md mx-4 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm theo tên, SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Sản phẩm
        </button>
      </section>

      {loading && <p>Dang tai du lieu tu Database...</p>}
      {error && <p className="text-red-500">Loi: {error}</p>}

      {!loading && !error && (
        <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Hình ảnh</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">SKU</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Tên Sản Phẩm</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">Danh Mục</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">Giá Nhập</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Tồn Kho</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Trạng Thái</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-slate-500">Không có sản phẩm nào</td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <img 
                          src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/${item.image_url}`) : 'https://placehold.co/100x100?text=No+Img'} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded-md border border-slate-200 bg-slate-100" 
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = 'https://placehold.co/100x100?text=No+Img';
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.sku}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{item.category_name || "Chưa phân loại"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right font-medium">{formatVND(item.price)}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-semibold">
                          {item.stock_count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.stock_count < item.min_stock_level ? (
                           <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">Sắp Hết</span>
                        ) : (
                           <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Còn Hàng</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* --- FORM MODAL THÊM / SỬA --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mã SKU *</label>
                  <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên sản phẩm *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">ID Danh mục (1-4)</label>
                  <input required type="number" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">ID Nhà CC (1-3)</label>
                  <input required type="number" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá nhập (VNĐ) *</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link Ảnh (URL) Online</label>
                  <input type="text" placeholder="https://..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng hiện tại</label>
                  <input required type="number" disabled={!!editingId} value={formData.stock_count} onChange={e => setFormData({...formData, stock_count: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 bg-slate-100" />
                  {editingId && <span className="text-xs text-slate-400">Không thể sửa tồn kho ở đây.</span>}
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mức cảnh báo (Tồn Min)</label>
                  <input required type="number" value={formData.min_stock_level} onChange={e => setFormData({...formData, min_stock_level: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2" />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200">Hủy</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
