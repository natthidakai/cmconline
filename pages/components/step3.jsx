import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";


import 'react-datepicker/dist/react-datepicker.css';

const Step3 = () => {
    const router = useRouter();
    const { projectID, selectedFloor, selectedTower, unitNumber } = router.query;

    const [idCard, setIdCard] = useState('');
    const [error, setError] = useState('');

    const [startDate, setStartDate] = useState(new Date());

    const validateIdCard = (id) => {
        const idCardRegex = /^[0-9]{13}$/;
        return idCardRegex.test(id);
    };

    const handleChange = async (e) => {
        const value = e.target.value;
        setIdCard(value);
        if (!validateIdCard(value)) {
            setError('หมายเลขบัตรประชาชนต้องมี 13 หลัก');
        } else {
            setError('');
            try {
                const res = await fetch(`/api/checkIdCard?idCard=${value}`);
                const data = await res.json();
                if (data.exists) {
                    setError('หมายเลขบัตรประชาชนนี้มีอยู่ในฐานข้อมูลแล้ว');
                } else {
                    setError('');
                }
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการตรวจสอบ');
            }
        }
    };

    return (
        <Container className='py-5'>
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            <Row className='justify-content-center'>

                <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
                    <h5 className='th'>ข้อมูลส่วนบุคคล</h5>
                    <Row className='box-step-3 mb-5'>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="name-title" className="form-label th">คำนำหน้าชื่อ</label>
                            <Col>
                                <select className="name-title form-select th" aria-label="name-title" id="name-title">
                                    <option value="" defaultValue>-- กรุณาเลือก --</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </select>
                            </Col>
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="fname" className="form-label th">ชื่อ</label>
                            <input name='fname' type="text" id="fname" className="form-control" aria-describedby="fname" />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="lname" className="form-label th">นามสกุล</label>
                            <input name="lname" type="text" id="lname" className="form-control" aria-describedby="lname" />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
                            <input name='phone' type="tel" id="phone" className="form-control" aria-describedby="phone" />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input name="email" type="email" id="email" className="form-control" aria-describedby="email" />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="idCard" className="form-label th">เลขประจำตัวประชาชน</label>
                            <input
                                type="text"
                                id="idCard"
                                className="form-control"
                                aria-describedby="idCard"
                                value={idCard}
                                onChange={handleChange}
                            />
                            {error && <div className="text-danger th mt-2">{error}</div>}
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="birthday" className="form-label th">วันเกิด</label>
                            <input
                                name='birthday'
                                type="date"
                                id="birthday"
                                className="form-control th"
                                aria-describedby="birthday"
                            />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="nationality" className="form-label th">สัญชาติ</label>
                            <input name="nationality" type="text" id="nationality" className="form-control" aria-describedby="nationality" />
                        </Col>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="status" className="form-label th">สถานะภาพ</label>
                            <Col>
                                <select className="status form-select th" aria-label="status" id="status">
                                    <option value="" defaultValue>-- กรุณาเลือก --</option>
                                    <option value="โสด">โสด</option>
                                    <option value="สมรส">สมรส</option>
                                    <option value="หย่า">หย่า</option>
                                    <option value="หม้าย">หม้าย</option>
                                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                                </select>
                            </Col>
                        </Col>
                    </Row>

                    <Col className='justify-content-center'><Button className="btn-xl th">ลงทะเบียนจอง</Button></Col>
                </Col>
                <Row>
                    <Col>
                        {/* <h2>Step 3: Booking Details</h2>
                    <p>Project ID: {projectID}</p>
                    <p>Floor Name: {selectedFloor}</p>
                    <p>Tower Name: {selectedTower}</p>
                    <p>Unit Number: {unitNumber}</p> */}

                    </Col>
                </Row>
            </Row>
        </Container>
    );
};

export default Step3;
