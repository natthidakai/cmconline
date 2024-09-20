// Example in Next.js API route (pages/api/checkIdCard.js)

import { sqlConfig } from '../../connect/sql';
import sql from 'mssql';

const checkIdCard = async (req, res) => {
    const { idCard } = req.query;

    if (!idCard) {
        return res.status(400).json({ success: false, message: 'ID Card is required' });
    }

    try {
        // เชื่อมต่อฐานข้อมูล SQL Server
        await sql.connect(sqlConfig);
        
        // Query เพื่อตรวจสอบหมายเลขบัตรประชาชนในฐานข้อมูล
        const result = await sql.query`
            SELECT * 
            FROM [YourTable] 
            WHERE IDCard = ${idCard}
        `;

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, exists: true });
        } else {
            res.status(200).json({ success: true, exists: false });
        }
    } catch (err) {
        console.error('Error connecting to database:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default checkIdCard;
