const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // User mặc định của XAMPP/MySQL
  password: '2382005sd',        // Thường XAMPP để trống, nếu có thì bạn tự điền vào
  database: 'inventory_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Sử dụng Promise để dùng được async/await
const db = pool.promise();

module.exports = db;