import Mysql from '../../connect/mysql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const SECRET_KEY = process.env.SECRET_KEY;

    if (req.method === 'POST') {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        try {
            // ค้นหาผู้ใช้ในฐานข้อมูลจากอีเมล
            const [user] = await Mysql.query('SELECT * FROM members WHERE email = ?', [email]);

            if (user.length === 0) {
                return res.status(401).json({ message: 'ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }

            // ตรวจสอบรหัสผ่าน
            const isPasswordValid = await bcrypt.compare(password, user[0].password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
            }

            // สร้าง JWT token
            const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

            // สำเร็จ: ตอบกลับพร้อม token
            res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });

        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการล็อกอิน:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
