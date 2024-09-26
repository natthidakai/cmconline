import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Mysql from '../../../connect/mysql';
import bcrypt from 'bcrypt'; // นำเข้า bcrypt

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const [rows] = await Mysql.query('SELECT * FROM members WHERE email = ?', [credentials.email]);
                    const user = rows[0];

                    // ตรวจสอบว่าผู้ใช้มีอยู่และรหัสผ่านตรงกัน
                    if (user && await bcrypt.compare(credentials.password, user.password)) {
                        return { id: user.member_id, name: user.first_name, email: user.email };
                    } else {
                        return null; // หากไม่พบผู้ใช้หรือรหัสผ่านไม่ตรงกัน
                    }
                } catch (error) {
                    console.error("Error accessing the database:", error);
                    return null; // คืนค่า null หากมีข้อผิดพลาด
                }
            }
        })
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 5 * 60 * 60, // กำหนดอายุของ session เป็น 5 ชั่วโมง
    },
    jwt: {
        secret: process.env.JWT_SECRET, // ใช้ secret ในการเข้ารหัส JWT
        maxAge: 5 * 60 * 60, // กำหนดอายุของ JWT token เป็น 5 ชั่วโมง
    },
    callbacks: {
        async jwt({ token, user }) {
            // เพิ่มข้อมูล user ลงใน token ถ้ามีการล็อกอินสำเร็จ
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.first_name;
            }
            return token;
        },
        async session({ session, token }) {
            // เพิ่มข้อมูล token ลงใน session
            if (token) {
                session.id = token.id;
                session.email = token.email;
                session.name = token.first_name;
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development' // แสดงข้อผิดพลาดเมื่ออยู่ในโหมด development
});
