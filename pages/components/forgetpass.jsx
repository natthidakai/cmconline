import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../api/auth/useAuth';
import { validationForm } from "../../hooks/validationForm";
import Image from "next/image";
import LOGO from "../../assert/images/logo.jpg";

const ForgotPassword = () => {
    const {
        resetPsw,
        setResetPsw,
        errorsSignIn,
        setErrorsSignIn,
        checkEmail,
        resetPassword,
        emailChecked,
        showNewPassword,
        requestNewOTP,
        isLoading,
    } = useAuth();

    const { handleEmailKeyPress } = validationForm();
    
    const [timeLeft, setTimeLeft] = useState(1 * 60 * 1000); // OTP expires in 5 minutes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setResetPsw((prev) => ({ ...prev, [name]: value }));
        setErrorsSignIn((prev) => ({ ...prev, [name]: '' }));
    };

    // Countdown logic
    useEffect(() => {
        if (timeLeft <= 0) return; // Stop the countdown when time is up

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1000); // Decrease time by 1 second
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleRequestNewOtp = () => {
        requestNewOTP(); // Request new OTP through useAuth hook
        setTimeLeft(1 * 60 * 1000); // Reset the countdown
    };

    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
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
                                {errorsSignIn.message && <p className="mt-3 th text-center text-danger">{errorsSignIn.message}</p>}
                            </Col>
                            <Col className="justify-content-center">
                                <Button type="submit" className="btn-xl th" disabled={isLoading}>
                                    {isLoading ? 'กำลังดำเนินการ...' : 'ตรวจสอบอีเมล'}
                                </Button>
                            </Col>
                        </form>
                    ) : (
                        showNewPassword && (
                            <form onSubmit={resetPassword}>
                                <Col className="mb-4">
                                    <label htmlFor="otp" className="form-label th">OTP</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        name="otp"
                                        className="form-control"
                                        value={resetPsw.otp}
                                        onChange={handleInputChange}
                                    />
                                    <div className="th mt-3 font-14 center text-red">อายุ OTP: {minutes} นาที {seconds} วินาที</div>
                                    <div onClick={handleRequestNewOtp} className="th font-14 text-blue center pointer">ขอ OTP ใหม่</div>
                                </Col>
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
                                {errorsSignIn.message && <p className="mt-3 th text-center text-danger">{errorsSignIn.message}</p>}
                                <Row>
                                    <Col className="justify-content-center">
                                        <Button type='submit' className="btn-xl th" disabled={isLoading}>
                                            {isLoading ? 'กำลังดำเนินการ...' : 'รีเซ็ตรหัสผ่าน'}
                                        </Button>
                                    </Col>
                                </Row>
                            </form>
                        )
                    )}
                </Row>
            </Col>
        </Row>
    );
};

export default ForgotPassword;
