const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy lịch sử giao dịch (Kèm theo thông tin sản phẩm)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT t.*, p.name as product_name, p.sku 
            FROM transactions t
            INNER JOIN products p ON t.product_id = p.id
            ORDER BY t.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm giao dịch (Tự động cập nhật số lượng tồn kho)
router.post('/', async (req, res) => {
    const { product_id, type, quantity, reference, note } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Thêm giao dịch
        await connection.query(
            'INSERT INTO transactions (product_id, type, quantity, reference, note) VALUES (?, ?, ?, ?, ?)',
            [product_id, type, quantity, reference, note]
        );

        // 2. Cập nhật tồn kho ở bảng products
        let updateQuery = '';
        if (type === 'IN') {
            updateQuery = 'UPDATE products SET stock_count = stock_count + ? WHERE id = ?';
        } else if (type === 'OUT') {
            // Đối với OUT, frontend có thể gửi số âm hoặc dương, ta chuẩn hóa về trừ
            const absQty = Math.abs(quantity);
            // Có thể kiểm tra tồn kho trước xem có đủ không
            const [stock] = await connection.query('SELECT stock_count FROM products WHERE id = ?', [product_id]);
            if (stock[0].stock_count < absQty) {
                throw new Error('Không đủ hàng tồn để xuất');
            }
            updateQuery = 'UPDATE products SET stock_count = stock_count - ? WHERE id = ?';
            // Cập nhật lại quantity để lưu vào DB có thể ở dạng âm nếu DB yêu cầu, 
            // nhưng query kia đã ghi y hệt, nên ta dùng absQty cho update.
        } else if (type === 'ADJUST') {
            updateQuery = 'UPDATE products SET stock_count = stock_count + ? WHERE id = ?';
        }

        const modifier = Math.abs(quantity);
        const actualUpdateVal = (type === 'OUT' || quantity < 0) && type !== 'IN' ? modifier : quantity;

        if (type === 'OUT') {
            await connection.query('UPDATE products SET stock_count = stock_count - ? WHERE id = ?', [modifier, product_id]);
        } else {
             await connection.query('UPDATE products SET stock_count = stock_count + ? WHERE id = ?', [quantity, product_id]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Tạo giao dịch thành công và đã cập nhật kho' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
