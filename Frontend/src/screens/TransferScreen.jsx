import React, { useState } from 'react';
import TransferTable from '../components/transfers/TransferTable';
import TransferDetailPanel from '../components/transfers/TransferDetailPanel';
import { useNavigate } from 'react-router-dom';

const TransferScreen = () => {
  const navigate = useNavigate();

  const mockTransfers = [
    { 
      id: 'TRF-102', date: 'Oct 14, 09:45 AM', from: 'WH-Alpha', to: 'WH-Beta', 
      itemsCount: 42, status: 'In Transit', progress: 66, carrier: 'FastPath Logistics Inc.',
      driver: 'Robert Chen', plate: 'VN-92-X-4421',
      skus: [
        { name: 'Smartwatch Gen X', sku: 'SW-GX-001', qty: 20, img: 'https://via.placeholder.com/40' },
        { name: 'Wireless Audio H1', sku: 'WA-H1-BLK', qty: 12, img: 'https://via.placeholder.com/40' }
      ]
    },
    { 
      id: 'TRF-098', date: 'Oct 13, 02:20 PM', from: 'WH-Gamma', to: 'WH-Alpha', 
      itemsCount: 15, status: 'Pending', progress: 33, carrier: 'Internal Fleet',
      driver: 'Minh Tran', plate: 'VN-51-A-1234',
      skus: [
        { name: 'iPhone 15 Pro', sku: 'IP-15P-256', qty: 5, img: 'https://via.placeholder.com/40' }
      ]
    }
  ];

  const [selectedTransfer, setSelectedTransfer] = useState(mockTransfers[0]);

  return (
    <>
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800 font-headline-md">Quản lý Điều Chuyển</h2>
        <button 
          onClick={() => navigate('/transfers/create')} 
          className="bg-[#1E56A0] text-white px-4 py-2 rounded font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tạo đơn mới
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 flex gap-6 overflow-hidden">
        {/* Truyền function chọn hàng vào Table */}
        <TransferTable 
          data={mockTransfers} 
          onSelect={setSelectedTransfer} 
          activeId={selectedTransfer?.id} 
        />
        
        {/* Hiển thị chi tiết dựa trên state */}
        <TransferDetailPanel data={selectedTransfer} />
      </div>
    </>
  );
};

export default TransferScreen;