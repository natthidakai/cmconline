import Mysql from '../../connect/mysql';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { currentPassword, newPassword, member_id } = req.body;

        try {
            // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
            const [user] = await Mysql.query('SELECT member_id, password FROM members WHERE member_id = ?', [member_id]);

            // ตรวจสอบว่ามีผู้ใช้หรือไม่
            if (!user || user.length === 0) {
                return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
            }

            // ตรวจสอบรหัสผ่านปัจจุบัน
            const isMatch = await bcrypt.compare(currentPassword, user[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
            }

            // ถ้ารหัสผ่านถูกต้อง ให้ทำการ hash รหัสผ่านใหม่
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
            await Mysql.query('UPDATE members SET password = ? WHERE member_id = ?', [hashedNewPassword, member_id]);

            return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
