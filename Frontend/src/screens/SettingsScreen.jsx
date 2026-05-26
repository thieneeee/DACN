import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import WarehouseCard from '../components/settings/WarehouseCard';
import SystemStats from '../components/settings/SystemStats';

const SettingsScreen = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ code: '', name: '', location: '' });

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/warehouses');
      setWarehouseData(response.data);
    } catch (error) {
      console.error('Lỗi tải danh sách kho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/warehouses', newWarehouse);
      setShowAddModal(false);
      setNewWarehouse({ code: '', name: '', location: '' });
      fetchWarehouses();
    } catch (error) {
      console.error('Lỗi thêm kho:', error);
      alert('Đã có lỗi xảy ra!');
    }
  };

  return (
    <div className="flex gap-6 h-full max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
      {/* Cột trái: Danh mục cài đặt */}
      <SettingsSidebar />

      {/* Cột phải: Nội dung chính */}
      <section className="flex-1 flex flex-col gap-6">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-manrope">Danh sách Kho</h2>
            <p className="text-slate-500 text-sm">Quản lý các địa điểm lưu kho và phân phối trong toàn hệ thống.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#1E56A0] text-white px-5 py-2.5 rounded-lg flex items-center shadow-md hover:bg-blue-800 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            <span className="font-semibold text-sm">Thêm Kho Mới</span>
          </button>
        </div>

        {/* Warehouse Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            warehouseData.map((item) => (
              <WarehouseCard key={item.id} warehouse={item} />
            ))
          )}
          
          {/* Placeholder thêm mới */}
          <div 
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-slate-200 p-5 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#1E56A0] hover:text-[#1E56A0] transition-all cursor-pointer group min-h-[180px]"
          >
            <span className="material-symbols-outlined text-[48px] mb-2 group-hover:scale-110 transition-transform">add_business</span>
            <p className="font-bold">Tạo kho lưu trữ mới</p>
            <p className="text-xs opacity-60">Thiết lập thông số và địa điểm</p>
          </div>
        </div>

        {/* Thống kê hệ thống */}
        <SystemStats />
      </section>

      {/* Modal Thêm Kho */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800">Thêm Kho Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500">
                <span className="material-symbols-outlined hover:rotate-90 transition-transform">close</span>
              </button>
            </div>
            <form onSubmit={handleAddWarehouse} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã kho</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#1E56A0]"
                  placeholder="Vd: WH-001"
                  value={newWarehouse.code}
                  onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên kho</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#1E56A0]"
                  placeholder="Vd: Kho Trung Tâm"
                  value={newWarehouse.name}
                  onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Địa chỉ</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#1E56A0]"
                  placeholder="Vd: 123 Lê Lợi, Q1..."
                  value={newWarehouse.location}
                  onChange={(e) => setNewWarehouse({...newWarehouse, location: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 font-medium text-white bg-[#1E56A0] hover:bg-blue-800 rounded-lg"
                >
                  Lưu Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;