
import BHCPWS from "../assert/images/BH-CPWS.jpg";
import BHTWN1 from "../assert/images/BH-TWN1.jpg";
import CTKSCP from "../assert/images/CT-KSCP.jpg";
import BHBN36 from "../assert/images/BH-BN36.jpg";
import BHRH from "../assert/images/BHRH.jpg";
import CP00 from "../assert/images/CP00.jpg";
import CTR362 from "../assert/images/CT-R362.jpg";
import P392 from "../assert/images/P392.jpg";
import BK52 from "../assert/images/BK52.jpg";
import BHSUKS from "../assert/images/BH-SUKS.jpg";
import BHNWSR from "../assert/images/BH-NWSR.jpg";
import CTE18P from "../assert/images/CT-E18P.jpg";

const ProjectInfo = [
    {
        id: 'BH-BN36',
        nameProject: 'ซีรอคโค',
        location: 'บางนา 36',
        minprice: '1.79',
        description: 'คอนโดตรงข้ามเซ็นทรัลบางนา คอนโดมิเนียม 8 ชั้น 4 อาคาร 752 ยูนิต Facilities มากมาย เดินทางสะดวกใกล้ BTS สถานีบางนา เพียงไม่กี่นาที',
        pic: BHBN36,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/bBskSgLKQZPuTYSW6'
    },
    {
        id: 'BH-CPWS',
        nameProject: 'เดอะ เคลฟ ริเวอร์ไลน์',
        location: 'เจ้าพระยา-วงศ์สว่าง',
        minprice: '2.29',
        description: 'คอนโด วิวโค้งแม่น้ำ คอนโดใหม่! สูง 36 ชั้น 598 ยูนิต ใกล้ทางด่วนศรีรัช ส่วนกลางครบ สัมผัสสุนทรียภาพ… แห่งการใช้ชีวิตเหนือสายน้ำ',
        pic: BHCPWS,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/54sMazuoaKX82LzX6'
    },
    { 
        id: 'BH-NWSR', 
        nameProject: 'เดอะ คิวเว่ เซ็นทรัลพาร์ค',
        location: 'นวมินทร์ - รามอินทรา',
        minprice: '1.xx',
        description: 'คอนโดใหม่! แห่งแรกในย่าน " นวมิทร์-รามอินทรา " ที่คุณจะสัมผัสธรรมชาติกับวิว Park & Lake ได้เต็มตา ด้านหลังโครงการ ติดสวนสาธารณะกว่า 100ไร่ @สวนนวมินทร์ฯ. สะดวก สบาย กับการเดินทาง ด้านหน้าโครงการ เพียง 200 ม.* ถึงสถานี MRT นวมินทร์ภิรมย์', 
        pic: BHNWSR,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/t8vH7BsRke9Uy9Dn8'
    },
    { 
        id: 'BH-SUKS',
        nameProject: 'เดอะ คิวเว่',
        location: 'พระราม 3 - สุขสวัสดิ์',
        minprice: '1.79',
        description: 'เดอะ คิวเว่ สุขสวัสดิ์ คอนโดมิเนียมหรูใหม่วิวโค้งแม่น้ำ ครบทุกกิจกรรมมากกว่า 60 โซน เทียบรวบรวมไว้ในแห่งเดียว', 
        pic: BHSUKS,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/bFSZYSmKj1Vv6ZDY8'
    },
    { 
        id: 'BH-TWN1', 
        nameProject: 'เดอะ คิวเว่',
        location: 'แยกติวานนท์',
        minprice: '3.19',
        description: 'คอนโดมิเนียมระดับพรีเมียม คอนโดทำเลดี ติด MRT สถานีแยกติวานนท์ เดินทางสะดวก สิ่งอำนวยความสะดวกจัดเต็ม เริ่ม 3.19 ล้าน* ขนาด 31 ตร.ม.', 
        pic: BHTWN1,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/6rKg4uVquRs14kzp6'
    },
    { 
        id: 'CT-KSCP',
        nameProject: 'ชาโตว์ อินทาวน์',
        location: 'เกษตร แคมปัส',
        minprice: '1.99',
        description: 'เดินทางสะดวกใกล้ BTS ม.เกษตรฯ นั่งรถไฟฟ้าต่อเดียวเข้าถึงใจกลางเมือง ใกล้แหล่ง Shopping / แหล่ง Office Building พร้อมบริการรถรับส่ง Shuttle Service และส่วนกลางตลอด 24 ชั่วโมง ใกล้ ม.เกษตร และ ม.ศรีปทุม ตอบโจทย์นักศึกษา', 
        pic: CTKSCP,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/TPETyjPDmUij8Qjq7'
    },
    { 
        id: 'CT-R362',
        nameProject: 'ไซบิค',
        location: 'รัชดา 32',
        minprice: '1.79',
        description: 'คอนโดใหม่เริ่ม 1.79 ล้าน* ใกล้รถไฟฟ้าสายสีเหลือง เชื่อมต่อถนนหลักได้หลายเส้นทาง ห่างจากมหาวิทยาลัย ราชภัฏจันทรเกษม คอนโดมิเนียม 8 ชั้น 2 อาคาร 325 ห้อง ที่จอดรถไฮโดรลิค 4 คัน', 
        pic: CTR362,
        facilities: [
            "Key Card",
            "Digital Door Lock",
            "CCTV",
            "Digital TV",
            "Rooftop Garden",
            "Swimming Pool",
            "Wireless Internet",
            "Fitness",
            "Coworking Space",
            "Sauna"
        ],
        map: 'https://maps.app.goo.gl/Bvree2r9mL6DapZx5'
    },
    {
        id: 'CT-E18P',
        nameProject: 'ชาโตว์ อินทาวน์',
        location: 'อี 18 สเตชั่น',
        minprice: '2.xx',
        description: 'ชาโตว์อินทาวน์ อี 18 สเตชั่น เตรียมพบกับ คอนโดใหม่ ใกล้ BTS โรงเรียนนายเรือ เร็วๆนี้ เริ่ม 2.xx ล้าน',
        pic: CTE18P,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: '#'
    },

];

export default ProjectInfo;