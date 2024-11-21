import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { getBooking } from "../../hooks/userBooking";
import { useSignUp } from "../../hooks/useSignUp"

import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import Loading from './loading';
import LOGO from "../../assert/images/logo.jpg";
import ProjectPayment from "../api/data/payment";
import ProjectInfo from "../api/data/projectinfo";

const Step4 = () => {
    const { data: session, status } = useSession();
    const bookings = getBooking(session);
    const router = useRouter();
    const { projectID, floorName, unitNumber } = router.query;

    const [projectPayment, setProjectPayment] = useState(null);
    const [projectInfo, setProjectInfo] = useState(null);

    useEffect(() => {
        if (projectID) {
            const paymentData = ProjectPayment.find(payment => payment.id === projectID);
            setProjectPayment(paymentData);
        }
    }, [projectID]);

    useEffect(() => {
        if (projectID) {
            const infoData = ProjectInfo.find(info => info.id === projectID);
            setProjectInfo(infoData);
        }
    }, [projectID]);

    const {
        user,
    } = useSignUp();

    return (
        <Container className='py-5'>
            {status === "loading" && <Loading />}

            {status === "authenticated" && bookings.length === 0 && (
                <p>No bookings found</p>
            )}
            {status === "authenticated" && bookings.length > 0 && (
                <Row className='justify-content-center'>
                    <Col xxl="12" xl="12" lg="12" md="11" sm='11' xs="11">
                        <Col className='center mb-4 justify-content-center'><Image src={LOGO} alt="" width={100} /></Col>
                        <h3 className="th px-3 center">ลงทะเบียนการจองเรียบร้อยแล้ว</h3>
                        <Col className="th center font-18 text-blue font-500 mb-5 font-italic">รายการนี้จะเสร็จสมบูรณ์ เมื่อคุณชำระเงินการจองผ่านบัญชีด้านล่าง หากชำระเงินแล้ว<br />สามารถแจ้งชำระเงินได้ที่ปุ่มแจ้งชำระเงิน รายการจองนี้ถึงจะเสร็จสมบูรณ์</Col>
                        <Row className='mb-5 justify-content-center'>
                            <Col xxl="4" xl="4" lg="4" md="6" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>รายละเอียดการจอง</h5>
                                <Col className='pl-2'>
                                    <Col className='th'><strong>หมายเลขการจอง</strong> : {projectID}</Col>
                                    <Col className='th'><strong>โครงการ</strong> : {projectInfo.nameProject} {projectInfo.location}</Col>
                                    <Col className='th'><strong>เลขที่ห้อง</strong> : {unitNumber}</Col>
                                    <Col className='th'><strong>ชั้น</strong> : {floorName}</Col>
                                </Col>
                            </Col>
                            <Col xxl="4" xl="4" lg="4" md="6" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>รายละเอียดผู้จอง</h5>
                                <Col className='pl-2'>
                                    <Col className='th'><strong>ชื่อ - นามสกุล</strong> : {user.first_name} {user.last_name}</Col>
                                    <Col className='th'><strong>เบอร์โทรศัพท์</strong> : {user.phone}</Col>
                                    <Col className='th'><strong>อีเมล</strong> : {user.email}</Col>
                                </Col>
                            </Col>
                            <Col xxl="4" xl="4" lg="4" md="12" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>ข้อมูลการชำระเงิน</h5>
                                <Col className='pl-2'>
                                    <Col className='th'><strong>ธนาคาร</strong> : {projectPayment.bankName}</Col>
                                    <Col className='th'><strong>เลขที่บัญชี</strong> : {projectPayment.accountNumber}</Col>
                                    <Col className='th'><strong>ชื่อบัญชี</strong> : {projectPayment.accountName}</Col>
                                    <Col className='th'><strong>สาขา</strong> : {projectPayment.branchName}</Col>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                    <Col className='justify-content-center'>
                        <Button
                            className="btn-xl th"
                            href={`/mybooking`}
                            target='_blank'
                            rel="noopener noreferrer" // Optional: for security reasons
                        >
                            แจ้งชำระเงิน
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Step4;
