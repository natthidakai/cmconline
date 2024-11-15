import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouter } from 'next/router';
import ProjectInfo from "./api/data/projectinfo";
import Image from "next/image";

import LOGO from "../assert/images/logo.jpg";

const Payment = () => {
    const router = useRouter();
    const { projectID, bookingID, unitNumber } = router.query;

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            alert("กรุณาอัพโหลดไฟล์หลักฐานการชำระเงิน");
            return;
        }
    
        if (!bookingID || !projectID || !unitNumber) {
            alert("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ");
            console.error("Missing data:", { bookingID, projectID, unitNumber });
            return;
        }
    
        const url = `/api/notify?bookingID=${bookingID}&projectID=${projectID}&unitNumber=${unitNumber}`;
    
        const formData = new FormData();
        formData.append("imageFile", file);  // ตรวจสอบว่าไฟล์ถูกส่งไปใน FormData
    
        console.log("Data being sent:");
        console.log("API URL:", url);
        console.log("bookingID:", bookingID);
        console.log("projectID:", projectID);
        console.log("unitNumber:", unitNumber);
        console.log("File:", file);
    
        setIsLoading(true);
    
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,  // ส่งฟอร์มไปยัง API
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Server Error:", errorMessage);
                alert(`เกิดข้อผิดพลาดในการส่งข้อมูล: ${response.status}`);
                setIsLoading(false);
                return;
            }
    
            alert("อัพโหลดข้อมูลสำเร็จ");
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const project = ProjectInfo.find((s) => s.id === projectID);

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="5" xl="6" lg="6" md="8" sm="11" xs="11" className="box-step-3 p-5 box-shadow">
                    <Col className="mb-4">
                        <Col className="center mb-3">
                            <Image src={LOGO} alt="Logo" width={70} height={70} />
                        </Col>
                        <h3 className="th px-3 center">แจ้งชำระเงิน</h3>
                    </Col>

                    <Col className="th mb-1 font-600 font-itali center">กรุณาตรวจสอบความถูกต้อง ก่อนแจ้งชำระเงิน</Col>

                    <Col className="th pl-1 center">
                        <strong className="font-500 text-red ">โครงการ : </strong>
                        {project ? project.nameProject : "ไม่พบข้อมูลโครงการ"}{" "}
                        {project ? project.location : ""}
                    </Col>
                    <Col className="th pl-1 mb-5 center">
                        <strong className="font-500 text-red ">หมายเลขการจอง : </strong>{bookingID} /
                        <strong className="font-500 text-red "> หมายเลขห้อง :</strong> {unitNumber}
                    </Col>

                    <Col>
                        <label htmlFor="formFile" className="form-label th">
                            อัพโหลดหลักฐานการชำระเงิน:
                        </label>
                        <input
                            className="form-control th mb-3"
                            type="file"
                            id="formFile"
                            onChange={handleFileChange}
                            accept="image/*"
                        />

                        <Col className="center">
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'กำลังดำเนินการ...' : 'แจ้งชำระเงิน'}
                            </Button>
                        </Col>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default Payment;