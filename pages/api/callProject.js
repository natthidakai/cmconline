import { sqlConfig } from '../../connect/db';
import sql from 'mssql';

const callProject = async (req, res) => {
    try {
    // เชื่อมต่อฐานข้อมูล SQL Server
    await sql.connect(sqlConfig);
    console.log('Database connection successful');

    // const result = await sql.query`
    //     SELECT * 
    //     FROM [CRMRE_Production].[dbo].[vw_ITF_ProjectInfo] 
    //     WHERE ProjectStatus != '3'  
    //         AND isDelete != '1' 
    //         AND ProjectType = 'C'  -- Use a single '=' for comparison
    //         AND BrandID != ''
    //         AND ProjectID != 'BH_BW'
    //         AND ProjectID != 'BHLT'
    //         AND ProjectID != 'CPR8'
    //         AND ProjectID != 'CT-ST32'
    //         AND ProjectID != 'BH-RAMC'
    // `;

    const result = await sql.query`
        SELECT * 
        FROM [CRMRE_Production].[dbo].[vw_ITF_ProjectInfo] 
        WHERE ProjectID = 'BH-BN36'
    `;

    console.log('Query result:', result);

    // ถ้ามีข้อมูลใน recordset
    if (result.recordset.length > 0) {
        const projects = result.recordset; // เก็บข้อมูลทั้งหมดในตัวแปร projects
        res.status(200).json({ success: true, projects });
    } else {
        // ถ้าไม่มีข้อมูล
        res.status(404).json({ success: false, message: 'No projects found' });
    }
} catch (err) {
    console.error('Error connecting to database:', err);
    // ส่ง error กลับในกรณีที่เกิดข้อผิดพลาด
    res.status(500).json({ success: false, message: 'Internal server error' });
}

};

export default callProject;
