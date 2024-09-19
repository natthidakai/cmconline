import pool from '../../connect/conn';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id, newValue } = req.body;

        try {
            // การคิวรี SQL เพื่อทำการอัปเดตข้อมูล
            const [result] = await pool.query('UPDATE your_table SET your_column = ? WHERE id = ?', [newValue, id]);

            res.status(200).json({ message: 'Data updated successfully', result });
        } catch (err) {
            res.status(500).json({ error: 'Error updating data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
