const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách nhà cung cấp
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM suppliers');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm nhà cung cấp mới
router.post('/', async (req, res) => {
    const { name, contact_phone, email } = req.body;
    try {
        const [result] = await db.query('INSERT INTO suppliers (name, contact_phone, email) VALUES (?, ?, ?)', [name, contact_phone, email]);
        res.status(201).json({ id: result.insertId, name, contact_phone, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cập nhật nhà cung cấp
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, contact_phone, email } = req.body;
    try {
        await db.query('UPDATE suppliers SET name = ?, contact_phone = ?, email = ? WHERE id = ?', [name, contact_phone, email, id]);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xóa nhà cung cấp
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
