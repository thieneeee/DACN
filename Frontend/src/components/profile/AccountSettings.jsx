import React, { useState } from 'react';

const AccountSettings = () => {
  // State quản lý thông tin cơ bản
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Sterling',
    phone: '+1 (555) 234-8891'
  });

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      {/* 1. Thông tin tài khoản */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 font-manrope">
          <span className="material-symbols-outlined text-[#1E56A0]">person</span>
          Thông tin tài khoản
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Họ</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số điện thoại</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-100 mb-10" />

      {/* 2. Bảo mật - Mật khẩu */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 font-manrope">
          <span className="material-symbols-outlined text-[#1E56A0]">lock</span>
          Bảo mật
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mật khẩu hiện tại</label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all bg-slate-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mật khẩu mới</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nút Save */}
      <div className="mt-10 flex justify-end">
        <button 
          onClick={() => alert('Đã lưu thay đổi!')}
          className="px-8 py-2.5 bg-[#1E56A0] text-white rounded-lg text-sm font-black hover:bg-blue-800 transition-all shadow-md active:scale-95"
        >
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;