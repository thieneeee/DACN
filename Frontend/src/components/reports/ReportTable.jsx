import React from 'react';

const ReportTable = () => {
  const data = [
    { sku: 'APP-IP14-BLK', name: 'iPhone 14 Pro Max 256GB', open: 45, in: 120, out: 85, end: 80, price: 1099 },
    { sku: 'SAM-S23-ULT', name: 'Samsung Galaxy S23 Ultra', open: 30, in: 50, out: 40, end: 40, price: 1199 },
    { sku: 'LOG-MXM-3S', name: 'Logitech MX Master 3S', open: 200, in: 300, out: 450, end: 50, price: 99 },
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 uppercase tracking-tighter">Chi tiết Xuất - Nhập - Tồn</h3>
        <span className="text-[11px] text-slate-400 font-medium">Hiển thị {data.length} trên 150 mục</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-3 px-4 text-right">Tồn đầu</th>
              <th className="py-3 px-4 text-right">Nhập</th>
              <th className="py-3 px-4 text-right">Xuất</th>
              <th className="py-3 px-4 text-right">Tồn cuối</th>
              <th className="py-3 px-4 text-right">Tổng giá trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-slate-500">{item.sku}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                <td className="py-3 px-4 text-right">{item.open}</td>
                <td className="py-3 px-4 text-right text-green-600 font-bold">+{item.in}</td>
                <td className="py-3 px-4 text-right text-red-600 font-bold">-{item.out}</td>
                <td className="py-3 px-4 text-right font-black text-slate-900">{item.end}</td>
                <td className="py-3 px-4 text-right font-bold text-[#1E56A0]">
                  ${(item.end * item.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReportTable;