<?php
$servername = "localhost"; // หรือ IP Address ของฐานข้อมูล
$username = "cmc_adminbooking"; // ชื่อผู้ใช้
$password = "lv2x42_E1"; // รหัสผ่าน
$dbname = "cmc_adminbooking"; // ชื่อฐานข้อมูล
$dbport = "3306"

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname, $dbport );

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected successfully";

// รัน Query
$sql = "SELECT 1 + 1 AS result";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // แสดงผลลัพธ์
    while ($row = $result->fetch_assoc()) {
        echo "Result: " . $row["result"];
    }
} else {
    echo "0 results";
}
$conn->close();
?>
