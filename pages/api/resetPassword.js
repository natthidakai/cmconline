import bcrypt from 'bcrypt';
import Mysql from '../../connect/mysql';

export default async function resetPassword(req, res) {
    if (req.method === 'POST') {
        const { email, newPassword } = req.body;

        // Log the request body for debugging
        console.log('Request Body:', req.body);

        if (!email) {
            return res.status(400).json({ message: 'อีเมลจำเป็นต้องถูกกรอก' });
        }

        try {
            // Check for email existence
            const [user] = await Mysql.query('SELECT email FROM members WHERE email = ?', [email]);
            if (user.length === 0) {
                // Consider commenting out or changing this message
                return res.status(404).json({ message: 'ไม่พบอีเมลในระบบ' });
            }

            // Validate new password if provided
            if (newPassword) {
                // Example validation: Check password length
                if (newPassword.length < 8) {
                    return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' });
                }

                // Hash the new password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Update the new password in the database
                const [result] = await Mysql.query('UPDATE members SET password = ? WHERE email = ?', [hashedPassword, email]);

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'ไม่สามารถอัปเดตรหัสผ่านได้' });
                }

                return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
            }

            // If just checking the email, return success
            return res.status(200).json({ message: 'อีเมลถูกต้อง' });
        } catch (error) {
            console.error('Error occurred:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดำเนินการ' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
