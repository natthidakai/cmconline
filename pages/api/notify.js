import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import Mysql from '../../connect/mysql';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { bookingID, projectID, unitNumber } = req.query; // ดึงค่าจาก URL Query String

    if (!bookingID || !projectID || !unitNumber) {
        console.error("Missing required query parameters:", {
            bookingID, projectID, unitNumber
        });
        res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
        return;
    }

    // ส่วนจัดการไฟล์ (ถ้ายังต้องใช้ formidable)
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/payments'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,  // 10 MB
      filename: (name, ext) => `${uuidv4()}${ext}`, // ตั้งชื่อไฟล์แบบสุ่ม
      filter: (part) => part.mimetype && part.mimetype.startsWith("image/"), // กรองเฉพาะไฟล์ภาพ
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable Error:", err);
        res.status(500).json({ message: "Error parsing file", error: err.message });
        return;
      }
    
      console.log("Files received:", files);  // ตรวจสอบว่าไฟล์ถูกส่งมาหรือไม่
      if (!files.imageFile) {
        console.error("Missing file: imageFile");
        res.status(400).json({ message: "ไม่พบไฟล์ที่อัปโหลด" });
        return;
      }
    
      const file = files.imageFile;
      console.log("File object:", file);  // ตรวจสอบรายละเอียดไฟล์ที่ได้รับ
      if (!file.newFilename) {
        console.error("File doesn't have newFilename:", file);
        res.status(400).json({ message: "เกิดข้อผิดพลาดในการรับไฟล์" });
        return;
      }
    
      const fileUrl = `/payments/${file.newFilename}`; // สร้าง URL ของไฟล์
      console.log("File URL:", fileUrl);
    
      try {
        const updateQuery = `
            UPDATE bookings 
            SET payments = ?, payments_date = NOW()
            WHERE booking_id = ?
        `;
        console.log("Executing MySQL query with:", [fileUrl, bookingID]);
    
        const result = await Mysql.execute(updateQuery, [fileUrl, bookingID]);
        console.log("Database update result:", result);
    
        // ส่งข้อมูลไป LINE Notify
        await sendLineNotify(`การแจ้งชำระเงินจากการจองหมายเลข ${bookingID}`, fileUrl);
    
        res.status(200).json({
            message: "อัพโหลดและบันทึกข้อมูลสำเร็จ",
            fileUrl,
        });
      } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Error updating database", error: error.message });
      }
    });
    
    
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// ฟังก์ชันสำหรับส่งข้อความและ URL ของไฟล์ไปยัง LINE Notify
async function sendLineNotify(message, imageUrl) {
  const formData = new URLSearchParams();
  formData.append("message", message);
  formData.append("imageThumbnail", imageUrl);
  formData.append("imageFullsize", imageUrl);

  const response = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
    },
    body: formData,
  });

  return response;
}

