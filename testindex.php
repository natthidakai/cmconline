<?php
$servername = "localhost"; // หรือ IP Address ของฐานข้อมูล
$username = "cmc_adminbooking"; // ชื่อผู้ใช้
$password = "lv2x42_E1"; // รหัสผ่าน
$dbname = "cmc_onlinebooking"; // ชื่อฐานข้อมูล
$dbport = 3306; // พอร์ตฐานข้อมูล

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname, $dbport);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "<p>✅ Connected successfully</p>";

// รัน Query
$sql = "SELECT 1 + 1 AS result";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // แสดงผลลัพธ์
    while ($row = $result->fetch_assoc()) {
        echo "<p>Result: " . $row["result"] . "</p>";
    }
} else {
    echo "<p>0 results</p>";
}
$conn->close();
?>
