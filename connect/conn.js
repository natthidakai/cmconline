import mysql from 'mysql2/promise';

const Conn = async (req, res) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'onlinebooking',
  });

  if (req.method === 'GET') {
    try {
      const [rows] = await connection.query('SELECT * FROM bookink');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error executing query' });
    } finally {
      await connection.end();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default Conn;
