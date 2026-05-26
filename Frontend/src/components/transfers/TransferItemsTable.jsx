import React from 'react';

const TransferItemsTable = ({ formData, setFormData, products }) => {
  const { items } = formData;

  const handleAddItem = (productId) => {
    if (!productId) return;
    const selectedProduct = products.find(p => p.id == productId);
    if (!selectedProduct) return;
    
    // Check if already exists
    if (items.find(i => i.product_id == productId)) return;

    setFormData({
      ...formData,
      items: [
        ...items,
        {
          product_id: selectedProduct.id,
          sku: selectedProduct.sku,
          name: selectedProduct.name,
          category: selectedProduct.category_name,
          available: selectedProduct.stock_count,
          quantity: 1
        }
      ]
    });
  };

  const handleRemoveItem = (productId) => {
    setFormData({
      ...formData,
      items: items.filter(i => i.product_id != productId)
    });
  };

  const handleChangeQty = (productId, qty) => {
    setFormData({
      ...formData,
      items: items.map(i => i.product_id == productId ? { ...i, quantity: parseInt(qty) || 0 } : i)
    });
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Sản phẩm điều chuyển</h3>
        <div className="flex gap-2">
          <select 
            id="productSelect"
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#1E56A0] outline-none w-48"
            onChange={(e) => {
              handleAddItem(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
            ))}
          </select>
        </div>
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
              <tr key={item.product_id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.sku}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-medium">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold">
                    {item.available?.toLocaleString() || 0} Units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    min="1"
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-1 focus:ring-[#1E56A0] outline-none"
                    value={item.quantity}
                    onChange={(e) => handleChangeQty(item.product_id, e.target.value)}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                  Chưa có sản phẩm nào. Hãy chọn từ danh sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-12 text-sm">
        <span className="text-slate-500">Số loại (SKU): <strong className="text-slate-900">{items.length}</strong></span>
        <span className="text-slate-500">Tổng số lượng: <strong className="text-slate-900">
          {items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}
        </strong></span>
      </div>
    </section>
  );
};

export default TransferItemsTable;