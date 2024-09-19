import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import 'react-datepicker/dist/react-datepicker.css';
import { useFormValidation } from '../hooks/useFormValidation';
const connection = require('../../connect/conn');

const Step3 = () => {
    const router = useRouter();
    const { projectID, selectedFloor, selectedTower, unitNumber } = router.query;

    // State for form fields
    const [formData, setFormData] = useState({
        namesTitle: '',
        fname: '',
        lname: '',
        phone: '',
        email: '',
        idCard: '',
        birthday: '',
        nationality: '',
        status: '',
        address1: '',
        subdistrict1: '',
        districts1: '',
        provinces1: '',
        postalCode1: '',
        address2: '',
        subdistrict2: '',
        districts2: '',
        provinces2: '',
        postalCode2: ''
    });

    const { errors, validateForm } = useFormValidation();
    const [showAddressSection, setShowAddressSection] = useState(false);
    const [isSameAddress, setIsSameAddress] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let filteredValue = value;
        if (name === 'idCard' || name === 'phone') {
            filteredValue = value.replace(/\D/g, '');
        } else if (name === 'email') {
            // กรองตัวอักษรภาษาไทยออกจากอีเมล
            filteredValue = value.replace(/[\u0E00-\u0E7F]/g, '');
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: filteredValue
        }));
    };

    const submitRegister = (e) => {
        e.preventDefault();
        if (validateForm(formData)) {
            console.log('Form is valid, submitting...', formData);
        }
    };

    const checkFormPersonal = () => {
        const requiredFields = ['namesTitle', 'fname', 'lname', 'phone', 'email', 'idCard', 'birthday', 'nationality', 'status'];
        const allRequiredFieldsFilled = requiredFields.every(field => formData[field]);
        setShowAddressSection(allRequiredFieldsFilled);
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);
        console.log('Checkbox checked:', checked);
    };


    useEffect(() => {
        checkFormPersonal();
    }, [formData]);

    useEffect(() => {
        if (isSameAddress) {
            setFormData(prevData => ({
                ...prevData,
                postalCode2: prevData.postalCode1
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                postalCode2: prevData.postalCode2
            }));
        }
    }, [isSameAddress, formData.postalCode1]);

    return (
        <Container className='py-5'>
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            <Row className='justify-content-center'>
                <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
                    <h5 className='th'>ข้อมูลส่วนบุคคล</h5>
                    <Row className='box-step-3 mb-5'>
                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="namesTitle" className="form-label th">คำนำหน้าชื่อ</label>
                            <Col>
                                <select
                                    className="form-select th"
                                    aria-label="namesTitle"
                                    id="namesTitle"
                                    name='namesTitle'
                                    value={formData.namesTitle}
                                    onChange={handleInputChange}
                                >
                                    <option value="" defaultValue>-- กรุณาเลือก --</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </select>
                            </Col>
                            {errors.namesTitle && <div className="text-danger th mt-2">{errors.namesTitle}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="fname" className="form-label th">ชื่อ</label>
                            <input
                                name='fname'
                                type="text"
                                id="fname"
                                className="form-control"
                                aria-describedby="fname"
                                value={formData.fname}
                                onChange={handleInputChange}
                            />
                            {errors.fname && <div className="text-danger th mt-2">{errors.fname}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="lname" className="form-label th">นามสกุล</label>
                            <input
                                name="lname"
                                type="text" id="lname"
                                className="form-control"
                                aria-describedby="lname"
                                value={formData.lname}
                                onChange={handleInputChange}
                            />
                            {errors.lname && <div className="text-danger th mt-2">{errors.lname}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
                            <input
                                name='phone'
                                type="tel"
                                id="phone"
                                className="form-control"
                                aria-describedby="phone"
                                minLength={10}
                                maxLength={10}
                                pattern="\d*"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <div className="text-danger th mt-2">{errors.phone}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input
                                name='email'
                                type="email"
                                id="email"
                                className="form-control"
                                aria-describedby="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <div className="text-danger th mt-2">{errors.email}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="idCard" className="form-label th">หมายเลขบัตรประชาชน</label>
                            <input
                                name='idCard'
                                type="text"
                                id="idCard"
                                className="form-control"
                                aria-describedby="idCard"
                                minLength={13}
                                maxLength={13}
                                value={formData.idCard}
                                onChange={handleInputChange}
                            />
                            {errors.idCard && <div className="text-danger th mt-2">{errors.idCard}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="birthday" className="form-label th">วันเกิด</label>
                            <input
                                name='birthday'
                                type="date"
                                id="birthday"
                                className="form-control"
                                aria-describedby="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                            />
                            {errors.birthday && <div className="text-danger th mt-2">{errors.birthday}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="nationality" className="form-label th">สัญชาติ</label>
                            <input
                                name='nationality'
                                type="text"
                                id="nationality"
                                className="form-control"
                                aria-describedby="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                            />
                            {errors.nationality && <div className="text-danger th mt-2">{errors.nationality}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="status" className="form-label th">สถานะภาพ</label>
                            <Col>
                                <select
                                    className="status form-select th"
                                    aria-label="status"
                                    id="status"
                                    name="status"  // เพิ่ม name attribute เพื่อให้ฟอร์มรู้ว่าค่าใน select นี้ควรถูกส่งเป็น status
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="" defaultValue>-- กรุณาเลือก --</option>
                                    <option value="โสด">โสด</option>
                                    <option value="สมรส">สมรส</option>
                                    <option value="หย่า">หย่า</option>
                                    <option value="หม้าย">หม้าย</option>
                                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                                </select>
                            </Col>
                            {errors.status && <div className="text-danger th mt-2">{errors.status}</div>}
                        </Col>
                    </Row>
                </Col>

                {/* Address Section */}
                {showAddressSection && (
                    <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
                        <Row>
                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                <h5 className='th'>ที่อยู่ปัจจุบัน</h5>
                                <Row className='box-step-3 mb-5'>
                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="address1" className="form-label th">ที่อยู่</label>
                                        <input
                                            name="address1"
                                            type="text"
                                            id="address1"
                                            className="form-control"
                                            aria-describedby="address1"
                                            value={formData.address1}
                                            onChange={handleInputChange}
                                        />
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="subdistrict1" className="form-label th">แขวง/ตำบล</label>
                                        <input
                                            name="subdistrict1"
                                            type="text"
                                            id="subdistrict1"
                                            className="form-control"
                                            aria-describedby="subdistrict1"
                                            value={formData.subdistrict1}
                                            onChange={handleInputChange}
                                        />
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="districts1" className="form-label th">เขต/อำเภอ</label>
                                        <input
                                            name="districts1"
                                            type="text"
                                            id="districts1"
                                            className="form-control"
                                            aria-describedby="districts1"
                                            value={formData.districts1}
                                            onChange={handleInputChange}
                                        />
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="provinces1" className="form-label th">จังหวัด</label>
                                        <input
                                            name="provinces1"
                                            type="text"
                                            id="provinces1"
                                            className="form-control"
                                            aria-describedby="provinces1"
                                            value={formData.provinces1}
                                            onChange={handleInputChange}
                                        />
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="postalCode1" className="form-label th">รหัสไปรษณีย์</label>
                                        <input
                                            name="postalCode1"
                                            type="text"
                                            id="postalCode1"
                                            className="form-control"
                                            aria-describedby="postalCode1"
                                            value={formData.postalCode1}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                <Row>
                                    <Col><h5 className='th'>ที่อยู่ตามทะเบียนบ้าน</h5></Col>
                                    <Col>
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            id="sameAddressCheckbox"
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="sameAddressCheckbox" className="form-label th">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
                                    </Col>
                                </Row>

                                {!isSameAddress && (
                                    <Row className='box-step-3 mb-5'>
                                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="address2" className="form-label th">ที่อยู่</label>
                                            <input
                                                name="address2"
                                                type="text"
                                                id="address2"
                                                className="form-control"
                                                aria-describedby="address2"
                                                value={formData.address2}
                                                onChange={(e) => setFormData(prevData => ({
                                                    ...prevData,
                                                    address2: e.target.value
                                                }))}
                                            />
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="subdistrict2" className="form-label th">แขวง/ตำบล</label>
                                            <input
                                                name="subdistrict2"
                                                type="text"
                                                id="subdistrict2"
                                                className="form-control"
                                                aria-describedby="subdistrict2"
                                                value={formData.subdistrict2}
                                                onChange={(e) => setFormData(prevData => ({
                                                    ...prevData,
                                                    subdistrict2: e.target.value
                                                }))}
                                            />
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="districts2" className="form-label th">เขต/อำเภอ</label>
                                            <input
                                                name="districts2"
                                                type="text"
                                                id="districts2"
                                                className="form-control"
                                                aria-describedby="districts2"
                                                value={formData.districts2}
                                                onChange={(e) => setFormData(prevData => ({
                                                    ...prevData,
                                                    districts2: e.target.value
                                                }))}
                                            />
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="provinces2" className="form-label th">จังหวัด</label>
                                            <input
                                                name="provinces2"
                                                type="text"
                                                id="provinces2"
                                                className="form-control"
                                                aria-describedby="provinces2"
                                                value={formData.provinces2}
                                                onChange={(e) => setFormData(prevData => ({
                                                    ...prevData,
                                                    provinces2: e.target.value
                                                }))}
                                            />
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="postalCode1" className="form-label th">รหัสไปรษณีย์</label>
                                            <input
                                                name="postalCode2"
                                                type="text"
                                                id="postalCode2"
                                                className="form-control"
                                                aria-describedby="postalCode2"
                                            // value={formData.postalCode1}
                                            // onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Col>
                )}

                {/* Submit Button */}
                <Row>
                    <Col className='justify-content-center'>
                        <Button className="btn-xl th" onClick={submitRegister}>ลงทะเบียนจอง</Button>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
};

export default Step3;
