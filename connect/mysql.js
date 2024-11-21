const mysql = require('mysql2/promise');

const Mysql = mysql.createPool({
    host: process.env.DB_HOST, // localhost
    // port: process.env.DB_PORT,
    user: process.env.DB_USER, // ชื่อผู้ใช้
    password: process.env.DB_PASSWORD, // รหัสผ่าน
    database: process.env.DB_NAME, // ชื่อฐานข้อมูล
});

Mysql.getConnection()
    .then((conn) => {
        console.log("✅ Database connection successful");
        conn.release();
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err.message);
    });

export default Mysql;
