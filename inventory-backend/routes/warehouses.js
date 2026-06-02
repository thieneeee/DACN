const express = require('express');
const router = express.Router();
const db = require('../config/db');

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

        const formattedWarehouses = rows.map((warehouse) => ({
            id: warehouse.id,
            code: warehouse.code,
            name: warehouse.name,
            address: warehouse.location,
            location: warehouse.location,
            manager_id: warehouse.manager_id,
            manager: warehouse.manager_name || 'Chưa phân bổ',
            manager_name: warehouse.manager_name || 'Chưa phân bổ',
            status: 'Hoạt động',
            type: 'warehouse'
        }));

        res.json(formattedWarehouses);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { code, name, location, manager_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO warehouses (code, name, location, manager_id) VALUES (?, ?, ?, ?)',
            [code, name, location, manager_id || null]
        );

        res.status(201).json({
            id: result.insertId,
            code,
            name,
            location,
            manager_id: manager_id || null,
            message: 'Thêm kho thành công!'
        });
    } catch (error) {
        console.error('Lỗi khi thêm kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, location, manager_id } = req.body;

        await db.query(
            'UPDATE warehouses SET code = ?, name = ?, location = ?, manager_id = ? WHERE id = ?',
            [code, name, location, manager_id || null, id]
        );

        res.json({
            id: Number(id),
            code,
            name,
            location,
            manager_id: manager_id || null,
            message: 'Cập nhật kho thành công!'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM warehouses WHERE id = ?', [id]);
        res.json({ message: 'Xóa kho thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa kho:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router;