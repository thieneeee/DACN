import React from 'react';

const ActivityLog = () => {
  const activities = [
    { id: 1, title: 'Đã tạo phiếu nhập kho #1024', time: '2 giờ trước', note: 'Thêm 500 đơn vị SKU-889 vào kho Bắc.', icon: 'schedule', color: 'bg-[#003E80]' },
    { id: 2, title: 'Phê duyệt kiểm kê Khu A', time: 'Hôm qua, 16:45', icon: 'event', color: 'bg-slate-400' },
    { id: 3, title: 'Đã cập nhật mật khẩu', time: '3 ngày trước', icon: 'history', color: 'bg-slate-400' },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#003E80]">history</span>
          Hoạt động gần đây
        </h3>
        <button className="text-[#003E80] text-xs font-bold hover:underline">Tất cả</button>
      </div>
      
      <div className="relative space-y-8 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {activities.map((act) => (
          <div key={act.id} className="relative pl-8 group">
            <div className={`absolute left-0 top-1 w-4 h-4 ${act.color} rounded-full border-2 border-white z-10 shadow-sm`}></div>
            <div>
              <p className="text-sm font-bold text-slate-800">{act.title}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">{act.icon}</span>
                {act.time}
              </p>
              {act.note && (
                <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500 italic">
                  "{act.note}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-[#003E80] text-[20px]">info</span>
          <div>
            <p className="text-xs text-[#003E80] font-black uppercase">Mẹo cho quản lý</p>
            <p className="text-[11px] text-blue-900 leading-relaxed mt-1">
              Hoàn thành đánh giá tuân thủ hàng tháng trước thứ Sáu để duy trì quyền truy cập cấp A.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;