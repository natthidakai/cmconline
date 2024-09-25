import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormValidation } from '../hooks/useFormValidation';
import Loading from './loading'

const Step3 = () => {

    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;

    const [loading, setLoading] = useState(true);
    const { errors, validateForm, isSameAddress, handleCheckboxChange } = useFormValidation();
    const [error, setError] = useState(null);


    // สมมติว่าคุณมีสถานะดังต่อไปนี้
    const [user, setUser] = useState({
        member_id: '',
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        id_card: '',
        birth_date: '',
        nationality: '',
        marital_status: '',
        current_address: '',
        current_subdistrict: '',
        current_district: '',
        current_province: '',
        current_postal_code: '',
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        postal_code: '',
        projectID: projectID,
        unitNumber: unitNumber
    });

    const [showAddressSection, setShowAddressSection] = useState(false);

    // ฟังก์ชันเพื่อตรวจสอบฟิลด์ที่จำเป็น
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

    useEffect(() => {
        // Update user state when router.query values are available
        if (projectID && unitNumber) {
            setUser(prevUser => ({
                ...prevUser,
                projectID: projectID,
                unitNumber: unitNumber
            }));
        }
    }, [projectID, unitNumber]);

    useEffect(() => {
        // Check form validation when user data changes
        checkFormPersonal(user);
    }, [user]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const usersData = await response.json();
                setUser(usersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    if (error) {
        return <div>เกิดข้อผิดพลาด: {error}</div>;
    }

    if (!user) {
        return <Loading />;
    }

    const submitRegister = async (e) => {
        e.preventDefault();

        if (!user.member_id) {
            console.error('Member ID is missing');
            return;
        }

        console.log("Form Data Being Sent (user):", { ...user, projectID, unitNumber });

        const isValid = validateForm(user, showAddressSection);

        if (isValid) {
            try {
                const updatedUser = {
                    ...user,
                    projectID: projectID,
                    unitNumber: unitNumber
                };

                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (response.ok) {
                    // เมื่อการจองสำเร็จ
                    router.push(`/step/4?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`);
                    // ล้างข้อมูลผู้ใช้
                    setUser({
                        title: '',
                        first_name: '',
                        last_name: '',
                        projectID: projectID,
                        unitNumber: unitNumber,
                        phone: '',
                        email: '',
                        id_card: '',
                        birth_date: '',
                        nationality: '',
                        marital_status: '',
                        current_address: '',
                        current_subdistrict: '',
                        current_district: '',
                        current_province: '',
                        current_postal_code: '',
                        address: '',
                        subdistrict: '',
                        district: '',
                        province: '',
                        postal_code: ''
                    });
                } else {
                    // จัดการกับข้อผิดพลาดเมื่อการจองไม่สำเร็จ
                    const errorData = await response.json();
                    console.error('Failed to book', errorData);

                    // ตรวจสอบว่ามีข้อมูล redirect ใน response หรือไม่
                    if (errorData.redirect) {
                        alert(errorData.alert);
                        router.push(errorData.redirect);
                    } else {
                        alert(errorData.alert); // แสดงข้อความแจ้งเตือน
                    }
                }
            } catch (error) {
                console.error('Error submitting form', error);
            }
        } else {
            console.error('Form validation failed');
        }
    };




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
                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                                <label htmlFor="title" className="form-label th">คำนำหน้าชื่อ</label>
                                <Col>
                                    <select
                                        className="form-select th"
                                        aria-label="title"
                                        id="title"
                                        name='title'
                                        value={user.title || ''}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        required
                                    >
                                        <option value="" defaultValue>-- กรุณาเลือก --</option>
                                        <option value="นาย">นาย</option>
                                        <option value="นาง">นาง</option>
                                        <option value="นางสาว">นางสาว</option>
                                    </select>
                                </Col>
                                {errors.title && <div className="text-danger th mt-2">{errors.title}</div>}
                            </Col>
                            {[
                                { label: 'ชื่อ', id: 'first_name', type: 'text', value: user.first_name || '' },
                                { label: 'นามสกุล', id: 'last_name', type: 'text', value: user.last_name || '' },
                                { label: 'อีเมล', id: 'email', type: 'text', value: user.email || '' },
                                { label: 'เบอร์โทรศัพท์', id: 'phone', type: 'text', value: user.phone || '' },
                                { label: 'เลขบัตรประชาชน', id: 'id_card', type: 'text', value: user.id_card || '' },
                                { label: 'วันเกิด', id: 'birth_date', type: 'date', value: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '' },
                                { label: 'สัญชาติ', id: 'nationality', type: 'text', value: user.nationality || '' },
                            ].map(({ label, id, type, value }) => (
                                <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4' key={id}>
                                    <label htmlFor={id} className="form-label th">{label}</label>
                                    <input
                                        type={type}
                                        id={id}
                                        name={id}
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
                                </Col>
                            ))}

                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                                <label htmlFor="marital_status" className="form-label th">สถานะภาพ</label>
                                <Col>
                                    <select
                                        className="status form-select th"
                                        aria-label="marital_status"
                                        id="marital_status"
                                        name="marital_status"
                                        value={user.marital_status || ''} // ตรวจสอบให้แน่ใจว่า user.marital_status ไม่เป็น undefined
                                        onChange={(e) => handleInputChange('marital_status', e.target.value)}
                                        required
                                    >
                                        <option value="" >-- กรุณาเลือก --</option> {/* ใช้ disabled เพื่อไม่ให้เลือก */}
                                        <option value="โสด">โสด</option>
                                        <option value="สมรส">สมรส</option>
                                        <option value="หย่า">หย่า</option>
                                        <option value="หม้าย">หม้าย</option>
                                        <option value="ไม่ระบุ">ไม่ระบุ</option>
                                    </select>
                                </Col>
                                {errors.marital_status && <div className="text-danger th mt-2">{errors.marital_status}</div>}
                            </Col>
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
                            <Button className="btn-xl th" onClick={submitRegister}>ลงทะเบียนจอง</Button>
                        </Col>
                    </Row>
                </Row>
            )}

        </Container>
    );
};

export default Step3;