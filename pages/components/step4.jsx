import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import Loading from './loading';
import LOGO from "../assert/images/logo.jpg";
import ProjectPayment from "../data/payment"; // Ensure this path is correct

const Step4 = () => {
    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;
    const [loading, setLoading] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState(null);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); // Simulate a 1 second loading time

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (projectID) {
            if (Array.isArray(ProjectPayment)) {
                const paymentData = ProjectPayment.find(payment => payment.id === projectID);
                setPaymentInfo(paymentData);
            } else {
                console.error("ProjectPayment is not an array:", ProjectPayment);
                // Handle the case where it's not an array, maybe set an error state
            }
        }
    }, [projectID]);

    return (
        <Container className='py-5'>
            <Row className='justify-content-center'>
                <Col xxl="12" xl="12" lg="12" md="11" sm='11' xs="11">
                    <Col className='center mb-4 justify-content-center'><Image src={LOGO} alt="" width={100} /></Col>
                    <h3 className="th px-3 center">ลงทะเบียนการจองเรียบร้อยแล้ว</h3>
                    <Col className="th center font-18 text-blue font-500 mb-5 font-italic">รายการนี้จะเสร็จสมบูรณ์ เมื่อคุณชำระเงินการจองผ่านบัญชีด้านล่าง หากชำระเงินแล้ว<br />สามารถแจ้งชำระเงินได้ที่ปุ่มแจ้งชำระเงิน รายการจองนี้ถึงจะเสร็จสมบูรณ์</Col>
                    {loading ? (
                        <Loading />
                    ) : (
                        <Row className='mb-5 justify-content-center'>
                            <Col xxl="4" xl="4" lg="4" md="6" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>รายละเอียดการจอง</h5>
                                <Col className='pl-2'>
                                    <Col className='th'><strong>โครงการ</strong> : {projectID}</Col>
                                    <Col className='th'><strong>เลขที่ห้อง</strong> : {unitNumber}</Col>
                                    <Col className='th'><strong>ชั้น</strong> : {floorName}</Col>
                                </Col>
                            </Col>
                            <Col xxl="4" xl="4" lg="4" md="6" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>รายละเอียดผู้จอง</h5>
                                <Col className='pl-2'>
                                    {/* Change these to actual data */}
                                    <Col className='th'><strong>ชื่อ - นามสกุล</strong> : {"ชื่อผู้จอง"}</Col>
                                    <Col className='th'><strong>เบอร์โทรศัพท์</strong> : {"เบอร์โทรผู้จอง"}</Col>
                                    <Col className='th'><strong>อีเมล</strong> : {"อีเมลผู้จอง"}</Col>
                                </Col>
                            </Col>
                            <Col xxl="4" xl="4" lg="4" md="12" sm="11" xs="11" className='mb-3'>
                                <h5 className='th'>ข้อมูลการชำระเงิน</h5>

                                {paymentInfo ? (
                                    <Col className='pl-2'>
                                        <Col className='th'><strong>ธนาคาร</strong> : {paymentInfo.bankName}</Col>
                                        <Col className='th'><strong>เลขที่บัญชี</strong> : {paymentInfo.accountNumber}</Col>
                                        <Col className='th'><strong>ชื่อบัญชี</strong> : {paymentInfo.accountName}</Col>
                                        <Col className='th'><strong>สาขา</strong> : {paymentInfo.branchName}</Col>
                                    </Col>
                                ) : (
                                    <Col className='th'>ไม่พบข้อมูลการชำระเงิน</Col>
                                )}

                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>

            <Col className='th center font-18 font-400 font-italic mb-5'>กรุณาตรวจสอบรายละเอียดการจองแบบละเอียด และแจ้งชำระเงินผ่านปุ่มด้านล่าง</Col>

            <Row>
                {paymentInfo ? (
                    <Col className='justify-content-center'>
                        <Button
                            className="btn-xl th"
                            href={paymentInfo.line}
                            target='_blank'
                            rel="noopener noreferrer" // Optional: for security reasons
                        >
                            แจ้งชำระเงิน
                        </Button>
                    </Col>
                ) : (
                    <Col className='th'>ไม่พบข้อมูลการชำระเงิน</Col>
                )}
            </Row>

        </Container>
    );
};

export default Step4;
