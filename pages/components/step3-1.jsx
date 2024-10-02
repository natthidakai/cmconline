import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";

import { useFetchUser } from '../hooks/useFetchUser'
import { useSignUp } from '../hooks/useSignUp';

import Loading from './loading'

const Step3 = ({ initialUserData }) => {

    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;
    const [loading, setLoading] = useState(true);
    const { errors, isSameAddress, handleCheckboxChange, submitBooking, user, setUser } = useSignUp();

    const fetchedData = useFetchUser();
    const { user: fetchedUser = {}, error } = fetchedData || {};
    const [userData, setUserData] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [showAddressSection, setShowAddressSection] = useState(false);


    useEffect(() => {
        if (projectID && unitNumber) {
            setUser(prevUser => ({
                ...prevUser,
                projectID,
                unitNumber
            }));
        }
    }, [projectID, unitNumber]);

    useEffect(() => {
        if (fetchedUser && Object.keys(fetchedUser).length > 0) {
            setUser(fetchedUser);
        }
        setLoading(false);

        if (error) {
            console.error('Error fetching user:', error);
        }
    }, [fetchedUser, error, setUser]);

    const handleSubmit = (e) => {
        submitBooking(e, projectID, unitNumber, showAddressSection, floorName, towerName);
    };

    const checkFormPersonal = (userData) => {
        const requiredFields = [
            "title",
            "first_name",
            "last_name",
            "phone",
            "email",
            "id_card",
            "birth_date",
            "nationality",
            "marital_status",
        ];

        const allRequiredFieldsFilled = requiredFields.every((field) => {
            const value = userData[field];
            if (field === "id_card") {
                return value && value.length === 13; // Validate id_card length
            } else if (field === "phone") {
                return value && value.length === 10; // Validate phone length
            } else {
                return value && value.trim() !== ''; // Ensure the field is not empty
            }
        });

        setShowAddressSection(allRequiredFieldsFilled);
    };

    const handleInputChange = (field, value) => {
        setUser((prevUser) => {
            const updatedUser = {
                ...prevUser,
                [field]: value,
            };
            checkFormPersonal(updatedUser); // Check form after update
            return updatedUser;
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (status === 'unauthenticated') {
        return (
            <div>
                <p>Please log in to access this page.</p>
                {/* Link to login page */}
            </div>
        );
    }

    if (error) {
        return <div>เกิดข้อผิดพลาด: {error}</div>;
    }
    
    return (
        <Container className='py-5'>
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            {loading ? (
                <Loading />
            ) : (
                <Row className='justify-content-center'>
                    <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                        <h5 className='th'>ข้อมูลส่วนบุคคล</h5>

                        <Row className='box-step-3 mb-5'>
                        {/* Map through fields to generate input elements */}
                        {[
                            { label: 'คำนำหน้าชื่อ', id: 'title', type: 'select', options: ['-- กรุณาเลือก --', 'นาย', 'นาง', 'นางสาว'], value: user.title },
                            { label: 'ชื่อ', id: 'first_name', type: 'text', value: user.first_name },
                            { label: 'นามสกุล', id: 'last_name', type: 'text', value: user.last_name },
                            { label: 'อีเมล', id: 'email', type: 'text', value: user.email },
                            { label: 'เบอร์โทรศัพท์', id: 'phone', type: 'text', value: user.phone },
                            { label: 'เลขบัตรประชาชน', id: 'id_card', type: 'text', value: user.id_card },
                            { label: 'วันเกิด', id: 'birth_date', type: 'date', value: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '' },
                            { label: 'สัญชาติ', id: 'nationality', type: 'text', value: user.nationality },
                            { label: 'สถานะภาพ', id: 'marital_status', type: 'select', options: ['-- กรุณาเลือก --', 'โสด', 'สมรส', 'หย่า', 'หม้าย', 'ไม่ระบุ'], value: user.marital_status },
                        ].map(({ label, id, type, options, value }) => (
                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4' key={id}>
                                <label htmlFor={id} className="form-label th">{label}</label>
                                {type === 'select' ? (
                                    <select
                                        className="form-select th"
                                        id={id}
                                        value={value || ''}
                                        onChange={(e) => handleInputChange(id, e.target.value)}
                                        required
                                    >
                                        {options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        id={id}
                                        className="form-control th"
                                        value={value || ''}
                                        onChange={(e) => {
                                            let newValue = e.target.value; // เริ่มต้นด้วยค่าปกติ

                                            // การกรองค่า
                                            if (id === 'email') {
                                                newValue = newValue.replace(/[\u0E00-\u0E7F]/g, '').replace(/[^a-zA-Z0-9@._-]/g, '');
                                            } else if (id === 'phone') {
                                                newValue = newValue.replace(/\D/g, '').slice(0, 10); // จำกัดจำนวนตัวอักษรเป็น 5 ตัว
                                            } else if (id === 'id_card') {
                                                newValue = newValue.replace(/\D/g, '').slice(0, 13); // จำกัดจำนวนตัวอักษรเป็น 13 ตัว
                                            }

                                            // เรียกใช้ handleInputChange ด้วย field และ value
                                            handleInputChange(id, newValue); // อัปเดตเรียกใช้ที่นี่
                                        }}
                                    />
                                )}
                                {errors[id] && <div className="text-danger th mt-2">{errors[id]}</div>}
                            </Col>
                        ))}
                    </Row>
                    </Col>

                    {showAddressSection && (
                        <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                            <Row>
                                <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                    <h5 className='th'>ที่อยู่ปัจจุบัน</h5>
                                    <Row className='box-step-3 mb-5'>
                                        {[
                                            { label: 'ที่อยู่', id: 'current_address', isFullWidth: true },
                                            { label: 'แขวง/ตำบล', id: 'current_subdistrict' },
                                            { label: 'เขต/อำเภอ', id: 'current_district' },
                                            { label: 'จังหวัด', id: 'current_province' },
                                            { label: 'รหัสไปรษณีย์', id: 'current_postal_code' },
                                        ].map(({ label, id, isFullWidth }) => (
                                            <Col key={id} xxl={isFullWidth ? "12" : "6"} xl={isFullWidth ? "12" : "6"} lg={isFullWidth ? "12" : "6"} md={isFullWidth ? "12" : "6"} sm="12" xs="12" className="mb-4">
                                                <label htmlFor={id} className="form-label th">{label}</label>
                                                <input
                                                    type="text"
                                                    id={id}
                                                    name={id}
                                                    className="form-control th"
                                                    value={user[id] || ''}
                                                    onChange={(e) => {
                                                        let newValue = e.target.value; // เริ่มต้นด้วยค่าปกติ

                                                        // กรองค่าตามฟิลด์
                                                        if (id === 'current_postal_code') {
                                                            newValue = newValue.replace(/\D/g, '').slice(0, 5); // กรองเฉพาะตัวเลขสำหรับรหัสไปรษณีย์
                                                        }

                                                        // อัปเดตสถานะของ user
                                                        setUser({ ...user, [id]: newValue });
                                                    }}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>

                                <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                    <Row>
                                        <Col><h5 className='th'>ที่อยู่ตามทะเบียนบ้าน</h5></Col>
                                        <Col className='sameAddressCheckbox'>
                                            <input
                                                className="form-check-input mt-0"
                                                type="checkbox"
                                                id="sameAddressCheckbox"
                                                checked={isSameAddress}
                                                onChange={handleCheckboxChange(setUser)}
                                            />
                                            <label htmlFor="sameAddressCheckbox" className="form-label th m-0 pl-1">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
                                        </Col>
                                    </Row>

                                    {!isSameAddress && (
                                        <Row className='box-step-3 mb-5'>
                                            {[
                                                { label: 'ที่อยู่', id: 'address', isFullWidth: true },
                                                { label: 'แขวง/ตำบล', id: 'subdistrict' },
                                                { label: 'เขต/อำเภอ', id: 'district' },
                                                { label: 'จังหวัด', id: 'province' },
                                                { label: 'รหัสไปรษณีย์', id: 'postal_code' },
                                            ].map(({ label, id, isFullWidth }) => (
                                                <Col key={id} xxl={isFullWidth ? "12" : "6"} xl={isFullWidth ? "12" : "6"} lg={isFullWidth ? "12" : "6"} md={isFullWidth ? "12" : "6"} sm="12" xs="12" className="mb-4">
                                                    <label htmlFor={id} className="form-label th">{label}</label>
                                                    <input
                                                        type="text"
                                                        id={id}
                                                        name={id}
                                                        className="form-control th"
                                                        value={user[id] || ''}
                                                        onChange={(e) => {
                                                            let newValue = e.target.value; // เริ่มต้นด้วยค่าปกติ

                                                            // กรองค่าตามฟิลด์
                                                            if (id === 'postal_code') {
                                                                newValue = newValue.replace(/\D/g, '').slice(0, 5); // กรองเฉพาะตัวเลขสำหรับรหัสไปรษณีย์
                                                            }

                                                            // อัปเดตสถานะของ user
                                                            setUser({ ...user, [id]: newValue });
                                                        }}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    )}

                    {/* Submit Button */}
                    <Row>
                        <Col className='justify-content-center'>
                            <Button className="btn-xl th" onClick={handleSubmit}>ลงทะเบียนจอง</Button>
                        </Col>
                    </Row>
                </Row>
            )}

        </Container>
    );
};

export default Step3;