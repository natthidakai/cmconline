import Mysql from '../../connect/mysql'; // Adjust the path as needed

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const connection = await Mysql.getConnection();

            // Query to fetch all bookings
            const [bookings] = await connection.execute(`
                SELECT 
                    booking_id,
                    member_id,
                    projectID,
                    unitNumber,
                    booking_date
                FROM bookings
                ORDER BY booking_date DESC
            `);

            connection.release();

            // Return the bookings as a JSON response
            res.status(200).json(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
