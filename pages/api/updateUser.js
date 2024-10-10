import Mysql from '../../connect/mysql';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { 
            title_name, first_name, last_name, email, phone, 
            id_card, birth_date, nationality, marital_status, 
            current_address, current_subdistrict, current_district, 
            current_province, current_postal_code, address, 
            subdistrict, district, province, postal_code, member_id 
        } = req.body;

        if (!member_id) {
            return res.status(400).json({ message: 'member_id is required' });
        }

        try {
            const [result] = await Mysql.query(
                'UPDATE members SET title_name = ?, first_name = ?, last_name = ?, email = ?, phone = ?, id_card =?, birth_date = ?, nationality = ?, marital_status =?, current_address =?, current_subdistrict =?, current_district =?, current_province =?, current_postal_code =?, address =?, subdistrict =?, district =?, province =?, postal_code =? WHERE member_id = ?',
                [title_name, first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status, current_address, current_subdistrict, current_district, current_province, current_postal_code, address, subdistrict, district, province, postal_code, member_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ต้องการอัปเดต' });
            }

            await sendUpdateUser(first_name, email); // ส่งอีเมลหลังจากอัปเดตสำเร็จ
            res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จ' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// ฟังก์ชันส่งอีเมล
async function sendUpdateUser(first_name, email) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `การอัปเดตข้อมูลสำเร็จ`,
        text: 'ข้อมูลของคุณได้ถูกอัปเดตเรียบร้อยแล้ว',
        html: `<p>เรียน คุณ${first_name},<br>ข้อมูลของคุณได้ถูกอัปเดตเรียบร้อยแล้ว หากคุณพบข้อผิดพลาดหรือมีคำถามเพิ่มเติม กรุณาติดต่อฝ่ายสนับสนุนทันที.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Update notification email sent successfully');
    } catch (error) {
        console.error('Error sending update notification email:', error);
        throw new Error(`Failed to send update notification email: ${error.message}`);
    }
}
