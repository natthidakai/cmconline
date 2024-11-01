import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Mysql from '../../../connect/mysql';
import bcrypt from 'bcrypt'; // นำเข้า bcrypt

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
                    const [rows] = await Mysql.query('SELECT * FROM members WHERE email = ?', [credentials.email]);
                    if (rows.length === 0) throw new Error("ไม่พบข้อมูลผู้ใช้งาน");

                    const user = rows[0];
                    // console.log("User from DB:", user);
                    
                    // ตรวจสอบรหัสผ่าน
                    if (!await bcrypt.compare(credentials.password, user.password)) {
                        throw new Error("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
                    }

                    // คืนค่าข้อมูลผู้ใช้
                    return {
                        id: user.member_id,
                        title_name: user.title_name,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        id_card: user.id_card,
                        birth_date: user.birth_date,
                        nationality: user.nationality,
                        marital_status: user.marital_status,
                        current_address: user.current_address,
                        current_subdistrict: user.current_subdistrict,
                        current_district: user.current_district,
                        current_province: user.current_province,
                        current_postal_code: user.current_postal_code,
                        address: user.address,
                        subdistrict: user.subdistrict,
                        district: user.district,
                        province: user.province,
                        postal_code: user.postal_code,
                    };
                } catch (error) {
                    console.error("Error accessing the database:", error);
                    throw new Error(error.message);
                }
            }
        })
    ],
    pages: {
        signIn: '/signin', // กำหนดหน้าเข้าสู่ระบบ
    },
    session: {
        strategy: 'jwt', // ใช้ JWT strategy
        maxAge: 5 * 60 * 60, // อายุของ session เป็น 5 ชั่วโมง
    },
    jwt: {
        secret: process.env.JWT_SECRET, // ใช้ secret ในการเข้ารหัส JWT
        maxAge: 5 * 60 * 60, // กำหนดอายุของ JWT token
    },
    callbacks: {
        // ฟังก์ชัน jwt: ใช้เก็บข้อมูลลงใน token
        async jwt({ token, user }) {
            // ถ้ามี user ส่งมาหรือไม่ (เกิดขึ้นหลังจากที่ผู้ใช้ล็อกอินสำเร็จ)
            if (user) {
                // ใช้ข้อมูลจาก authorize โดยตรง
                token.id = user.id;
                token.title_name = user.title_name;
                token.first_name = user.first_name;
                token.last_name = user.last_name;
                token.email = user.email;
                token.phone = user.phone;
                token.id_card = user.id_card;
                token.birth_date = user.birth_date;
                token.nationality = user.nationality;
                token.marital_status = user.marital_status;
                token.current_address = user.current_address;
                token.current_subdistrict = user.current_subdistrict;
                token.current_district = user.current_district;
                token.current_province = user.current_province;
                token.current_postal_code = user.current_postal_code;
                token.address = user.address;
                token.subdistrict = user.subdistrict;
                token.district = user.district;
                token.province = user.province;
                token.postal_code = user.postal_code;
                // console.log("Token after user login:", token);
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // เพิ่มข้อมูลจาก token ไปยัง session
                session.user = { // ใช้ session.user แทนการใช้ session ตรงๆ
                    id: token.id,
                    title_name: token.title_name,
                    first_name: token.first_name,
                    last_name: token.last_name,
                    email: token.email,
                    phone: token.phone,
                    id_card: token.id_card,
                    birth_date: token.birth_date,
                    nationality: token.nationality,
                    marital_status: token.marital_status,
                    current_address: token.current_address,
                    current_subdistrict: token.current_subdistrict,
                    current_district: token.current_district,
                    current_province: token.current_province,
                    current_postal_code: token.current_postal_code,
                    address: token.address,
                    subdistrict: token.subdistrict,
                    district: token.district,
                    province: token.province,
                    postal_code: token.postal_code,
                    token: token,
                };
                // console.log("Session after adding token:", session);
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development', // เปิด debug เฉพาะในโหมดพัฒนา
});
