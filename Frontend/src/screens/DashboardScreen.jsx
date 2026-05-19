import React, { useState, useEffect } from 'react';

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0,
    inboundTotal: 0,
    outboundTotal: 0,
  });
  const [products, setProducts] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, productsRes, expiringRes, activitiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard/stats'),
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/dashboard/low-stock'),
          fetch('http://localhost:5000/api/dashboard/recent-activities')
        ]);

        if (!statsRes.ok || !productsRes.ok || !expiringRes.ok || !activitiesRes.ok) {
          throw new Error('Lỗi khi fetch dữ liệu từ server');
        }

        const statsData = await statsRes.json();
        const productsData = await productsRes.json();
        const expiringData = await expiringRes.json();
        const activitiesData = await activitiesRes.json();

        // Tính tổng in/out từ activities (tuỳ chọn thêm để fill KPI, hoặc dùng stats API)
        const inboundTotal = activitiesData.filter(a => a.type === 'IN').reduce((acc, curr) => acc + curr.quantity, 0);
        const outboundTotal = Math.abs(activitiesData.filter(a => a.type === 'OUT').reduce((acc, curr) => acc + curr.quantity, 0));

        setStats({ ...statsData, inboundTotal, outboundTotal });
        
        // Lấy top 10 products
        const topStocked = [...productsData].sort((a, b) => b.stock_count - a.stock_count).slice(0, 10);
        setProducts(topStocked);
        
        setExpiringItems(expiringData);
        setActivities(activitiesData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-[#1E56A0] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* 1. KPI Row: Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tổng Sản Phẩm</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalProducts} <span className="text-xs font-normal text-slate-400">loại</span></h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#1E56A0] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined">inventory</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Giá Trị Tồn Kho</p>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</h3>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tổng Số Lượng Nhập</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900">+{stats.inboundTotal}</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">Sản phẩm</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined">vertical_align_bottom</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tổng Số Lượng Xuất</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900">-{stats.outboundTotal}</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full">Sản phẩm</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined">vertical_align_top</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Biểu đồ và Hàng sắp hết hạn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Lưu lượng Nhập/Xuất</h4>
              <p className="text-xs text-slate-500">Hoạt động kho trong 7 ngày qua</p>
            </div>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-md py-1 px-2 focus:ring-[#1E56A0] outline-none">
              <option>7 Ngày qua</option>
              <option>30 Ngày qua</option>
            </select>
          </div>
          <div className="flex-1 min-h-[220px] relative flex items-end justify-between gap-2 pt-4">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-1 w-full h-full justify-end group">
                <div className="w-full flex justify-center gap-1 items-end h-[60%]">
                  <div className={`w-4 bg-emerald-400 rounded-t opacity-80`} style={{ height: `${Math.floor(Math.random() * 60) + 20}%`}}></div>
                  <div className={`w-4 bg-red-400 rounded-t opacity-80`} style={{ height: `${Math.floor(Math.random() * 40) + 10}%`}}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{day}</span>
              </div>
            ))}
            <div className="absolute inset-0 pt-16 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q15,40 30,50 T60,20 T100,60" fill="none" stroke="#1E56A0" strokeWidth="1" opacity="0.3"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white p-5 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900">Sắp Hết Hạn / Tồn Kho Thấp</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">{expiringItems.length} Sản phẩm</span>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[260px] flex-1 pr-1 custom-scrollbar">
            {expiringItems.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Không có dữ liệu</p>
            ) : (
              expiringItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                  <div className="w-10 h-10 bg-slate-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500">Mã: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-red-600">
                      Tồn: {item.stock_count} (Cảnh báo: {item.min_stock_level})
                    </p>
                    {item.expiry_date && (
                      <p className="text-[10px] font-bold text-orange-600 mt-1">HSD: {formatDate(item.expiry_date)}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="mt-4 w-full py-2 bg-slate-50 text-[#1E56A0] text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors">Xem Tất Cả Cảnh Báo</button>
        </div>
      </div>

      {/* 3. Bottom Row: Bảng tồn kho và Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stocked Table */}
        <div className="bg-white p-5 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-900">Top 10 Tồn Kho Nhiều Nhất</h4>
            <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer">more_horiz</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider rounded-l-lg">Tên Sản Phẩm</th>
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Danh Mục</th>
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right rounded-r-lg">Số Lượng Tồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-sm text-slate-500 italic">Không có dữ liệu</td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-slate-500">{item.category_name || 'Không rõ'}</td>
                      <td className="py-2 px-3 text-xs font-bold text-slate-800 text-right">{item.stock_count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-5 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-900">Hoạt Động Gần Đây</h4>
            <button className="text-[10px] font-bold text-[#1E56A0] hover:underline">Xem Lịch Sử</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[200px] flex-1 pr-1 custom-scrollbar">
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Không có dữ liệu</p>
            ) : (
              activities.map((act) => {
                let badgeColor = 'bg-blue-500';
                let activityText = 'Điều chỉnh';
                if (act.type === 'IN') {
                  badgeColor = 'bg-green-500';
                  activityText = 'Nhập kho';
                } else if (act.type === 'OUT') {
                  badgeColor = 'bg-red-500';
                  activityText = 'Xuất kho';
                }

                return (
                  <div key={act.id} className="flex items-start gap-3 relative pl-4 border-l-2 border-slate-100">
                    <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${badgeColor}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`text-xs font-bold text-slate-800`}>{activityText}</p>
                        <span className="text-[10px] text-slate-400">{formatDate(act.created_at)} {formatTime(act.created_at)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Sản phẩm: <span className="font-bold">{act.product_name || act.sku}</span> <br/>
                        Số lượng: <span className="font-bold">{act.quantity > 0 ? `+${act.quantity}` : act.quantity}</span>
                      </p>
                      {act.note && <p className="text-[10px] text-slate-400 mt-0.5 whitespace-pre-wrap">Ghi chú: {act.note}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-[#1E56A0] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>
    </>
  );
};

export default DashboardScreen;