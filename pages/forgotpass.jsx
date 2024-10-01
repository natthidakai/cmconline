import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from './api/auth/useAuth';
import { validationForm } from "./hooks/validationForm";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

const ForgotPassword = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { 
        resetPsw, 
        setResetPsw, 
        errors, 
        setErrors, 
        checkEmail, 
        resetPassword, 
        emailChecked, 
        showNewPasswordInput, 
    } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (session && token) {
            router.push("/changepass");
        }
    }, [session, router]);
    
    
    const { handleEmailKeyPress } = validationForm();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResetPsw((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

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
                                <h3 className="th px-3 center mb-4">ลืมรหัสผ่าน</h3>
                            </Col>
                        </div>

                        {!emailChecked ? (
                            <form onSubmit={checkEmail}>
                                <Col className="mb-4">
                                    <label htmlFor="email" className="form-label th">อีเมล</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={resetPsw.email}
                                        onChange={handleInputChange}
                                        onKeyPress={handleEmailKeyPress}
                                    />
                                    {errors.message && <p style={{ color: 'red' }} className="mt-3 th text-center">{errors.message}</p>}

                                </Col>
                                <Col className="justify-content-center">
                                    <Button type="submit" className="btn-xl th">ตรวจสอบอีเมล</Button>
                                </Col>
                            </form>
                        ) : (
                            showNewPasswordInput && ( // ตรวจสอบสถานะก่อนแสดงฟอร์มกรอกรหัสผ่านใหม่
                                <form onSubmit={resetPassword}>
                                    <Col className="mb-4">
                                        <label htmlFor="newPassword" className="form-label th">รหัสผ่านใหม่</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className="form-control"
                                            value={resetPsw.newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    <Col className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label th">ยืนยันรหัสผ่านใหม่</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={resetPsw.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                    {errors.message && <p style={{ color: 'red' }} className="mt-3 th text-center">{errors.message}</p>}
                                    <Row>
                                        <Col className="justify-content-center">
                                            <Button type='submit' className="btn-xl th">เปลี่ยนรหัสผ่าน</Button>
                                        </Col>
                                    </Row>
                                </form>
                            )
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
