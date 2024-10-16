import Mysql from '../../connect/mysql';
import nodemailer from 'nodemailer'; // Ensure this is imported
import { sqlConfig } from '../../connect/sql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            member_id,
            title_name,
            first_name,
            last_name,
            email,
            phone,
            id_card,
            birth_date,
            nationality,
            marital_status,
            current_address,
            current_subdistrict,
            current_district,
            current_province,
            current_postal_code,
            address,
            subdistrict,
            district,
            province,
            postal_code,
            projectID,
            unitNumber
        } = req.body;

        if (!member_id || !projectID || !unitNumber) {
            return res.status(400).json({ error: 'member_id, projectID และ unitNumber ต้องไม่เป็น null' });
        }

        let connection;
        try {
            connection = await Mysql.getConnection();
            console.log('Incoming data:', req.body);

            // Update member info
            const updateMemberSql = `
                UPDATE members
                SET 
                    title_name = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
                    id_card = ?, birth_date = ?, nationality = ?, marital_status = ?,
                    current_address = ?, current_subdistrict = ?, current_district = ?,
                    current_province = ?, current_postal_code = ?, address = ?, subdistrict = ?,
                    district = ?, province = ?, postal_code = ?
                WHERE member_id = ?
            `;

            const [updateResult] = await connection.execute(updateMemberSql, [
                title_name, first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status,
                current_address, current_subdistrict, current_district, current_province, current_postal_code,
                address, subdistrict, district, province, postal_code, member_id
            ]);

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'ไม่พบสมาชิกหรือไม่มีการอัปเดต' });
            }

            // Insert booking if it doesn't exist for today
            const insertBookingSql = `
                INSERT INTO bookings (member_id, projectID, unitNumber, booking_date)
                SELECT ?, ?, ?, NOW()
                WHERE NOT EXISTS (
                    SELECT 1 FROM bookings 
                    WHERE member_id = ? 
                    AND unitNumber = ? 
                    AND DATE(booking_date) = CURDATE()
                )
            `;
            const [insertResult] = await connection.execute(insertBookingSql, [member_id, projectID, unitNumber, member_id, unitNumber]);

            if (insertResult.affectedRows === 0) {
                return res.status(400).json({
                    alert: 'ไม่สามารถจองห้องซ้ำได้ภายในวันเดียวกัน',
                    redirect: `/step/1?projectID=${projectID}`
                });
            }

            // Send email after success
            await sendBooking(first_name, last_name, email, phone, projectID, unitNumber);

            res.status(200).json({ message: 'อัปเดตข้อมูลสมาชิกและเพิ่มการจองใหม่สำเร็จ' });
        } catch (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', details: err.message });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    } else {
        res.status(405).json({ message: 'ไม่อนุญาตวิธีการนี้' });
    }
}

async function sendBooking(first_name, last_name, email, phone, projectID, unitNumber) {
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
        subject: 'การจองสำเร็จเรียบร้อย',
        html: `
            <p>เรียน คุณ${first_name} ${last_name},</p>
            <p>การจองของคุณสำเร็จเรียบร้อยแล้ว กรุณาตรวจสอบรายละเอียดการจองดังนี้:</p>
            <ul>
                <li>ชื่อ: ${first_name} ${last_name}</li>
                <li>อีเมล: ${email}</li>
                <li>เบอร์โทรศัพท์: ${phone}</li>
                <li>โครงการ: ${projectID}</li>
                <li>หมายเลขห้อง: ${unitNumber}</li>
            </ul>
            <p>หากคุณพบปัญหาหรือต้องการสอบถามเพิ่มเติม กรุณาติดต่อเราได้ที่ฝ่ายบริการลูกค้า.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw new Error(`Failed to send booking confirmation email: ${error.message}`);
    }
}
