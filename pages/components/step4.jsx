import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";

import Check from "../assert/images/check-4.png";

const Step4 = () => {
    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;

    return (
        <Container className='py-5'>
            <Col className='center mb-4'><Image src={Check} alt="" width={150}/></Col>
            <h3 className="th px-3 center">ลงทะเบียนการจองเรียบร้อยแล้ว</h3>
            <Col className="th center font-18 text-blue font-500 mb-5 font-italic">รายการนี้จะเสร็จสมบูรณ์ เมื่อคุณชำระเงินการจองผ่านบัญชีด้านล่าง หากชำระเงินแล้ว<br />สามารถแจ้งชำระเงินได้ที่ปุ่มแจ้งชำระเงิน รายการจองนี้ถึงจะเสร็จสมบูรณ์</Col>
            <Row className='mb-5 justify-content-center'>
                <Col  xxl="4" xl="4" lg="4" md="11" sm="11" xs="11" className='mb-3'>
                    <h5 className='th'>รายละเอียดการจอง</h5>
                    <Col className='pl-2'>
                        <Col className='th'><strong>โครงการ</strong> : {projectID}</Col>
                        <Col className='th'><strong>เลขที่ห้อง</strong> : {unitNumber}</Col>
                        <Col className='th'><strong>ชั้น</strong> : {floorName}</Col>
                    </Col>
                </Col>
                <Col  xxl="4" xl="4" lg="4" md="11" sm="11" xs="11" className='mb-3'>
                    <h5 className='th'>รายละเอียดผู้จอง</h5>
                    <Col className='pl-2'>
                        <Col className='th'><strong>ชื่อ - นามสกุล</strong> : {projectID}</Col>
                        <Col className='th'><strong>เบอร์โทรศัพท</strong> : {unitNumber}</Col>
                        <Col className='th'><strong>อีเมล</strong> : {floorName}</Col>
                    </Col>
                </Col>
                <Col  xxl="4" xl="4" lg="4" md="11" sm="11" xs="11" className='mb-3'>
                    <h5 className='th'>ข้อมูลการชำระเงิน</h5>
                    <Col className='pl-2'>
                        <Col className='th'><strong>ธนาคาร</strong> : {projectID}</Col>
                        <Col className='th'><strong>เลขที่บัญชี</strong> : {unitNumber}</Col>
                        <Col className='th'><strong>ชื่อบัญชี</strong> : {floorName}</Col>
                        <Col className='th'><strong>สาขา</strong> : {floorName}</Col>
                    </Col>
                </Col>
            </Row>
            <Col className='th center font-18 font-400 font-italic mb-5'>กรุณาตรวจสอบรายละเอียดการจองแบบละเอียด และแจ้งชำระเงินผ่านปุ่มด้านล่าง</Col>

            <Row>
                    <Col className='justify-content-center'>
                        <Button className="btn-xl th" >แจ้งชำระเงิน</Button>
                    </Col>
                </Row>
        </Container>

    );
};

export default Step4;
