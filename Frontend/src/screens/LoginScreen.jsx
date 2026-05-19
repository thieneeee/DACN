import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Sai tài khoản hoặc mật khẩu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Đăng nhập Hệ thống</h2>
        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
              value={username} onChange={(e) => setUsername(e.target.value)} required 
              placeholder="admin / nhanvien"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
              value={password} onChange={(e) => setPassword(e.target.value)} required 
              placeholder="123456"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
