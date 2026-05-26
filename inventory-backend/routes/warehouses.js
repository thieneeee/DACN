const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách tất cả kho hàng (kèm thông tin quản lý)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                w.id,
                w.code,
                w.name,
                w.location,
                w.manager_id,
                u.full_name as manager_name,
                w.created_at
            FROM warehouses w
            LEFT JOIN users u ON w.manager_id = u.id
            ORDER BY w.created_at DESC
        `);
        
        // Map data về format Frontend cần
        const formattedWarehouses = rows.map(w => ({
            id: w.code, // Frontend đang dùng id string như 'W-001'
            db_id: w.id,
            name: w.name,
            address: w.location,
            manager: w.manager_name || 'Chưa phân bổ',
            status: 'Hoạt động', // Gỉa lập status
            type: 'warehouse' // Gỉa lập type
        }));
        
        res.json(formattedWarehouses);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Thêm kho mới
router.post('/', async (req, res) => {
    try {
        const { code, name, location, manager_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO warehouses (code, name, location, manager_id) VALUES (?, ?, ?, ?)',
            [code, name, location, manager_id || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Thêm kho thành công!' });
    } catch (error) {
        console.error('Lỗi khi thêm kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;