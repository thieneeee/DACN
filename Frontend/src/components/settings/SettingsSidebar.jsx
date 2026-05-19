import React from 'react';

const SettingsSidebar = () => {
  // Danh sách các mục menu để render cho sạch code
  const menuItems = [
    { id: 'general', label: 'Tổng quan', icon: 'settings_suggest', active: false },
    { id: 'warehouse', label: 'Kho & Khu vực', icon: 'domain', active: true },
    { id: 'roles', label: 'Phân quyền', icon: 'group', active: false },
    { id: 'notifications', label: 'Thông báo', icon: 'notifications_active', active: false },
    { id: 'logs', label: 'Nhật ký hệ thống', icon: 'history_edu', active: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col gap-3">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        {/* Tiêu đề nhóm menu */}
        <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-inter">
            Cấu hình hệ thống
          </h3>
        </div>

        {/* Danh sách điều hướng */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                item.active 
                  ? 'bg-blue-50 text-[#1E56A0]' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[20px] mr-3 transition-colors ${
                  item.active ? 'text-[#1E56A0]' : 'text-slate-400 group-hover:text-blue-600'
                }`}
              >
                {item.icon}
              </span>
              <span className={`text-sm ${item.active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Có thể thêm một widget phụ ở đây nếu muốn */}
      <div className="p-4 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200">
        <p className="text-xs opacity-80 mb-2">Trợ giúp thiết lập?</p>
        <button className="text-[11px] font-bold bg-white/20 hover:bg-white/30 py-1 px-3 rounded-lg transition-colors">
          Xem tài liệu hướng dẫn
        </button>
      </div>
    </aside>
  );
};

export default SettingsSidebar;