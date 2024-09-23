import Mysql from '../../connect/mysql';

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const {
            title,
            first_name,
            last_name,
            projectID,
            unitNumber,
            phone,
            email,
            idCard,
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
            postal_code
        } = req.body;

        // แสดงข้อมูลที่ได้รับ
        console.log(req.body);

        try {
            // ตรวจสอบข้อมูลที่ได้รับ
            if (!title || !first_name || !last_name || !projectID || !unitNumber || !phone || !email || !idCard || !birthday || !nationality || !status || !address1 || !subdistrict1 || !districts1 || !provinces1 || !postalCode1 || !address2 || !subdistrict2 || !districts2 || !provinces2 || !postalCode2) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const connection = await Mysql.getConnection();

            const sql = 'INSERT INTO booking (title, first_name, last_name, projectID, unitNumber, phone, email, idCard, birthday, nationality, status, address1, subdistrict1, districts1, provinces1, postalCode1, address2, subdistrict2, districts2, provinces2, postalCode2, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';

            const [result] = await connection.execute(sql, [title, first_name, last_name, projectID, unitNumber, phone, email, idCard, birthday, nationality, status, address1, subdistrict1, districts1, provinces1, postalCode1, address2, subdistrict2, districts2, provinces2, postalCode2]);

            connection.release();

            res.status(200).json({ message: 'Booking successful', result });
        } catch (err) {
            console.error('Error inserting data:', err);
            console.error('Error details:', err); // แสดงรายละเอียดข้อผิดพลาด
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
