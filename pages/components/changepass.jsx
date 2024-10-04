import { useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useAuth } from "../api/auth/useAuth";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

import Image from "next/image";
import LOGO from "../assert/images/logo.jpg";

const ChangePass = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const {
        changPsw,
        setChangPsw,
        errorsSignIn,
        isLoading,
        changePassword,
        setErrorsSignIn
    } = useAuth();

    // ตรวจสอบการเข้าสู่ระบบ
    useEffect(() => {
        if (status === "loading") return; // ถ้ายังโหลดอยู่ให้รอ
        if (!session) {
            router.push("/signin"); // ถ้าไม่ได้เข้าสู่ระบบให้ไปที่หน้า signin
        }
    }, [session, status, router]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setChangPsw((prevData) => {
            const updatedData = { ...prevData, [id]: value };
            return updatedData;
        });
        if (errorsSignIn.message) {
            setErrorsSignIn({});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword(e, session);
    };

    return (
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
                        {errorsSignIn && errorsSignIn.message && (
                            <div className="mb-3 th center text-danger">
                                {errorsSignIn.message}
                            </div>
                        )}
                        <Col className="justify-content-center">
                            <Button
                                onClick={handleSubmit}
                                className="btn-xl th"
                                disabled={isLoading}
                            >
                                {isLoading ? 'กำลังดำเนินการ...' : 'เปลี่ยนรหัสผ่าน'}
                            </Button>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Row>
    );
};

export default ChangePass
