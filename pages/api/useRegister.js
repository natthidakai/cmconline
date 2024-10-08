import bcrypt from 'bcryptjs';
import Mysql from '../../connect/mysql';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { first_name, last_name, phone, email, id_card, password } = req.body;

        // ตรวจสอบการส่งข้อมูลครบถ้วน
        if (!first_name || !last_name || !phone || !email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // เช็คความซ้ำกันของอีเมล
        try {
            const [existingEmail] = await Mysql.query('SELECT email FROM members WHERE email = ?', [email]);
            console.log('existingEmail:', existingEmail);
            if (existingEmail && existingEmail.length > 0) {
                return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
            }
        } catch (error) {
            console.error('Error checking existing email:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล' });
        }

        // เช็คความซ้ำกันของเบอร์โทรศัพท์
        try {
            const [existingPhone] = await Mysql.query('SELECT phone FROM members WHERE phone = ?', [phone]);
            console.log('existingPhone:', existingPhone);
            if (existingPhone && existingPhone.length > 0) {
                return res.status(400).json({ message: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว' });
            }
        } catch (error) {
            console.error('Error checking existing phone:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์' });
        }

        // เช็คความซ้ำกันของเลขบัตรประชาชน
        try {
            const [existingIDcard] = await Mysql.query('SELECT id_card FROM members WHERE id_card = ?', [id_card]);
            console.log('existingIDcard:', existingIDcard);
            if (existingIDcard && existingIDcard.length > 0) {
                return res.status(400).json({ message: 'หมายเลขบัตรประชาชนนี้ถูกใช้งานแล้ว' });
            }
        } catch (error) {
            console.error('Error checking existing ID card:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบหมายเลขบัตรประชาชน' });
        }

        // เข้ารหัสรหัสผ่าน
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // เพิ่มข้อมูลผู้ใช้ลงในฐานข้อมูล
        try {
            await Mysql.query(
                'INSERT INTO members (first_name, last_name, phone, email, id_card, password, create_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [first_name, last_name, phone, email, id_card, hashedPassword]
            );

            // ส่งอีเมลยืนยันการสมัครสมาชิก
            await sendSignUpEmail(email);

            res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function sendSignUpEmail(email) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Use environment variables
            pass: process.env.EMAIL_PASS, // Use environment variables
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ยินดีต้อนรับสู่ระบบ',
        text: 'สมัครสมาชิกสำเร็จแล้ว!',
        html: `<p>ยินดีต้อนรับ! คุณได้สมัครสมาชิกสำเร็จแล้ว หากคุณมีคำถามใดๆ กรุณาติดต่อฝ่ายสนับสนุน.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Signup notification email sent successfully');
    } catch (error) {
        console.error('Error sending signup email:', error);
        throw new Error(`Failed to send signup notification email: ${error.message}`);
    }
}
