import React from 'react';

const ProfileBanner = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[#1E56A0] to-[#003E80] relative">
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative">
            <img 
              className="w-32 h-32 rounded-xl border-4 border-white shadow-md object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIK9bYTItvHinhkn2eGfCLZKJ5A8jJ3N3oPvq4tAYTRkBGiZ6n6ENu8BZz5v0_5wsPqIR2cjCsRuYM-RMM_cLkkD_gsSmZenhX_FuxaFneY973ig6q8Yh7uwY0_5eeofCJPiSAfldbiGE2NXBCGlkgGfcCansv0PZFC434SbDjSCeeS0e7OUPGnyhapMxFcJe8UJh__GRHKMZwcBO3NR7PrF431Sh5lHjXukRK_22hUEEoYCwMClJzHfgbvbVM-mPd_eCmT-LWQeJG" 
              alt="Alex Chen"
            />
            <button className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-md hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#003E80] text-[18px]">photo_camera</span>
            </button>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight font-manrope">Alex Chen</h2>
            <p className="text-sm text-slate-500 font-medium">Manager A-12 • Global Operations</p>
          </div>
        </div>
      </div>
      <div className="pt-16 pb-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mã nhân viên</p>
            <p className="text-sm font-bold text-slate-700">ID-9921</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email công việc</p>
            <p className="text-sm font-bold text-slate-700">alex.chen@enterprise.os</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trạng thái</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-black">ACTIVE</span>
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