import React from 'react';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import ReportSummary from '../components/reports/ReportSummary';

const ReportsScreen = () => {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      {/* 1. Header & Filters */}
      <ReportFilters />

      {/* 2. Main Table Section */}
      <ReportTable />

      {/* 3. Bottom Stats & Trends */}
      <ReportSummary />
    </div>
  );
};

export default ReportsScreen;

