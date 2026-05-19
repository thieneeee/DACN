import React from 'react';

const ReportSummary = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Biểu đồ xu hướng (Mockup) */}
      <div className="md:col-span-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-slate-800">Biến động giá trị kho</h4>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E56A0]"></span> Nhập
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Xuất
            </span>
          </div>
        </div>
        
        {/* Thanh biểu đồ giả lập */}
        <div className="h-40 flex items-end justify-between px-4 gap-2">
          {[40, 70, 45, 90, 65, 80, 30, 50, 85].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1 items-center">
              <div 
                className={`w-full rounded-t-sm transition-all hover:brightness-110 ${i % 2 === 0 ? 'bg-[#1E56A0]' : 'bg-blue-200'}`} 
                style={{ height: `${val}%` }}
              ></div>
              <span className="text-[10px] text-slate-400 mt-1">T{i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Các thẻ tổng kết bên phải */}
      <div className="md:col-span-4 flex flex-col gap-4">
        {/* Tổng giá trị */}
        <div className="bg-[#1E56A0] text-white rounded-xl p-6 shadow-lg shadow-blue-100 relative overflow-hidden group">
          <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest">Tổng giá trị tồn kho</p>
          <h3 className="text-3xl font-black mt-2 font-manrope">$1.240.075</h3>
          <div className="mt-4 flex items-center gap-2 text-xs bg-white/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+4.2% so với tháng trước</span>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12 group-hover:rotate-0 transition-transform">account_balance_wallet</span>
        </div>

        {/* Cảnh báo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Sắp hết hàng</p>
            <p className="text-xl font-black text-slate-800">24 Sản phẩm</p>
          </div>
          <span className="material-symbols-outlined ml-auto text-slate-300">chevron_right</span>
        </div>
      </div>
    </section>
  );
};

export default ReportSummary;