import sql from 'mssql';

export const sqlConfig = {
  user: 'cmcweb',
  password: 'CmCweB1172',
  server: '147.50.150.114',
  options: {
    encrypt: false, // สำหรับการพัฒนาเท่านั้น
    trustServerCertificate: true // เปลี่ยนเป็น true สำหรับ production
  }
};

let pool;

export const connectToDatabase = async () => {
  if (!pool) {
      pool = await sql.connect(sqlConfig);
  }
  return pool;
};
