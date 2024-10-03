import Mysql from '../../connect/mysql';

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

        // ตรวจสอบว่า member_id, projectID และ unitNumber ไม่เป็น null
        if (!member_id || !projectID || !unitNumber) {
            return res.status(400).json({ error: 'member_id, projectID และ unitNumber ต้องไม่เป็น null' });
        }

        try {
            const connection = await Mysql.getConnection();
            console.log('Incoming data:', req.body);

            // อัปเดตข้อมูลสมาชิก
            const updateMemberSql = `
                UPDATE members
                SET 
                    title_name = ?,
                    first_name = ?,
                    last_name = ?,
                    email = ?,
                    phone = ?,
                    id_card = ?,
                    birth_date = ?,
                    nationality = ?,
                    marital_status = ?,
                    current_address = ?,
                    current_subdistrict = ?,
                    current_district = ?,
                    current_province = ?,
                    current_postal_code = ?,
                    address = ?,
                    subdistrict = ?,
                    district = ?,
                    province = ?,
                    postal_code = ?
                WHERE member_id = ?`;

            const [updateResult] = await connection.execute(updateMemberSql, [
                title_name, first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status,
                current_address, current_subdistrict, current_district, current_province, current_postal_code,
                address, subdistrict, district, province, postal_code, member_id
            ]);

            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'ไม่พบสมาชิกหรือไม่มีการอัปเดต' });
            }

            // เพิ่มข้อมูลการจองใหม่
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

            // ตรวจสอบว่าการจองถูกแทรกสำเร็จหรือไม่
            if (insertResult.affectedRows === 0) {
                // ส่งการแจ้งเตือนและ redirect ไปยังหน้าที่ต้องการ
                return res.status(400).json({
                    alert: 'ไม่สามารถจองห้องซ้ำได้ภายในวันเดียวกัน',
                    redirect: `/step/1?projectID=${projectID}`
                });
            }


            connection.release();

            res.status(200).json({ message: 'อัปเดตข้อมูลสมาชิกและเพิ่มการจองใหม่สำเร็จ' });
        } catch (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', details: err.message });
        }
    } else {
        res.status(405).json({ message: 'ไม่อนุญาตวิธีการนี้' });
    }
}
