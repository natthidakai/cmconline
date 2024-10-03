import Mysql from '../../connect/mysql';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { member_id } = req.query;

        // ตรวจสอบว่า member_id ไม่เป็น null
        if (!member_id) {
            return res.status(400).json({ error: 'member_id ต้องไม่เป็น null' });
        }

        try {
            const connection = await Mysql.getConnection();
            console.log('Fetching data for member_id:', member_id);

            // ดึงข้อมูลสมาชิกตาม member_id
            const getUserSql = `
                SELECT * 
                FROM members
                WHERE member_id = ?
            `;

            const [rows] = await connection.execute(getUserSql, [member_id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'ไม่พบสมาชิก' });
            }

            connection.release();

            res.status(200).json(rows[0]); // ส่งข้อมูลสมาชิกเป็น JSON
        } catch (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', details: err.message });
        }
    } else {
        res.status(405).json({ message: 'ไม่อนุญาตวิธีการนี้' });
    }
}
