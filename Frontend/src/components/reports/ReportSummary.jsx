import React, { useState, useEffect } from 'react';

const ReportSummary = ({ reportType = 'inout' }) => {
  const [summary, setSummary] = useState({
    totalInventoryValue: 0,
    lowStockCount: 0,
    percentageChange: 0
  });

  const [trends, setTrends] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch summary stats
        const summaryResponse = await fetch('http://localhost:5000/api/reports/summary');
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          setSummary(summaryData);
        }

        // Fetch inventory trends
        const trendsResponse = await fetch('http://localhost:5000/api/reports/inventory-trends');
        if (trendsResponse.ok) {
          const trendsData = await trendsResponse.json();
          setTrends(trendsData);
        }

        // Fetch low stock items
        const lowStockResponse = await fetch('http://localhost:5000/api/reports/low-stock');
        if (lowStockResponse.ok) {
          const lowStockData = await lowStockResponse.json();
          setLowStockItems(lowStockData);
        }
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchSummaryData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [reportType]);

  // Normalize trends data for display (last 9 months)
  const displayTrends = trends.slice(-9).map(trend => ({
    month: trend.month,
    in: trend.IN || 0,
    out: trend.OUT || 0
  }));

  // Calculate max value for scaling chart bars
  const maxValue = Math.max(
    ...displayTrends.flatMap(t => [t.in, t.out]),
    1
  );

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Biểu đồ xu hướng */}
      <div className="md:col-span-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-slate-800">Biến động giá trị kho (12 tháng gần nhất)</h4>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E56A0]"></span> Nhập
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Xuất
            </span>
          </div>
        </div>
        
        {/* Thanh biểu đồ */}
        {displayTrends.length > 0 ? (
          <div className="h-40 flex items-end justify-between px-4 gap-2">
            {displayTrends.map((trend, i) => {
              const inPercentage = (trend.in / maxValue) * 100;
              const outPercentage = (trend.out / maxValue) * 100;
              const monthName = new Date(trend.month + '-01').toLocaleDateString('vi-VN', { month: 'short' });
              
              return (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-full flex gap-0.5 h-32 items-end">
                    <div 
                      className={`flex-1 rounded-t-sm transition-all hover:brightness-110 bg-[#1E56A0]`} 
                      style={{ height: `${Math.max(inPercentage, 5)}%` }}
                      title={`Nhập: $${trend.in.toLocaleString()}`}
                    ></div>
                    <div 
                      className={`flex-1 rounded-t-sm transition-all hover:brightness-110 bg-red-400`} 
                      style={{ height: `${Math.max(outPercentage, 5)}%` }}
                      title={`Xuất: $${trend.out.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{monthName}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400">
            Không có dữ liệu xu hướng
          </div>
        )}
      </div>

      {/* Các thẻ tổng kết bên phải */}
      <div className="md:col-span-4 flex flex-col gap-4">
        {/* Tổng giá trị */}
        <div className="bg-[#1E56A0] text-white rounded-xl p-6 shadow-lg shadow-blue-100 relative overflow-hidden group">
          <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest">Tổng giá trị tồn kho</p>
          <h3 className="text-3xl font-black mt-2 font-manrope">
            ${summary.totalInventoryValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs bg-white/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-sm">
              {summary.percentageChange >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span>
              {summary.percentageChange >= 0 ? '+' : ''}{summary.percentageChange}% so với tháng trước
            </span>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12 group-hover:rotate-0 transition-transform">
            account_balance_wallet
          </span>
        </div>

        {/* Cảnh báo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Sắp hết hàng</p>
            <p className="text-xl font-black text-slate-800">{summary.lowStockCount} Sản phẩm</p>
          </div>
          <span className="material-symbols-outlined ml-auto text-slate-300 flex-shrink-0">chevron_right</span>
        </div>

        {/* Danh sách sản phẩm sắp hết */}
        {lowStockItems.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Sản phẩm sắp hết hàng</h4>
            </div>
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {lowStockItems.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <span className="text-xs font-bold text-red-600 flex-shrink-0">{item.stock_percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.stock_percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(item.stock_percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500">{item.stock_count}/{item.min_stock_level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportSummary;