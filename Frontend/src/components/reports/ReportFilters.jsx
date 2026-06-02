import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ReportFilters = ({ filters: externalFilters = {}, onFilterChange, data = [] }) => {
  const [filters, setFilters] = useState({
    reportType: 'inout',
    warehouse: 'all',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    ...externalFilters
  });

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilters(prevFilters => ({ ...prevFilters, ...externalFilters }));
  }, [externalFilters]);

  // Fetch warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/warehouses');
        if (response.ok) {
          const warehouseData = await response.json();
          setWarehouses(warehouseData);
        }
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };
    fetchWarehouses();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    try {
      // Prepare data for Excel
      const exportData = data.map(item => ({
        'SKU': item.sku,
        'Tên sản phẩm': item.name,
        'Tồn đầu': item.open_stock || item.opening_balance || 0,
        'Nhập': item.in || item.inbound || 0,
        'Xuất': item.out || item.outbound || 0,
        'Tồn cuối': item.end_stock || item.closing_balance || item.stock_count || 0,
        'Đơn giá': item.price || 0,
        'Tổng giá trị': item.total_value || 0
      }));

      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo');

      // Style columns
      worksheet['!cols'] = [
        { wch: 15 },
        { wch: 25 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 }
      ];

      // Generate filename with date
      const now = new Date();
      const filename = `BaoCao_${now.toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      alert('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  const handlePrint = () => {
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để in!');
      return;
    }

    try {
      const printWindow = window.open('', '', 'height=600,width=900');
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Báo cáo</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #1E56A0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #1E56A0; color: white; padding: 10px; text-align: left; }
            td { border: 1px solid #ddd; padding: 8px; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total-row { font-weight: bold; background-color: #f0f0f0; }
            .print-info { text-align: right; font-size: 12px; color: #666; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Báo cáo Xuất - Nhập - Tồn</h1>
          <div class="print-info">In lúc: ${new Date().toLocaleString('vi-VN')}</div>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th style="text-align: right;">Tồn đầu</th>
                <th style="text-align: right;">Nhập</th>
                <th style="text-align: right;">Xuất</th>
                <th style="text-align: right;">Tồn cuối</th>
                <th style="text-align: right;">Đơn giá</th>
                <th style="text-align: right;">Tổng giá trị</th>
              </tr>
            </thead>
            <tbody>
      `;

      let totalValue = 0;
      data.forEach(item => {
        const totalVal = item.total_value || 0;
        totalValue += totalVal;
        htmlContent += `
          <tr>
            <td>${item.sku}</td>
            <td>${item.name}</td>
            <td style="text-align: right;">${item.open_stock || 0}</td>
            <td style="text-align: right;">${item.in || 0}</td>
            <td style="text-align: right;">${item.out || 0}</td>
            <td style="text-align: right;">${item.end_stock || item.stock_count || 0}</td>
            <td style="text-align: right;">$${(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="text-align: right;">$${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right; font-weight: bold; font-size: 16px;">
            Tổng giá trị: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error printing:', error);
      alert('Lỗi khi in báo cáo!');
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-w-0 w-full">
          {/* Loại báo cáo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loại báo cáo</label>
            <select 
              name="reportType"
              value={filters.reportType}
              onChange={handleFilterChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
            >
              <option value="inout">Báo cáo Xuất - Nhập - Tồn</option>
              <option value="inventory-value">Giá trị tồn kho</option>
              <option value="low-stock">Cảnh báo hàng sắp hết</option>
            </select>
          </div>

          {/* Kho hàng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kho hàng</label>
            <select 
              name="warehouse"
              value={filters.warehouse}
              onChange={handleFilterChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
            >
              <option value="all">Tất cả kho hàng</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Khoảng thời gian */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Từ ngày - Đến ngày</label>
            <div className="flex gap-2 min-w-0">
              <input 
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
              />
              <input 
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E56A0] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2 w-full lg:w-auto lg:shrink-0">
          <button 
            onClick={handleExportExcel}
            className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 bg-[#107c41] hover:bg-[#0e6b38] text-white px-3 py-2 rounded-lg text-sm font-bold shadow-sm transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Xuất Excel
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            In
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportFilters;