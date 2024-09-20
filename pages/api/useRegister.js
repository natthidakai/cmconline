import Mysql from '../../connect/mysql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { first_name, last_name, phone, email, password } = req.body;

        if (!first_name || !last_name || !phone || !email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // เช็คความซ้ำกันของอีเมล
        const [existingEmail] = await Mysql.query('SELECT email FROM members WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // เช็คความซ้ำกันของเบอร์โทรศัพท์
        const [existingPhone] = await Mysql.query('SELECT phone FROM members WHERE phone = ?', [phone]);
        if (existingPhone.length > 0) {
            return res.status(400).json({ message: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const result = await Mysql.query(
                'INSERT INTO members (first_name, last_name, phone, email, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [first_name, last_name, phone, email, hashedPassword]
            );
            res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
        } catch (error) {
            console.error('Error checking existing email:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
