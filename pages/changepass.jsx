import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";
import { useAuth } from "./api/auth/useAuth";
import { useSession } from "next-auth/react";

const ChangePassword = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const {
        changPsw,
        setChangPsw,
        errors,
        isLoading,
        changePassword,
        setErrors
    } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!session && !token) {
            router.push("/signin");
        }
    }, [session, router]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!session && !token) {
            router.push("/signin");
        }
    }, [session, router]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setChangPsw((prevData) => {
            const updatedData = { ...prevData, [id]: value };
            // console.log('Updated Form Data:', updatedData); // แสดงค่าที่อัปเดต
            return updatedData;
        });
        if (errors.message) {
            setErrors({});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword(e, session); // ส่ง session ไปยังฟังก์ชัน changePassword
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="5" xl="6" lg="6" md="8" sm="11" xs="11">
                    <Row className="box-step-3 p-5 box-shadow">
                        <div>
                            <Col className="center mb-3">
                                <Image src={LOGO} alt="Logo" width={70} height={70} />
                                <br />
                            </Col>
                            <Col>
                                <h3 className="th px-3 center mb-4">เปลี่ยนรหัสผ่าน</h3>
                            </Col>
                        </div>
                        <Col xxl="12" className="mb-4">
                            <label htmlFor="currentPassword" className="form-label th">รหัสผ่านปัจจุบัน</label>
                            <input
                                type="password"
                                id="currentPassword"
                                className="form-control th"
                                value={changPsw.currentPassword}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xxl="12" className="mb-4">
                            <label htmlFor="newPassword" className="form-label th">รหัสผ่านใหม่</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control th"
                                value={changPsw.newPassword}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xxl="12" className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label th">ยืนยันรหัสผ่านใหม่</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control th"
                                value={changPsw.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </Col>

                        <Row>
                            {errors && errors.message && (
                                <div style={{ color: 'red' }} className="mb-3 th center">
                                    {errors.message}
                                </div>
                            )}
                            <Col className="justify-content-center">
                                <Button
                                    onClick={handleSubmit} // Use handleSubmit here
                                    className="btn-xl th"
                                    disabled={isLoading} // Disable button when loading
                                >
                                    {isLoading ? 'กำลังดำเนินการ...' : 'เปลี่ยนรหัสผ่าน'}
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ChangePassword;
