import Mysql from '../../connect/mysql';
import nodemailer from 'nodemailer';
import { sqlConfig } from '../../connect/sql';
import ProjectPayment from "../api/data/payment";
import sql from 'mssql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            member_id, title_name, first_name, last_name, email, phone, id_card,
            birth_date, nationality, marital_status, current_address,
            current_subdistrict, current_district, current_province, current_postal_code,
            address, subdistrict, district, province, postal_code,
            projectID, unitNumber
        } = req.body;

        // Validate required fields
        if (!member_id || !projectID || !unitNumber) {
            return res.status(400).json({ error: 'member_id, projectID และ unitNumber ต้องไม่เป็น null' });
        }

        let connection;
        try {
            connection = await Mysql.getConnection();

            // Update member information
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

            // Check if any rows were affected
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'ไม่พบสมาชิกหรือไม่มีการอัปเดต' });
            }

            // Check for existing booking and insert if not exists
            const insertBookingSql = `
                INSERT INTO bookings (member_id, projectID, unitNumber, status, booking_date)
                SELECT ?, ?, ?, ?, NOW()
                WHERE NOT EXISTS (
                    SELECT 1 FROM bookings 
                    WHERE member_id = ? 
                    AND unitNumber = ? 
                    AND DATE(booking_date) = CURDATE()
                )
            `;

            const [insertResult] = await connection.execute(insertBookingSql, [member_id, projectID, unitNumber, 'รอชำระเงิน', member_id, unitNumber]);

            // Check for duplicate booking
            if (insertResult.affectedRows === 0) {
                return res.status(400).json({
                    alert: 'ไม่สามารถจองห้องซ้ำได้',
                    redirect: `/step/1?projectID=${projectID}`
                });
            }

            // Fetch project information from the database
            await sql.connect(sqlConfig);
            const resultProject = await sql.query`
                SELECT ProjectID, ProjectName
                FROM CRMRE_Production.dbo.vw_ITF_ProjectInfo
                WHERE ProjectID = ${projectID}
            `;

            let projectName = projectID; // Default to projectID
            if (resultProject.recordset.length > 0) {
                projectName = resultProject.recordset[0].ProjectName; // Update to project name if available
            }

            // Find payment information
            console.log('ProjectPayment:', ProjectPayment); // Log payment data
            console.log('Project ID ที่รับมา:', projectID); // Log projectID
            const projectPayment = ProjectPayment.find(payment => payment.id === projectID);
            if (!projectPayment) {
                return res.status(404).json({ error: 'ไม่พบข้อมูลการชำระเงินสำหรับโครงการนี้' });
            }

            // Send booking confirmation email
            await sendBooking(
                first_name, last_name, email, phone, projectName, unitNumber, projectPayment
            );

            res.status(200).json({ message: 'อัปเดตข้อมูลสมาชิกและเพิ่มการจองใหม่สำเร็จ' });
        } catch (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', details: err.message });
        } finally {
            if (connection) {
                connection.release(); // Release the database connection
            }
        }
    } else {
        res.status(405).json({ message: 'ไม่อนุญาตวิธีการนี้' }); // Method not allowed
    }
}

// Function to send booking confirmation email
async function sendBooking(first_name, last_name, email, phone, projectName, unitNumber, projectPayment) {
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
        subject: 'รายละเอียดการจอง',
        html: `
            <div>
                <p>เรียน คุณ ${first_name} ${last_name},</p>
                <span>การจองของท่านยังไม่สมบูรณ์ กรุณาชำระเงินผ่านทางช่องทางด้านล่างนี้ หรือแจ้งชำระเงินได้ที่นี่ <a href="${projectPayment.line}">คลิกแจ้งชำระเงิน</a></span><br/>
                <span>นี่คือข้อมูลการจองของคุณ กรุณาตรวจสอบรายละเอียดการจองดังนี้:</span>
                <ul>
                    <li><strong>ชื่อ:</strong> ${first_name} ${last_name}</li>
                    <li><strong>อีเมล:</strong> ${email}</li>
                    <li><strong>เบอร์โทร:</strong> ${phone}</li>
                    <li><strong>โครงการ:</strong> ${projectName}</li>
                    <li><strong>หมายเลขห้อง:</strong> ${unitNumber}</li>
                </ul>
                <h3>ช่องทางการชำระเงิน</h3>
                <ul>
                    <li><strong>ธนาคาร:</strong> ${projectPayment.bankName}</li>
                    <li><strong>เลขที่บัญชี:</strong> ${projectPayment.accountNumber}</li>
                    <li><strong>ชื่อบัญชี:</strong> ${projectPayment.accountName}</li>
                    <li><strong>สาขา:</strong> ${projectPayment.branchName}</li>
                </ul>
            </div>
        `,
    };
    

    try {
        await transporter.sendMail(mailOptions);
        console.log('ส่งอีเมลยืนยันการจองสำเร็จ');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`ไม่สามารถส่งอีเมลยืนยันการจอง: ${error.message}`);
    }
}
