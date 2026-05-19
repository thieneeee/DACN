import React from 'react';

const SystemStats = () => {
  const stats = [
    { 
      label: 'Tổng sức chứa', 
      value: '85,200 m³', 
      icon: 'inventory_2', 
      bg: 'bg-blue-50', 
      text: 'text-[#1E56A0]' 
    },
    { 
      label: 'Tỷ lệ lấp đầy', 
      value: '74%', 
      icon: 'warning', 
      bg: 'bg-orange-50', 
      text: 'text-orange-600' 
    },
    { 
      label: 'Điểm vận hành', 
      value: '9.8/10', 
      icon: 'verified', 
      bg: 'bg-green-50', 
      text: 'text-green-600' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.text}`}>
            <span className="material-symbols-outlined text-[22px]">{stat.icon}</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-0.5">
              {stat.label}
            </p>
            <p className="text-xl font-extrabold text-slate-900 font-manrope">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemStats;