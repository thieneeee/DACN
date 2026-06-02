import React, { useState, useCallback } from 'react';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import ReportSummary from '../components/reports/ReportSummary';

const ReportsScreen = () => {
  const [filters, setFilters] = useState({
    reportType: 'inout',
    warehouse: 'all',
    sortOrder: 'desc',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [tableData, setTableData] = useState([]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleTableDataChange = useCallback((data) => {
    setTableData(data);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      {/* 1. Header & Filters */}
      <ReportFilters filters={filters} onFilterChange={handleFilterChange} data={tableData} />

      {/* 2. Main Table Section */}
      <ReportTable 
        filters={filters} 
        onDataChange={handleTableDataChange}
        onSortChange={(value) => handleFilterChange({ ...filters, sortOrder: value })}
      />

      {/* 3. Bottom Stats & Trends */}
      <ReportSummary reportType={filters.reportType} />
    </div>
  );
};

export default ReportsScreen;

