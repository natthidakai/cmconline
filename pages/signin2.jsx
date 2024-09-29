import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react"; // Import useSession และ signIn จาก next-auth/react
import { Container, Row, Col, Button } from "react-bootstrap";
import { useAuth } from "./api/auth/useAuth";
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";
import Link from "next/link";
import { useRouter } from "next/router";

const SignIn = () => {
    const { loginData, errors, isLoading, handleInputChange, loginUser, setLoginData } = useAuth();
    const { data: session, status } = useSession(); // ใช้ useSession เพื่อดึงสถานะการล็อกอิน
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            // ถ้าผู้ใช้ล็อกอินแล้ว ให้เปลี่ยนเส้นทางไปที่หน้า home หรือหน้าที่ต้องการ
            router.push("/");
        }
    }, [status, router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return; // ป้องกันการส่งหากกำลังโหลดอยู่
        loginUser(e); 
    };

    if (status === "loading") {
        return <div>กำลังโหลดข้อมูล...</div>; // แสดงข้อความโหลดขณะกำลังตรวจสอบสถานะ
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="4" xl="4" lg="5" md="7" sm="10" xs="10">
                    <Row className="box-step-3 p-5 box-shadow">
                        <div>
                            <Col className="center mb-3">
                                <Image src={LOGO} alt="Logo" width={70} height={70} />
                                <br />
                            </Col>
                            <Col>
                                <h3 className="th px-3 center mb-4">เข้าสู่ระบบ</h3>
                            </Col>
                        </div>

                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control th"
                                value={loginData.email}
                                onChange={handleInputChange}
                                required
                                aria-label="Email"
                            />
                        </Col>

                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-2">
                            <label htmlFor="password" className="form-label th">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control th"
                                value={loginData.password}
                                onChange={handleInputChange}
                                required
                                aria-label="Password"
                            />
                        </Col>

                        <Col className="th mb-4 right">
                            <Link href={`/resetpass`} className="text-blue">ลืมรหัสผ่าน</Link>
                            |
                            <Link href={`/signup`} className="text-blue">ยังไม่มีบัญชี ?</Link>
                        </Col>

                        <Row>
                            {errors.message && (
                                <div className="text-danger mb-3 th center" role="alert">
                                    {errors.message}
                                </div>
                            )}
                            <Col className="justify-content-center">
                                <Button className="btn-xl th" onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                                </Button>
                            </Col>
                        </Row>

                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default SignIn;
