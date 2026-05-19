const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name, s.name as supplier_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY p.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { sku, name, category_id, supplier_id, price, stock_count, min_stock_level, expiry_date, image_url } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO products (sku, name, category_id, supplier_id, price, stock_count, min_stock_level, expiry_date, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sku, name, category_id, supplier_id, price, stock_count || 0, min_stock_level || 10, expiry_date, image_url]
        );
        res.status(201).json({ id: result.insertId, message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { sku, name, category_id, supplier_id, price, stock_count, min_stock_level, expiry_date, image_url } = req.body;
    try {
        await db.query(
            `UPDATE products SET sku = ?, name = ?, category_id = ?, supplier_id = ?, 
             price = ?, stock_count = ?, min_stock_level = ?, expiry_date = ?, image_url = ? WHERE id = ?`,
            [sku, name, category_id, supplier_id, price, stock_count, min_stock_level, expiry_date, image_url, id]
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
