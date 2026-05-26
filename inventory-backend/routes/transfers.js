const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách phiếu điều chuyển
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.*,
                w1.name as from_warehouse_name,
                w2.name as to_warehouse_name,
                u.full_name as creator_name,
                (SELECT SUM(quantity) FROM transfer_items WHERE transfer_id = t.id) as total_items
            FROM transfers t
            LEFT JOIN warehouses w1 ON t.from_warehouse_id = w1.id
            LEFT JOIN warehouses w2 ON t.to_warehouse_id = w2.id
            LEFT JOIN users u ON t.created_by = u.id
            ORDER BY t.created_at DESC
        `;
        const [transfers] = await db.query(query);

        // Lấy các item cho mỗi transfer
        for (let transfer of transfers) {
            const [items] = await db.query(`
                SELECT ti.*, p.name as product_name, p.sku, p.image_url
                FROM transfer_items ti
                JOIN products p ON ti.product_id = p.id
                WHERE ti.transfer_id = ?
            `, [transfer.id]);
            transfer.items = items;
        }

        res.json(transfers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tạo mới phiếu điều chuyển
router.post('/', async (req, res) => {
    const { transfer_code, from_warehouse_id, to_warehouse_id, created_by, status, notes, items } = req.body;
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Tạo transfer
        const [transferResult] = await connection.query(
            'INSERT INTO transfers (transfer_code, from_warehouse_id, to_warehouse_id, created_by, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [transfer_code, from_warehouse_id, to_warehouse_id, created_by, status, notes]
        );
        const transferId = transferResult.insertId;

        // 2. Thêm transfer_items
        for (let item of items) {
            await connection.query(
                'INSERT INTO transfer_items (transfer_id, product_id, quantity) VALUES (?, ?, ?)',
                [transferId, item.product_id, item.quantity]
            );

            // Nếu status là COMPLETED, tự động trừ tồn kho hiện tại (giả lập xuất kho cho điều chuyển) 
            // Nếu bạn có nhiều kho, bạn sẽ cần quản lý inventory_by_warehouse thay vì 1 trường stock_count duy nhất.
            // Ở schema hiện tại chỉ có 1 `stock_count` trên products, điều chuyển sẽ không làm thay đổi tổng tồn kho hệ thống (stock_count).
            // Nếu bạn muốn thực sự quản lý kho riêng, cấu trúc DB cần phải sửa lại.
        }

        await connection.commit();
        res.status(201).json({ message: 'Tạo phiếu điều chuyển thành công', id: transferId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Cập nhật trạng thái phiếu điều chuyển
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE transfers SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xóa phiếu điều chuyển
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM transfers WHERE id = ?', [req.params.id]);
        res.json({ message: 'Xóa phiếu điều chuyển thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
