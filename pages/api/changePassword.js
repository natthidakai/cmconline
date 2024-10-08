import Mysql from '../../connect/mysql';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { currentPassword, newPassword, member_id } = req.body;

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัว' });
        }

        try {
            // Retrieve user data from the database
            const [user] = await Mysql.query('SELECT member_id, password, email FROM members WHERE member_id = ?', [member_id]);

            // Check if user exists
            if (!user || user.length === 0) {
                return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
            }

            const userEmail = user[0].email; // Get user's email

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
            }

            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Send notification email
            try {
                await sendChangeEmail(userEmail);
            } catch (emailError) {
                console.error('Error sending password change email:', emailError.message);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่งอีเมลแจ้งเตือนการเปลี่ยนรหัสผ่าน' });
            }

            // Update new password in the database
            await Mysql.query('UPDATE members SET password = ? WHERE member_id = ?', [hashedNewPassword, member_id]);

            return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        } catch (error) {
            console.error('Error changing password:', error.message);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}

async function sendChangeEmail(userEmail) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // ใช้ EMAIL_USER แทน EMAIL_PASS
        to: userEmail,
        subject: `การเปลี่ยนรหัสผ่านสำเร็จ`, // ใช้ชื่อในหัวข้อ
        text: 'รหัสผ่านของคุณได้ถูกเปลี่ยนเรียบร้อยแล้ว',
        html: `<p>เรียน ${userEmail},<br>รหัสผ่านของคุณได้ถูกเปลี่ยนเรียบร้อยแล้ว หากคุณไม่ได้ร้องขอการเปลี่ยนแปลงนี้ กรุณาติดต่อฝ่ายสนับสนุนทันที.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password change notification email sent successfully');
    } catch (error) {
        console.error('Error sending password change email:', error);
        throw new Error(`Failed to send password change notification email: ${error.message}`);
    }
}
