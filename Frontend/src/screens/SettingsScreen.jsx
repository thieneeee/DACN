import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseCard from '../components/settings/WarehouseCard';

const emptyForm = {
  code: '',
  name: '',
  location: '',
  manager_id: ''
};

const SettingsScreen = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchWarehouses();
    fetchManagers();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/warehouses');
      setWarehouses(res.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách kho', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      const activeManagers = res.data.filter((user) => user.role === 'manager' || user.role === 'admin');
      setManagers(activeManagers);
    } catch (error) {
      console.error('Lỗi lấy danh sách người quản lý', error);
    }
  };

  const openAddModal = () => {
    setEditingWarehouse(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      code: warehouse.code || '',
      name: warehouse.name || '',
      location: warehouse.location || warehouse.address || '',
      manager_id: warehouse.manager_id ? String(warehouse.manager_id) : ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.location) {
      alert('Vui lòng nhập đầy đủ mã kho, tên kho và địa chỉ kho.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        location: formData.location.trim(),
        manager_id: formData.manager_id ? Number(formData.manager_id) : null
      };

      if (editingWarehouse) {
        await axios.put(`http://localhost:5000/api/warehouses/${editingWarehouse.id}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/warehouses', payload);
      }

      setIsModalOpen(false);
      setEditingWarehouse(null);
      setFormData(emptyForm);
      await fetchWarehouses();
    } catch (error) {
      console.error('Lỗi lưu kho', error);
      alert('Có lỗi xảy ra khi lưu thông tin kho.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (warehouse) => {
    if (!window.confirm(`Bạn có chắc muốn xóa kho "${warehouse.name}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/warehouses/${warehouse.id}`);
      await fetchWarehouses();
    } catch (error) {
      console.error('Lỗi xóa kho', error);
      alert('Có lỗi xảy ra khi xóa kho.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#1E56A0] font-bold">Cài đặt hệ thống</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Quản lý kho hàng</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi và quản trị các kho nội bộ cùng người phụ trách.</p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E56A0] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16427d]"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Thêm kho mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Tổng số kho</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{warehouses.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Kho đang hoạt động</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{warehouses.filter((warehouse) => warehouse.status === 'Hoạt động').length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Người quản lý đã phân bổ</p>
          <p className="mt-3 text-3xl font-bold text-[#1E56A0]">{warehouses.filter((warehouse) => warehouse.manager && warehouse.manager !== 'Chưa phân bổ').length}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} onEdit={openEditModal} onDelete={handleDelete} />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#1E56A0] font-bold">{editingWarehouse ? 'Cập nhật kho' : 'Thêm kho mới'}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{editingWarehouse ? 'Chỉnh sửa thông tin kho' : 'Tạo kho mới'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Mã kho</span>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="VD: W-001"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1E56A0]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Tên kho</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Kho chính"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1E56A0]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ</span>
                <textarea
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  rows="3"
                  placeholder="Nhập địa chỉ chi tiết"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1E56A0]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Người quản lý</span>
                <select
                  value={formData.manager_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, manager_id: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1E56A0]"
                >
                  <option value="">-- Chọn người quản lý --</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>{manager.full_name}</option>
                  ))}
                </select>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#1E56A0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? 'Đang lưu...' : editingWarehouse ? 'Cập nhật kho' : 'Thêm kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;

