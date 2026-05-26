import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ProfileBanner = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) return null;

  // Tách Tên từ full_name (giả định phần tử cuối là Tên, các phần tử trước là Họ/Chữ lót)
  const nameParts = user.full_name?.split(' ') || ['User'];
  const firstName = nameParts[nameParts.length - 1];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[#1E56A0] to-[#003E80] relative">
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-xl border-4 border-white shadow-md bg-white flex items-center justify-center text-4xl font-bold text-[#1E56A0]">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-md hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#003E80] text-[18px]">photo_camera</span>
            </button>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight font-manrope">{user.full_name}</h2>
            <p className="text-sm text-slate-500 font-medium">Vai trò: {user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'} • {user.username}</p>
          </div>
        </div>
      </div>
      <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mã nhân viên</p>
            <p className="text-sm font-bold text-slate-700">ID-{user.id}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email công việc</p>
            <p className="text-sm font-bold text-slate-700">{user.email || 'Chưa cập nhật'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trạng thái</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black ${
              user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {user.status || 'ACTIVE'}
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#003E80] text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-all active:scale-95">
          <span className="material-symbols-outlined text-[18px]">edit</span> Chỉnh sửa hồ sơ
        </button>
      </div>
    </section>
  );
};

export default ProfileBanner;