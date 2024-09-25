import React, { useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";
import { sendResetPasswordEmail } from '../api/auth'; // Assume this function sends the reset email

const ResetPass = () => {
    const [loginData, setLoginData] = useState({ email: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Reset errors

        try {
            // Validate email format
            if (!loginData.email) {
                setErrors({ message: "กรุณากรอกอีเมล" });
                setIsLoading(false);
                return;
            }

            await sendResetPasswordEmail(loginData.email);
            setSuccessMessage('อีเมลรีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณ');
            setLoginData({ email: '' }); // Clear input
        } catch (error) {
            setErrors({ message: error.message || 'เกิดข้อผิดพลาดในการส่งอีเมล' });
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
                                <h3 className="th px-3 center mb-4">ลืมรหัสผ่าน</h3>
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
                        <Row>
                            {errors.message && <div className="text-danger mb-3 th center">{errors.message}</div>}
                            {successMessage && <div className="text-success mb-3 th center">{successMessage}</div>}
                            <Col className="justify-content-center">
                                <Button className="btn-xl th" onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPass;
