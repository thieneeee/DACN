const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách danh mục
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm danh mục mới
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    try {
        const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ id: result.insertId, name, description });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cập nhật danh mục
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xóa danh mục
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
