import Mysql from '../../connect/mysql';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

async function resetPassword(req, res) {
    if (req.method === 'POST') {
        const { email, otp, newPassword } = req.body;

        console.log('Request Body:', req.body); // Log the incoming request body

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        try {
            if (email && !otp && !newPassword) {
                const [user] = await Mysql.query('SELECT member_id, email FROM members WHERE email = ?', [email]);
                if (user.length === 0) {
                    return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน โปรดลองอีกครั้ง' });
                }

                const memberId = user[0].member_id; // Retrieve member_id
                await sendOtpToEmail(memberId, email); // Send OTP
                return res.status(200).json({ message: 'OTP ถูกส่งไปยังอีเมลของคุณแล้ว' });
            }

            if (otp && newPassword) {
                const isOtpValid = await validateOtp(email, otp); // Validate OTP
                if (!isOtpValid) {
                    return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const [result] = await Mysql.query('UPDATE members SET password = ? WHERE email = ?', [hashedPassword, email]);

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'ไม่สามารถอัปเดตรหัสผ่านได้' });
                }

                return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว' });
            }

            return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' });
        } catch (error) {
            console.error('Error in resetPassword:', error.message); // Log detailed error message
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default resetPassword;

async function sendResetEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS, // Ensure the password is correct
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'การรีเซ็ตรหัสผ่านของคุณ',
        text: `รหัส OTP ของคุณสำหรับการรีเซ็ตรหัสผ่านคือ: ${otp}`,
        html: `<p>เรียนผู้ใช้,<br>รหัส OTP ของคุณสำหรับการรีเซ็ตรหัสผ่านคือ: <strong>${otp}</strong><br>หากคุณไม่ได้ขอรีเซ็ตรหัสผ่านนี้ กรุณาติดต่อฝ่ายสนับสนุนของเรา</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message); // Log email error
        throw new Error('Failed to send email');
    }
}

function generateOtp(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

async function storeOtpInDatabase(memberId, otp) {
    const expiryTime = new Date(Date.now() + 1 * 60 * 1000); // กำหนดอายุของ OTP เป็น 1 นาที
    const createdAt = new Date();

    const query = 'INSERT INTO otp_requests (member_id, otp, otp_expiry, created_at) VALUES (?, ?, ?, ?)';
    await Mysql.query(query, [memberId, otp, expiryTime, createdAt]);
}

async function sendOtpToEmail(memberId, email) {
    const otp = generateOtp(); // Generate OTP
    await sendResetEmail(email, otp); // Send OTP to email
    await storeOtpInDatabase(memberId, otp); // Store OTP in database
}

async function validateOtp(email, otp) {
    console.log(`Validating OTP for email: ${email} with OTP: ${otp}`);
    const query = `
        SELECT * 
        FROM otp_requests 
        WHERE member_id = (SELECT member_id FROM members WHERE email = ?) 
        AND otp = ? 
        AND otp_expiry > NOW()
    `;
    const [result] = await Mysql.query(query, [email, otp]);

    console.log('Validation result:', result);

    if (result.length > 0) {
        // ลบ OTP ที่ถูกใช้เพื่อลดความเสี่ยงในการใช้ซ้ำ
        await Mysql.query('DELETE FROM otp_requests WHERE member_id = (SELECT member_id FROM members WHERE email = ?) AND otp = ?', [email, otp]);
        return true; // OTP ถูกต้องและยังไม่หมดอายุ
    }

    return false; // OTP ไม่ถูกต้องหรือหมดอายุ
}

async function clearExpiredOtps() {
    try {
        await Mysql.query('DELETE FROM otp_requests WHERE otp_expiry <= NOW()');
        console.log('Expired OTPs cleared from the database');
    } catch (error) {
        console.error('Error clearing expired OTPs:', error.message);
    }
}