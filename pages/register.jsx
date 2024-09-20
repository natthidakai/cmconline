import React, { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormValidation } from './hooks/useFormValidation';
import { useRouter } from 'next/router';

const Register = () => {

    const { errors, regisInputChange, validateRegister } = useFormValidation();   
    const [regisData, setRegisData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        CFpassword: ''
    });

    

    const registerUser = async (e) => {

        e.preventDefault();
        const isValid = validateRegister(regisData);

        console.log('regisData', regisData)

        if (!isValid) {
            console.error('Form validation failed');
            return; // ถ้าฟอร์มไม่ถูกต้อง ให้ไม่ทำอะไรต่อ
        }

        try {
            const response = await fetch('/api/useRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regisData),
            });

            if (response.ok) {
                router.push('/'); // เปลี่ยนไปที่หน้าแรกหลังจากสมัครสมาชิกสำเร็จ

                // รีเซ็ตค่าในฟอร์ม
                setRegisData({
                    first_name: '',
                    last_name: '',
                    phone: '',
                    email: '',
                    password: ''
                });
            } else {
                const errorData = await response.json();
                console.log(errorData.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
        }
    };

    const handleInputChange = (e) => {
        regisInputChange(e, setRegisData);
    };

    return (
        <Container className='py-5'>
            <h3 className="th px-3 center mb-4">สมัครสมาชิก</h3>
            <Row className='justify-content-center'>
                <Col xxl="6" xl="6" lg="6" md="11" sm="11" xs="11">
                    <Row className='box-step-3 mb-5'>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="first_name" className="form-label th">ชื่อ</label>
                            <input
                                name='first_name'
                                type="text"
                                id="first_name"
                                className="form-control th"
                                value={regisData.first_name}
                                onChange={handleInputChange}
                            />
                            {errors.first_name && <div className="text-danger mt-2 th">{errors.first_name}</div>}
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="last_name" className="form-label th">นามสกุล</label>
                            <input
                                name='last_name'
                                type="text"
                                id="last_name"
                                className="form-control th"
                                value={regisData.last_name}
                                onChange={handleInputChange}
                            />
                            {errors.last_name && <div className="text-danger mt-2 th">{errors.last_name}</div>}
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
                            <input
                                name='phone'
                                type="tel"
                                id="phone"
                                className="form-control th"
                                value={regisData.phone}
                                minLength={10}
                                maxLength={10}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <div className="text-danger mt-2 th">{errors.phone}</div>}
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input
                                name='email'
                                type="email"
                                id="email"
                                className="form-control th"
                                value={regisData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <div className="text-danger mt-2 th">{errors.email}</div>}
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="password" className="form-label th">รหัสผ่าน</label>
                            <input
                                name='password'
                                type="password"
                                id="password"
                                className="form-control th"
                                value={regisData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <div className="text-danger mt-2 th">{errors.password}</div>}
                        </Col>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="CFpassword" className="form-label th">ยืนยันรหัสผ่าน</label>
                            <input
                                name='CFpassword'
                                type="password"
                                id="CFpassword"
                                className="form-control th"
                                value={regisData.CFpassword}
                                onChange={handleInputChange}
                            />
                            {errors.CFpassword && <div className="text-danger mt-2 th">{errors.CFpassword}</div>}
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Submit Button */}
            <Row>
                <Col className='justify-content-center'>
                    <Button className="btn-xl th" onClick={registerUser}>สมัครสมาชิก</Button>
                </Col>
            </Row>

        </Container>
    );
};

export default Register;
