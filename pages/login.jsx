import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

import Link from "next/link";

const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/profile');
        }
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate input fields
        if (!loginData.email || !loginData.password) {
            setErrors({ message: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/useLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token); // เก็บ token ใน localStorage
                router.push("/").then(() => {
                    router.reload();
                });
            } else {
                setErrors({ message: result.message });
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", error);
            setErrors({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="4" xl="4" lg="5" md="7" sm="10" xs="10">
                    <Row className="box-step-3 p-5 box-shadow">
                        <div>
                            <Col className="center mb-3">
                                <Image src={LOGO} alt="" width={70} height={70} />
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
                            />
                        </Col>
                        <Col className="th mb-4 right">
                            <Link href={`/resetpass`} className="text-blue">ลืมรหัสผ่าน</Link>
                            |
                            <Link href={`/register`} className="text-blue">ยังไม่มีบัญชี ?</Link></Col>
                        <Row>
                            {errors.message && <div className="text-danger mb-3 th center">{errors.message}</div>}
                            <Col className="justify-content-center">
                                <Button className="btn-xl th" onClick={loginUser}>
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

export default Login;