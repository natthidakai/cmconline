import mysql from "mysql2/promise";

export default async function handler(req, res) {
    try {
        const connection = await mysql.createConnection({
            host: '27.254.145.138',
            port: '3306',
            user: 'cmc_adminbooking',
            password: 'lv2x42_E1',
            database: 'cmc_onlinebooking',
        });

        const [rows] = await connection.execute("SELECT 1 + 1 AS result");
        await connection.end();

        res.status(200).json({
            message: "✅ Connected successfully",
            queryResult: rows,
        });
    } catch (error) {
        res.status(500).json({
            message: "❌ Failed to connect to the database",
            error: error.message,
        });
    }
}
