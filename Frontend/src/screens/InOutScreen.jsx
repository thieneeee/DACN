import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function InOutScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("in");
  const [localData, setLocalData] = useState([]);
  const [search, setSearch] = useState("");
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState(today);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions");
      const dbTrans = response.data;
      
      // Nhóm giao dịch theo reference để gộp vào "phiếu" 
      const groupedData = dbTrans.reduce((acc, curr) => {
        const ref = curr.reference || `REF-${curr.id}`;
        if (!acc[ref]) {
          acc[ref] = {
            id: ref,
            date: new Date(curr.created_at).toISOString().split('T')[0],
            creator: 'Admin', // Chưa join với users nên mock là Admin
            avatar: 'A',
            items: 0,
            total: 0,
            status: "COMPLETED",
            type: curr.type === "IN" ? "in" : curr.type === "OUT" ? "out" : "adjust",
          };
        }
        acc[ref].items += Math.abs(curr.quantity);
        acc[ref].total += Math.abs(curr.quantity) * (curr.price || 0);
        return acc;
      }, {});

      setLocalData(Object.values(groupedData));
    } catch (error) {
      console.error("Lỗi khi tải giao dịch:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1); 
  }, [tab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchData(); // reload
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi xóa!');
    }
  };

  // Lọc tab
  const tabData = localData.filter(i => i.type === tab);
  
  const filteredData = tabData.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase());
    const matchesDate = item.date >= startDate && item.date <= endDate;
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentTableData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-10 font-inter">
      <div className="flex justify-between items-center">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
          <button onClick={() => setTab("in")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${tab === "in" ? "bg-[#1E56A0] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
            <span className="material-symbols-outlined text-[20px]">input</span> Nhập kho
          </button>
          <button onClick={() => setTab("out")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${tab === "out" ? "bg-[#1E56A0] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
            <span className="material-symbols-outlined text-[20px]">outbound</span> Xuất kho
          </button>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl shadow-sm border flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_month</span>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent border-none text-[12px] font-bold text-slate-600 outline-none p-0 w-[115px] focus:ring-0" />
                <span className="text-slate-300 text-[10px] font-black uppercase">To</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent border-none text-[12px] font-bold text-slate-600 outline-none p-0 w-[115px] focus:ring-0" />
            </div>
            <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input placeholder="Tìm mã phiếu..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none font-medium" />
            </div>
        </div>
        <button onClick={() => navigate(tab === "in" ? "/in-out/create-inbound" : "/in-out/create")} className="bg-[#1E56A0] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined">add</span> Tạo Phiếu Mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-slate-400 font-bold uppercase text-[11px] tracking-wider tracking-tighter">
              <th className="px-6 py-4">Mã Phiếu</th><th>Ngày</th><th>Người tạo</th><th className="text-center">Số lượng</th><th className="text-right">Tổng tiền</th><th className="text-center">Trạng thái</th><th className="px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentTableData.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/20">
                <td className="px-6 py-5 font-bold text-[#1E56A0]">{row.id}</td>
                <td className="text-slate-600 font-bold">{row.date}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E56A0] flex items-center justify-center text-[10px] font-black">{row.avatar || "U"}</div>
                    <span className="font-semibold text-slate-700">{row.creator}</span>
                  </div>
                </td>
                <td className="text-center font-bold text-slate-700">{row.items}<br/><span className="text-[10px] text-slate-400 uppercase font-black">units</span></td>
                <td className="text-right font-black text-slate-800 tracking-tight">{row.total.toLocaleString()} ₫</td>
                <td className="text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black border tracking-wider ${row.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-500 border-blue-100 italic'}`}>{row.status}</span>
                </td>
                <td className="px-6 text-center">
                  <div className="flex justify-center gap-3 text-slate-300">
                    <button className="material-symbols-outlined text-[18px] hover:text-[#1E56A0]">visibility</button>
                    <button onClick={() => handleDelete(row.id)} className="material-symbols-outlined text-[18px] hover:text-red-500">delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
          <p className="text-[11px] text-slate-400 font-bold">Showing {currentTableData.length} entries</p>
          <div className="flex gap-1">
             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
               <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${currentPage === page ? "bg-[#1E56A0] text-white shadow-md" : "hover:bg-slate-200 text-slate-500"}`}>{page}</button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
