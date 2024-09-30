import Mysql from '../../connect/mysql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { 
            title_name, first_name, last_name, email, phone, 
            id_card, birth_date, nationality, marital_status, 
            current_address, current_subdistrict, current_district, 
            current_province, current_postal_code, address, 
            subdistrict, district, province, postal_code, member_id 
        } = req.body;

        // ตรวจสอบว่ามี member_id หรือไม่
        if (!member_id) {
            return res.status(400).json({ message: 'member_id is required' });
        }

        try {
            const [result] = await Mysql.query(
                'UPDATE members SET title_name = ?, first_name = ?, last_name = ?, email = ?, phone = ?, id_card =?, birth_date = ?, nationality = ?, marital_status =?, current_address =?, current_subdistrict =?, current_district =?, current_province =?, current_postal_code =?, address =?, subdistrict =?, district =?, province =?, postal_code =? WHERE member_id = ?',
                [title_name, first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status, current_address, current_subdistrict, current_district, current_province, current_postal_code, address, subdistrict, district, province, postal_code, member_id]
            );

            console.log("Query executed:", result);

            // ตรวจสอบว่ามีการอัปเดตแถวหรือไม่
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ต้องการอัปเดต' });
            }

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

