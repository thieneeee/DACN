import React, { useEffect, useMemo, useState } from 'react';

const sortByValue = (items, order = 'desc') => {
  return [...items].sort((a, b) => {
    const valueA = Number(a.total_value ?? ((a.end_stock ?? a.stock_count ?? 0) * (a.price ?? 0)) ?? 0);
    const valueB = Number(b.total_value ?? ((b.end_stock ?? b.stock_count ?? 0) * (b.price ?? 0)) ?? 0);

    return order === 'asc' ? valueA - valueB : valueB - valueA;
  });
};

const ReportTable = ({ filters = {}, onDataChange, onSortChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { reportType = 'inout', startDate, endDate, sortOrder = 'desc' } = filters;

  const sortedData = useMemo(() => sortByValue(data, sortOrder), [data, sortOrder]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(sortedData);
    }
  }, [sortedData, onDataChange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [reportType, startDate, endDate, sortOrder]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = 'http://localhost:5000/api/reports/inout-stock';

        if (reportType === 'inventory-value') {
          url = 'http://localhost:5000/api/reports/inventory-value';
        } else if (reportType === 'low-stock') {
          url = 'http://localhost:5000/api/reports/low-stock';
        }

        const params = new URLSearchParams();

        if (reportType === 'inout') {
          if (startDate) params.append('startDate', startDate);
          if (endDate) params.append('endDate', endDate);
        }

        const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const reportData = await response.json();
        setData(reportData);

        if (onDataChange) {
          onDataChange(reportData);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching report data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, startDate, endDate, onDataChange]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = sortedData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const title =
    reportType === 'inventory-value'
      ? 'Giá trị tồn kho theo sản phẩm'
      : reportType === 'low-stock'
        ? 'Danh sách sản phẩm sắp hết'
        : 'Chi tiết Xuất - Nhập - Tồn';

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 uppercase tracking-tighter">{title}</h3>
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Thứ tự giá trị</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Hiển thị {displayData.length} trên {sortedData.length} mục
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E56A0]"></div>
              <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : sortedData.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">info</span>
            Không có dữ liệu báo cáo
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Tên sản phẩm</th>
                {reportType === 'inout' && (
                  <>
                    <th className="py-3 px-4 text-right">Tồn đầu</th>
                    <th className="py-3 px-4 text-right">Nhập</th>
                    <th className="py-3 px-4 text-right">Xuất</th>
                    <th className="py-3 px-4 text-right">Tồn cuối</th>
                  </>
                )}
                {reportType === 'inventory-value' && (
                  <>
                    <th className="py-3 px-4 text-right">Tồn kho</th>
                    <th className="py-3 px-4 text-right">Đơn giá</th>
                    <th className="py-3 px-4">Danh mục</th>
                  </>
                )}
                {reportType === 'low-stock' && (
                  <>
                    <th className="py-3 px-4 text-right">Tồn kho</th>
                    <th className="py-3 px-4 text-right">Mức tối thiểu</th>
                    <th className="py-3 px-4 text-right">% Còn lại</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Tổng giá trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayData.map((item, idx) => {
                const totalValue = item.total_value ?? ((item.end_stock || item.stock_count || 0) * (item.price || 0));

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{item.sku}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                    {reportType === 'inout' && (
                      <>
                        <td className="py-3 px-4 text-right">{item.open_stock || 0}</td>
                        <td className="py-3 px-4 text-right text-green-600 font-bold">+{item.in || 0}</td>
                        <td className="py-3 px-4 text-right text-red-600 font-bold">-{item.out || 0}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{item.end_stock || item.stock_count || 0}</td>
                      </>
                    )}
                    {reportType === 'inventory-value' && (
                      <>
                        <td className="py-3 px-4 text-right">{item.stock_count || 0}</td>
                        <td className="py-3 px-4 text-right">${(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-slate-600">{item.category_name || '-'}</td>
                      </>
                    )}
                    {reportType === 'low-stock' && (
                      <>
                        <td className="py-3 px-4 text-right font-bold text-red-600">{item.stock_count || 0}</td>
                        <td className="py-3 px-4 text-right">{item.min_stock_level || 0}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${Number(item.stock_percentage || 0) > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {item.stock_percentage || 0}%
                          </span>
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 text-right font-bold text-[#1E56A0]">
                      ${Number(totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            Trước
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default ReportTable;
