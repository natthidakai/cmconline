import mysql from 'mysql2/promise';

const Mysql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // ใส่ password ของคุณ
    database: 'onlinebooking', // ใส่ชื่อฐานข้อมูลของคุณ
});

export default Mysql;
