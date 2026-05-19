const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lấy danh sách toàn bộ người dùng 
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, full_name, email, role, status FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

// Giả lập API Đăng nhập nhanh
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Trong thực tế sẽ dùng bcrypt.compare(), đây là minh họa cơ bản
      const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length === 0) return res.status(401).json({ message: 'Sai account!' });
      
      const user = users[0];
      // Nếu có bcrypt: const match = await bcrypt.compare(password, user.password_hash);
      
      // Giả sử pass đúng
      res.json({
          message: 'Đăng nhập thành công',
          user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name }
          // Trong thực tế trả về token: token: jwtToken
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  });

module.exports = router;