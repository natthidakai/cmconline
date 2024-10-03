import Mysql from '../../connect/mysql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.error('Unauthorized: No token provided');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const member_id = req.query.member_id;

            // เพิ่มการบันทึกเพื่อดีบัก token, decoded, member_id
            console.log('Token:', token); // ตรวจสอบค่า token ที่ถูกส่งมาจาก header
            console.log('Decoded JWT:', decoded); // บันทึกข้อมูล JWT ที่ decode มาแล้ว
            console.log('Member ID:', member_id); // ตรวจสอบว่า member_id ที่ได้มาถูกต้องหรือไม่

            if (!member_id) {
                console.error('Member ID not provided in the query');
                return res.status(400).json({ message: 'Bad Request: Member ID not provided' });
            }

            const [user] = await Mysql.query('SELECT * FROM members WHERE member_id = ?', [member_id]);

            // เพิ่มการบันทึกเพื่อดีบักข้อมูลผู้ใช้
            console.log('User Data from DB:', user); // ตรวจสอบข้อมูลผู้ใช้จากฐานข้อมูล

            if (!user) {
                console.error('User not found for member_id:', member_id);
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'User data fetched successfully',
                user: user
            });
        } catch (error) {
            console.error('Error fetching user:', error.message);
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            } else if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            }
            res.status(500).json({ message: 'Server error', error: error.message }); // เพิ่ม error message สำหรับดีบัก
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
