import React, { useState, useEffect } from 'react';
import TransferTable from '../components/transfers/TransferTable';
import TransferDetailPanel from '../components/transfers/TransferDetailPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransferScreen = () => {
  const navigate = useNavigate();

  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
      try {
          const res = await axios.get("http://localhost:5000/api/transfers");
          // Format lại data cho khớp với giao diện cũ
          const formattedData = res.data.map(t => ({
              id: t.transfer_code,
              db_id: t.id,
              date: new Date(t.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              from: t.from_warehouse_name || `Kho ${t.from_warehouse_id}`,
              to: t.to_warehouse_name || `Kho ${t.to_warehouse_id}`,
              itemsCount: t.total_items || 0,
              status: t.status === 'IN_TRANSIT' ? 'In Transit' : t.status === 'PENDING' ? 'Pending' : t.status === 'COMPLETED' ? 'Completed' : 'Cancelled',
              progress: t.status === 'IN_TRANSIT' ? 66 : t.status === 'PENDING' ? 33 : t.status === 'COMPLETED' ? 100 : 0,
              carrier: 'Internal Fleet',
              driver: t.creator_name || 'System User',
              plate: '---',
              skus: t.items?.map(i => ({
                  name: i.product_name,
                  sku: i.sku,
                  qty: i.quantity,
                  img: i.image_url ? (i.image_url.startsWith('http') ? i.image_url : `/${i.image_url}`) : 'https://placehold.co/40'
              })) || []
          }));
          setTransfers(formattedData);
          if (formattedData.length > 0) setSelectedTransfer(formattedData[0]);
      } catch (err) {
          console.error("Lỗi lấy danh sách điều chuyển", err);
      }
  };

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
          data={transfers} 
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