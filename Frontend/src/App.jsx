import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import MasterLayout from './components/layout/MasterLayout';
import DashboardScreen from './screens/DashboardScreen';
import ProductScreen from './screens/ProductScreen';
import TransferScreen from './screens/TransferScreen';
import InOutScreen from './screens/InOutScreen';
import CreateOutboundScreen from './screens/CreateOutboundScreen';
import CreateInboundScreen from './screens/CreateInboundScreen';
import CreateTransferScreen from './screens/CreateTransferScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuditScreen from './screens/AuditScreen';
import ReportsScreen from './screens/ReportsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';

// Component để bảo vệ các trang yêu cầu đăng nhập
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />

        {/* Route cha: Load cái khung MasterLayout */}
        <Route path="/" element={<ProtectedRoute><MasterLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="products" element={<ProductScreen />} />
          
          <Route path="in-out">
            <Route index element={<InOutScreen />} />
            <Route path="create" element={<CreateOutboundScreen />} />
            <Route path="create-inbound" element={<CreateInboundScreen />} />
          </Route>
          
          <Route path="transfers" element={<TransferScreen />}/>
          <Route path="transfers/create" element={<CreateTransferScreen />} />
          <Route path="audit" element={<AuditScreen />} />
          <Route path="profile" element={<ProfileScreen />} />

          {/* Các route yêu cầu quyền ADMIN */}
          <Route path="settings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><SettingsScreen /></ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><ReportsScreen /></ProtectedRoute>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
