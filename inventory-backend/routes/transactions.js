const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy lịch sử giao dịch (Kèm theo thông tin sản phẩm)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT t.*, p.name as product_name, p.sku, p.price
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

// Tạo giao dịch mới (tạo phiếu)
router.post('/', async (req, res) => {
    const { items, type, reference, note } = req.body;
    
    // items là một mảng [{ product_id, quantity }]
    // process in a transaction
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        for (const item of items) {
            // Chèn vào bảng transactions
            const qty = type === 'OUT' ? -Math.abs(item.quantity) : Math.abs(item.quantity);
            await connection.query(
                'INSERT INTO transactions (product_id, type, quantity, reference, note) VALUES (?, ?, ?, ?, ?)',
                [item.product_id, type, qty, reference, note]
            );

            // Cập nhật stock của sản phẩm
            await connection.query(
                'UPDATE products SET stock_count = stock_count + ? WHERE id = ?',
                [qty, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Tạo phiếu thành công' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Xóa một giao dịch (hoàn tác)
router.delete('/:reference', async (req, res) => {
    const reference = req.params.reference;
    // Tìm các giao dịch có reference này, đảo phần quantity
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [trans] = await connection.query('SELECT * FROM transactions WHERE reference = ?', [reference]);
        
        for (const t of trans) {
            await connection.query(
                'UPDATE products SET stock_count = stock_count - ? WHERE id = ?',
                [t.quantity, t.product_id]
            );
        }
        await connection.query('DELETE FROM transactions WHERE reference = ?', [reference]);
        await connection.commit();

        res.json({ message: 'Xóa giao dịch thành công' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;

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
