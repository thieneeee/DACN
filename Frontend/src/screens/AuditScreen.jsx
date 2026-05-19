import React from 'react';
import AuditScanner from '../components/audit/AuditScanner';
import AuditTable from '../components/audit/AuditTable';
import AuditFooter from '../components/audit/AuditFooter';

const AuditScreen = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FE] animate-in fade-in duration-500 pb-32">
      {/* Header Info (Breadcrumb style) */}
      <div className="px-8 pt-6 flex items-center text-slate-500 text-sm mb-4">
        <span className="material-symbols-outlined text-sm mr-1">location_on</span>
        <span>Kho A1 - Tầng Trệt</span>
        <span className="mx-2">/</span>
        <span className="font-bold text-[#1E56A0]">Phiên Kiểm Kê</span>
      </div>

      <main className="px-8">
        {/* Section 1: Scanner & Bento Stats */}
        <AuditScanner />

        {/* Section 2: Table List */}
        <AuditTable />
      </main>

      {/* Section 3: Sticky Footer */}
      <AuditFooter />
    </div>
  );
};

export default AuditScreen;
