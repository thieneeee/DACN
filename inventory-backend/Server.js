const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc dữ liệu JSON gửi lên

// Kiểm tra kết nối MySQL ngay khi chạy server
db.query('SELECT 1')
  .then(() => console.log('✅ Đã kết nối MySQL thành công!'))
  .catch((err) => console.error('❌ Lỗi kết nối MySQL:', err.message));

// Routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Khởi động Server thẳng ở cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});