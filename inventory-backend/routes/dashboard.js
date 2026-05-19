const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy thông tin thống kê chung cho Dashboard
router.get('/stats', async (req, res) => {
    try {
        // Tổng số sản phẩm
        const [totalProductsResult] = await db.query('SELECT COUNT(id) AS total_products FROM products');
        const totalProducts = totalProductsResult[0].total_products;

        // Tổng giá trị kho (Giá nhập * Tồn kho)
        const [totalValueResult] = await db.query('SELECT SUM(price * stock_count) AS total_value FROM products');
        const totalValue = totalValueResult[0].total_value || 0;

        // Cảnh báo hết hàng
        const [lowStockResult] = await db.query('SELECT COUNT(id) AS low_stock_count FROM products WHERE stock_count <= min_stock_level');
        const lowStockCount = lowStockResult[0].low_stock_count;

        // Hàng sắp hết hạn (trong vòng 30 ngày)
        const [expiringResult] = await db.query('SELECT COUNT(id) AS expiring_count FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND expiry_date >= CURDATE()');
        const expiringCount = expiringResult[0].expiring_count;

        res.json({
            totalProducts,
            totalValue,
            lowStockCount,
            expiringCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy các mặt hàng sắp hết/đã hết
router.get('/low-stock', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE stock_count <= min_stock_level ORDER BY stock_count ASC LIMIT 10');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy các giao dịch gần đây
router.get('/recent-activities', async (req, res) => {
    try {
        const query = `
            SELECT t.*, p.name as product_name 
            FROM transactions t
            INNER JOIN products p ON t.product_id = p.id
            ORDER BY t.created_at DESC
            LIMIT 10
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
