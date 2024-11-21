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
    const { bookingID, projectID, unitNumber } = req.query;

    if (!bookingID || !projectID || !unitNumber) {
      console.error("Missing required query parameters:", { bookingID, projectID, unitNumber });
      res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
      return;
    }

    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/payments'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      filename: (name, ext) => `${uuidv4()}${ext}`,
      filter: (part) => part.mimetype && part.mimetype.startsWith("image/"),
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable Error:", err);
        res.status(500).json({ message: "Error parsing file", error: err.message });
        return;
      }

      const fileArray = Array.isArray(files.imageFile) ? files.imageFile : [files.imageFile];
      const file = fileArray[0];

      if (!file || !file.newFilename) {
        console.error("File does not have a valid newFilename");
        res.status(400).json({ message: "เกิดข้อผิดพลาดในการรับไฟล์" });
        return;
      }

      const fileUrl = `/payments/${file.newFilename}`;
      console.log("File URL:", fileUrl);

      try {
        // อัปเดตข้อมูลในฐานข้อมูล
        const booking_status = 'ตรวจสอบการจอง';
        const updateQuery = `
          UPDATE bookings 
          SET status = ?, payments = ?, payments_date = NOW()
          WHERE booking_id = ?
        `;
        await Mysql.execute(updateQuery, [booking_status, fileUrl, bookingID]);

        // ส่งข้อความแจ้งเตือนเข้า LINE Notify
        const message = `แจ้งเตือนการชำระเงินใหม่!\n- Booking ID: ${bookingID}\n- Project ID: ${projectID}\n- Unit Number: ${unitNumber}\n- ดูหลักฐาน: ${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`;

        const lineNotifyResult = await sendLineNotify(message, `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`);

        if (lineNotifyResult) {
          console.log("LINE Notify ส่งข้อความสำเร็จ");
        } else {
          console.error("LINE Notify ส่งข้อความล้มเหลว");
        }

        // ตอบกลับ client ว่าทุกอย่างสำเร็จ
        res.status(200).json({ message: "อัพโหลดและบันทึกข้อมูลสำเร็จ", fileUrl });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// ฟังก์ชันสำหรับส่งข้อความไปยัง LINE Notify
async function sendLineNotify(message) {
  try {
    const formData = new URLSearchParams();
    formData.append("message", message); // เพิ่มเฉพาะข้อความ

    const response = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${process.env.LINE_NOTIFY_TOKEN_CTE18P}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("LINE Notify Error:", response.status, await response.text());
      return false;
    }

    const result = await response.json();
    console.log("LINE Notify Response:", result);
    return true;
  } catch (error) {
    console.error("Error sending LINE Notify:", error);
    return false;
  }
}

