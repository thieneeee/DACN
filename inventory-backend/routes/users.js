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
          user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name, email: user.email, status: user.status }
          // Trong thực tế trả về token: token: jwtToken
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  });

// Cập nhật thông tin tài khoản
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { full_name, currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    
    const user = users[0];
    
    // Nếu có đổi mật khẩu, kiểm tra mật khẩu hiện tại
    if (newPassword) {
      // Vì data mẫu đang dùng plain text, so sánh trực tiếp
      if (currentPassword !== user.password_hash) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
      }
      
      // Update cả tên và mật khẩu
      await db.query('UPDATE users SET full_name = ?, password_hash = ? WHERE id = ?', [full_name, newPassword, userId]);
    } else {
      // Chỉ update tên
      await db.query('UPDATE users SET full_name = ? WHERE id = ?', [full_name, userId]);
    }

    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

module.exports = router;