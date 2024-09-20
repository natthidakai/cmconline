import { sqlConfig } from '../../connect/sql';
import sql from 'mssql';

const getModelID = async (req, res) => {
    const { projectID, unitNumber } = req.query; // รับ projectID จาก request query

    try {
        
        await sql.connect(sqlConfig);
        console.log('Database connection successful');

        const result = await sql.query`
            SELECT * 
            FROM [CRMRE_Production].[dbo].[cmc_vw_AllUnitStatus_forWeb] 
            WHERE ProjectID = ${projectID}
            AND UnitNumber = ${unitNumber}`;

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

export default getModelID;