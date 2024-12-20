import React from "react";
import { Row, Col, Button } from "react-bootstrap";

import LOGO from "../../assert/images/logo.jpg";
import Image from "next/image";
import Link from "next/link";

import { validationForm } from "../../hooks/validationForm"
import { useAuth } from "../api/auth/useAuth"

const SignINform = () => {

    const { handleEmailKeyPress } = validationForm();
    const { signInData, handleSignIn, handleSignInChange, errorsSignIn, isLoading } = useAuth();

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
                            <h3 className="th px-3 center mb-4">เข้าสู่ระบบ</h3>
                        </Col>
                    </div>

                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                        <label htmlFor="email" className="form-label th"> อีเมล </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control th"
                            value={signInData.email}
                            onChange={handleSignInChange}
                            onKeyDown={handleEmailKeyPress}
                            required
                        />
                    </Col>

                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-2">
                        <label htmlFor="password" className="form-label th"> รหัสผ่าน </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control th"
                            value={signInData.password}
                            onChange={handleSignInChange}
                            required
                        />
                    </Col>

                    <Col className="th mb-4 right">
                        <Link href={`/password`} className="text-blue">
                            ลืมรหัสผ่าน
                        </Link>
                        |
                        <Link href={`/signup`} className="text-blue">
                            ยังไม่มีบัญชี ?
                        </Link>
                    </Col>

                    <Row>

                        {errorsSignIn.message && (
                            <div className="text-danger mb-3 th center">
                                {errorsSignIn.message}
                            </div>
                        )}

                        <Col className="justify-content-center">
                            <Button className="btn-xl th" onClick={handleSignIn} disabled={isLoading}>
                                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Row>
    )
}
export default SignINform