import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const AccountSettings = () => {
  const { user, login } = useContext(AuthContext);

  // Tách Tên từ full_name (giả định phần tử cuối là Tên, các phần tử trước là Họ/Chữ lót)
  const nameParts = user?.full_name?.split(' ') || [''];
  const initialFirstName = nameParts[nameParts.length - 1] || '';
  const initialLastName = nameParts.slice(0, nameParts.length - 1).join(' ') || '';

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Cập nhật lại form data khi user thay đổi
  useEffect(() => {
    if (user) {
      const parts = user.full_name?.split(' ') || [''];
      setFormData({
        firstName: parts[parts.length - 1] || '',
        lastName: parts.slice(0, parts.length - 1).join(' ') || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');
    setErrorMsg('');

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const fullName = `${formData.lastName} ${formData.firstName}`.trim();
      await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        full_name: fullName,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      setMessage('Cập nhật thông tin thành công!');
      login({ ...user, full_name: fullName }); // Update lại context / local storage
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">{message}</div>}
      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">{errorMsg}</div>}

      {/* 1. Thông tin tài khoản */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 font-manrope">
          <span className="material-symbols-outlined text-[#1E56A0]">person</span>
          Thông tin tài khoản
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Họ và chữ lót</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tên</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
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
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Nhập vào để xác nhận nếu bạn muốn đổi mật khẩu"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all bg-slate-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mật khẩu mới</label>
              <input 
                type="password" 
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Xác nhận mật khẩu mới</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nút Save */}
      <div className="mt-10 flex justify-end">
        <button 
          onClick={handleSubmit}
          className="px-8 py-2.5 bg-[#1E56A0] text-white rounded-lg text-sm font-black hover:bg-blue-800 transition-all shadow-md active:scale-95"
        >
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;