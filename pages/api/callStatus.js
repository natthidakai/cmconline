import { sqlConfig } from '../../connect/sql';
import sql from 'mssql';


const callStatus = async (req, res) => {
    const { projectID, selectedTower, selectedFloor } = req.query; // รับ projectID จาก request query

    try {
        // เชื่อมต่อฐานข้อมูล SQL Server
        await sql.connect(sqlConfig);
        console.log('Database connection successful');

        // Query ข้อมูลจากฐานข้อมูลโดยอิงจาก projectID และเลือก FloorName ที่น้อยที่สุด
        const result = await sql.query`
            SELECT * 
            FROM [CRMRE_Production].[dbo].[cmc_vw_AllUnitStatus_forWeb] 
            WHERE ProjectID = ${projectID}
            AND UnitStatus = 'Available'
            AND FloorName != '01'
            AND FloorName != '1'
            ORDER BY UnitNumber ASC`;

        console.log('Query result:', result);

        if (result.recordset.length > 0) {
            const status = result.recordset; 
            res.status(200).json({ success: true, status });
        } else {
            res.status(404).json({ success: false, message: 'No units found' });
        }
    } catch (err) {
        console.error('Error connecting to database:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export default callStatus;

