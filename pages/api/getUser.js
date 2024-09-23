import Mysql from '../../connect/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const SECRET_KEY = process.env.SECRET_KEY;

    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);

            // ตรวจสอบว่ามีค่า email จาก token หรือไม่
            if (!decoded.email) {
                return res.status(400).json({ message: 'Invalid token: Email is missing' });
            }

            const userEmail = decoded.email;

            // ดึงข้อมูลผู้ใช้จากฐานข้อมูลด้วย email ที่ได้รับ
            const [user] = await Mysql.query('SELECT * FROM members WHERE email = ?', [userEmail]);

            if (!user.length) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user[0]); // ส่งข้อมูลผู้ใช้คนเดียว
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
