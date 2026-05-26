import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Tổng quan', icon: 'dashboard', path: '/dashboard', roles: ['ADMIN', 'STAFF'] },
    { name: 'Sản phẩm', icon: 'inventory_2', path: '/products', roles: ['ADMIN', 'STAFF'] },
    { name: 'Nhập / Xuất', icon: 'swap_vertical_circle', path: '/in-out', roles: ['ADMIN', 'STAFF'] },
    { name: 'Luân chuyển', icon: 'compare_arrows', path: '/transfers', roles: ['ADMIN', 'STAFF'] },
    { name: 'Kiểm kê', icon: 'rule', path: '/audit', roles: ['ADMIN', 'STAFF'] },
    { name: 'Báo cáo', icon: 'analytics', path: '/reports', roles: ['ADMIN'] },
    { name: 'Cài đặt', icon: 'settings', path: '/settings', roles: ['ADMIN'] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#1E56A0] border-r border-blue-800 flex flex-col py-6 px-4 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-white tracking-tight font-headline-xl">Quản Lý Kho</h1>
        <p className="text-blue-100/60 text-xs font-medium">Hệ thống Doanh nghiệp</p>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 border-l-4 border-white text-white font-bold'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto px-2 pt-4 border-t border-blue-800 relative">
        <Link 
          to="/profile" 
          className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white ring-2 ring-transparent group-hover:ring-white/30 transition-all font-bold">
            {user?.full_name?.split(' ').pop()?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-bold truncate">{user?.full_name || 'Khách'}</p>
            <p className="text-blue-100/50 text-[10px] truncate">Vai trò: {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</p>
          </div>
        </Link>
        <div className="absolute right-4 bottom-5">
           <button onClick={handleLogout} className="material-symbols-outlined text-white/50 text-sm cursor-pointer hover:text-red-400 transition-colors bg-transparent border-none">
             logout
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
