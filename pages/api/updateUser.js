import Mysql from '../../connect/mysql';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status, current_address, current_subdistrict, current_district, current_province, current_postal_code, address, subdistrict, district, province, postal_code, member_id } = req.body;

        try {
            const result = await Mysql.query(
                'UPDATE members SET first_name = ?, last_name = ?, email = ?, phone = ?, id_card =?, birth_date = ?, nationality = ?, marital_status =?, current_address =?, current_subdistrict =?, current_district =?, current_province =?, current_postal_code =?, address =?, subdistrict =?, district =?, province =?, postal_code =? WHERE member_id = ?',
                [first_name, last_name, email, phone, id_card, birth_date, nationality, marital_status, current_address, current_subdistrict, current_district, current_province, current_postal_code, address, subdistrict, district, province, postal_code, member_id] // แก้ลำดับพารามิเตอร์
            );
            res.status(200).json({ message: 'อัปเดตข้อมูลสำเร็จ' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
