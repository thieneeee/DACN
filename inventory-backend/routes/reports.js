const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy báo cáo Xuất - Nhập - Tồn với bộ lọc
router.get('/inout-stock', async (req, res) => {
    try {
        const { reportType = 'inout', warehouseId, startDate, endDate } = req.query;

        let query = `
            SELECT 
                p.id,
                p.sku,
                p.name,
                p.price,
                p.stock_count as end_stock,
                COALESCE(SUM(CASE WHEN t.type = 'IN' AND DATE(t.created_at) >= ? AND DATE(t.created_at) <= ? THEN ABS(t.quantity) ELSE 0 END), 0) as total_in,
                COALESCE(SUM(CASE WHEN t.type = 'OUT' AND DATE(t.created_at) >= ? AND DATE(t.created_at) <= ? THEN ABS(t.quantity) ELSE 0 END), 0) as total_out
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
            GROUP BY p.id, p.sku, p.name, p.price, p.stock_count
            ORDER BY p.created_at DESC
        `;

        const params = [startDate || '2023-01-01', endDate || new Date().toISOString().split('T')[0], 
                        startDate || '2023-01-01', endDate || new Date().toISOString().split('T')[0]];

        const [rows] = await db.query(query, params);

        // Tính toán tồn đầu kỳ
        const data = rows.map(row => ({
            id: row.id,
            sku: row.sku,
            name: row.name,
            open_stock: row.end_stock + row.total_out - row.total_in, // Tồn đầu
            in: row.total_in,
            out: row.total_out,
            end_stock: row.end_stock,
            price: row.price,
            total_value: row.end_stock * row.price
        }));

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy báo cáo giá trị tồn kho theo sản phẩm
router.get('/inventory-value', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.sku,
                p.name,
                p.stock_count,
                p.price,
                (p.stock_count * p.price) as total_value,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY total_value DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách sản phẩm sắp hết
router.get('/low-stock', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.sku,
                p.name,
                p.stock_count,
                p.min_stock_level,
                p.price,
                (p.stock_count * p.price) as total_value,
                c.name as category_name,
                ROUND((p.stock_count / p.min_stock_level) * 100, 2) as stock_percentage
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.stock_count <= p.min_stock_level
            ORDER BY stock_percentage ASC
            LIMIT 10
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy xu hướng giá trị kho theo tháng
router.get('/inventory-trends', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(t.created_at, '%Y-%m') as month,
                t.type,
                SUM(ABS(t.quantity * p.price)) as value_change
            FROM transactions t
            INNER JOIN products p ON t.product_id = p.id
            WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(t.created_at, '%Y-%m'), t.type
            ORDER BY month DESC
        `;
        const [rows] = await db.query(query);
        
        // Format dữ liệu thành mảng với IN và OUT cho từng tháng
        const trends = {};
        rows.forEach(row => {
            if (!trends[row.month]) {
                trends[row.month] = { month: row.month, IN: 0, OUT: 0 };
            }
            trends[row.month][row.type] = row.value_change;
        });

        const result = Object.values(trends).sort((a, b) => new Date(a.month) - new Date(b.month));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy tổng thống kê báo cáo
router.get('/summary', async (req, res) => {
    try {
        const [totalValueResult] = await db.query(`
            SELECT SUM(price * stock_count) as total_inventory_value FROM products
        `);
        const totalValue = totalValueResult[0].total_inventory_value || 0;

        const [lowStockResult] = await db.query(`
            SELECT COUNT(id) as low_stock_count FROM products WHERE stock_count <= min_stock_level
        `);
        const lowStockCount = lowStockResult[0].low_stock_count;

        const [lastMonthValueResult] = await db.query(`
            SELECT SUM(ABS(t.quantity * p.price)) as last_month_value
            FROM transactions t
            INNER JOIN products p ON t.product_id = p.id
            WHERE MONTH(t.created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
            AND YEAR(t.created_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
        `);
        const lastMonthValue = lastMonthValueResult[0].last_month_value || 0;

        // Tính phần trăm thay đổi
        const percentageChange = lastMonthValue > 0 ? ((totalValue - lastMonthValue) / lastMonthValue * 100) : 0;

        res.json({
            totalInventoryValue: totalValue,
            lowStockCount: lowStockCount,
            percentageChange: percentageChange.toFixed(1)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
