import { sqlConfig } from '../../connect/db';
import sql from 'mssql';

const getDetail = async (req, res) => {
    const { projectID, unitNumber } = req.query;

    try {
        await sql.connect(sqlConfig);
        console.log('การเชื่อมต่อฐานข้อมูลสำเร็จ');

        const result = await sql.query`
            SELECT * 
            FROM [CRMRE_Production].dbo.cmc_fn_QuotationDetail(${projectID}, ${unitNumber})
        `;

        console.log('ผลลัพธ์จากการสอบถาม:', result);

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, status: result.recordset });
        } else {
            res.status(404).json({ success: false, message: 'ไม่พบข้อมูลหน่วย' });
        }
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', err);
        res.status(500).json({ success: false, message: 'ข้อผิดพลาดของเซิร์ฟเวอร์ภายใน', error: err.message });
    }
};

export default getDetail;
