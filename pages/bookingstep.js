import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

import Step1 from "../assert/images/step-1.png";
import Step2 from "../assert/images/step-2.png";
import Step3 from "../assert/images/step-3.png";
import Step4 from "../assert/images/step-4.png";


const steps = [
    { id: 1, pic: Step1, title: "ค้นหาโครงการในฝัน", description: "เลือกโครงการที่ใช่ในทำเลที่ชอบ ค้นพบที่อยู่ในฝันของคุณได้ง่ายๆ" },
    { id: 2, pic: Step2, title: "เลือกห้องถูกใจ", description: "เลือกชั้น และห้องที่ต้องการ พร้อมดูรายละเอียดชัดเจนก่อนตัดสินใจ" },
    { id: 3, pic: Step3, title: "ยืนยันการจอง", description: "กรอกข้อมูลการจองอย่างง่ายดาย ไม่ยุ่งยาก เพียงไม่กี่ขั้นตอน" },
    { id: 4, pic: Step4, title: "ชำระและยืนยันสิทธิ์", description: "รับข้อมูลชำระเงิน และแจ้งการชำระ เพื่อยืนยันสิทธิ์ในห้องที่คุณเลือก" },
];

const BookingStep = () => {

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Col className="box-step-text">
                        <h3 className="th px-3 center">จองคอนโดในฝันได้ง่าย แค่ปลายนิ้ว</h3>
                        <Col className="th center">อย่ารอช้า! มาเริ่มต้นการจองคอนโดที่คุณต้องการอย่างง่ายดาย แค่ปลายนิ้ว แล้วสัมผัสกับการใช้ชีวิตแบบใหม่ที่คุณรอคอย</Col>
                    </Col>

                    <Row className="steps-container">
                        {steps.map((step) => (
                            <Col className="center justify-items-center box-steps-dec box-step-text" xxl={3} xl={3} lg={3} md={3} sm={10} xs={10} key={step.id}>
                                <Col className="btn-steps pointer mb-4">{step.id}</Col>
                                <Col className="py-3">
                                    <Image src={step.pic} alt={step.title} width={120} height={120} className="img-step "/>
                                </Col>

                                <h5 className="th">{step.title}</h5>
                                <Col className="th">{step.description}</Col>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
export default BookingStep