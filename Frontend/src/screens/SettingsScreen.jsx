import React from 'react';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import WarehouseCard from '../components/settings/WarehouseCard';
import SystemStats from '../components/settings/SystemStats';

const SettingsScreen = () => {
  const warehouseData = [
    { id: 'W-001', name: 'Kho Trung Tâm HCM', address: 'Lô 2, Đường số 5, KCN Tân Bình, TP. Hồ Chí Minh', manager: 'Nguyễn Văn An', status: 'Hoạt động', type: 'warehouse' },
    { id: 'W-002', name: 'Kho Hà Nội Chi Nhánh 1', address: '123 Trần Duy Hưng, Cầu Giấy, Hà Nội', manager: 'Trần Thị Bích', status: 'Hoạt động', type: 'store' },
    { id: 'W-003', name: 'Kho Phụ Tùng Đà Nẵng', address: 'Số 5 Điện Biên Phủ, Thanh Khê, Đà Nẵng', manager: 'Lê Hoàng Nam', status: 'Tạm dừng', type: 'factory' },
  ];

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
          <button className="bg-[#1E56A0] text-white px-5 py-2.5 rounded-lg flex items-center shadow-md hover:bg-blue-800 transition-all active:scale-95 group">
            <span className="material-symbols-outlined mr-2 text-[20px]">add</span>
            <span className="font-semibold text-sm">Thêm Kho Mới</span>
          </button>
        </div>

        {/* Warehouse Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {warehouseData.map((item) => (
            <WarehouseCard key={item.id} warehouse={item} />
          ))}
          
          {/* Placeholder thêm mới */}
          <div className="border-2 border-dashed border-slate-200 p-5 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#1E56A0] hover:text-[#1E56A0] transition-all cursor-pointer group min-h-[180px]">
            <span className="material-symbols-outlined text-[48px] mb-2 group-hover:scale-110 transition-transform">add_business</span>
            <p className="font-bold">Tạo kho lưu trữ mới</p>
            <p className="text-xs opacity-60">Thiết lập thông số và địa điểm</p>
          </div>
        </div>

        {/* Thống kê hệ thống */}
        <SystemStats />
      </section>
    </div>
  );
};

export default SettingsScreen;