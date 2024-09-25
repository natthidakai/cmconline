// components/ChangePassword.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";
import Loading from './components/loading';
import { useFetchUser } from './hooks/useFetchUser';
import usePassword from './hooks/usePassword';

const ChangePassword = () => {
    const router = useRouter();
    const { user, error } = useFetchUser();

    const { currentPassword, newPassword, confirmPassword, errors, loading, setCurrentPassword, setNewPassword, setConfirmPassword, changePassword } = usePassword(user);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                {loading ? (
                    <Loading />
                ) : (
                    <Col xxl="5" xl="6" lg="6" md="8" sm="11" xs="11">
                        <Row className="box-step-3 p-5 box-shadow">
                            <div>
                                <Col className="center mb-3">
                                    <Image src={LOGO} alt="" width={70} height={70} />
                                    <br />
                                </Col>
                                <Col>
                                    <h3 className="th px-3 center mb-4">เปลี่ยนรหัสผ่าน</h3>
                                </Col>
                            </div>
                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                                <label htmlFor="currentPassword" className="form-label th">รหัสผ่านปัจจุบัน</label>
                                <input type="password" id="currentPassword" className="form-control th" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                            </Col>
                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                                <label htmlFor="newPassword" className="form-label th">รหัสผ่านใหม่</label>
                                <input type="password" id="newPassword" className="form-control th" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            </Col>
                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label th">ยืนยันรหัสผ่านใหม่</label>
                                <input type="password" id="confirmPassword" className="form-control th" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </Col>
                            <Row>
                                {errors && <p className="text-danger th center">{errors}</p>}
                                <Col className="justify-content-center">
                                    <Button className="btn-xl th" onClick={changePassword}>เปลี่ยนรหัสผ่าน</Button>
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default ChangePassword;
