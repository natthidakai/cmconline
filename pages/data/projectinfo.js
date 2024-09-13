
import BHCPWS from "../assert/images/BH-CPWS.jpg";
import BHTWN1 from "../assert/images/BH-TWN1.jpg";
import BHRAMC from "../assert/images/BH-RAMC.jpg";
import CTKSCP from "../assert/images/CT-KSCP.jpg";
import BHBN36 from "../assert/images/BH-BN36.jpg";
import BHRH from "../assert/images/BHRH.jpg";
import CP00 from "../assert/images/CP00.jpg";
import CTR362 from "../assert/images/CT-R362.jpg";
import P392 from "../assert/images/P392.jpg";
import BK52 from "../assert/images/BK52.jpg";
import BHSUKS from "../assert/images/BH-SUKS.jpg";
import BHNWSR from "../assert/images/BH-NWSR.jpg";

const ProjectInfo = [
    {
        id: 'BH-BN36',
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
        id: 'BH-RAMC', 
        description: 'คอนโดใหม่ เลี้ยงสัตว์ได้ ใกล้มหาวิทยาลัยรามคำแหง บิ๊กซี หัวหมาก เดอะไนน์ พระราม 9 คอนโดมิเนียม 8 ชั้น 121 ยูนิต เริ่ม 2.19 ล้าน* 26 ตร.ม.', 
        pic: BHRAMC,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/wyYzqbMF6Ux2ffkE8'
    },
    { 
        id: 'BHRH',
        description: 'ขั้คอนโดสูง วิวสวย สะดวกในการเดินทาง ใกล้ BTS ตลาดพลู เพียง 1 กม. และเดินทางได้หลากหลายเส้นทาง ท่าพระ สะพานกรุงเทพ สาทร สีลม', 
        pic: BHRH,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/oyL1AXBkXmrDzvjB9'
     },
    { 
        id: 'BH-SUKS',
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
        id: 'BK52', 
        description: 'Bangkok Feliz สถานีกรุงธนบุรี ยูนิตสุดท้าย 2 ห้องนอน 4.99 ล้าน* ใกล้ BTS สถานีกรุงธนบุรี เพียง 150 เมตร แต่งครบพร้อมอยู่ ห้องใหญ่ ยูนิตน้อย สงบเป็นส่วนตัว', 
        pic: BK52,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/iyr5MdDS3WmnNRa3A'
     },
    { 
        id: 'CP00',
        description: 'ชาโตว์ อินทาวน์ ปิ่นเกล้า คอนโดพร้อมอยู่ เฟอร์ฯ ครบ ทำเลดี ใกล้ปิ่นเกล้า ศิริราช พร้อม Shuttle service 24 ชม.', 
        pic: CP00,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/TeVfq99JF2aDMmCz7'
     },
    { 
        id: 'CT-KSCP',
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
        id: 'P392', 
        description: 'Bangkok Feliz สถานีบางแค 2 ยูนิตสุดท้าย ขนาด 2 ห้องนอน 3.19 ล้าน* Private Condo เพียง 180 ม. จาก MRT สถานีบางแค พร้อมความเป็นส่วนตัว เพียง 79 ยูนิต', 
        pic: P392,
        facilities: [
            "สระว่ายน้ำ",
            "สวนส่วนกลาง",
            "ฟิตเนส",
            "พื้นที่โถงต้อนรับ",
            "ที่จอดรถ"
        ],
        map: 'https://maps.app.goo.gl/mqbSTVhezgvfLpmq9'
     }
];

export default ProjectInfo;