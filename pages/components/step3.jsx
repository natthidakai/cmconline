import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormValidation } from '../hooks/useFormValidation';


const Step3 = () => {

    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;

    const [loading, setLoading] = useState(true);
    const {errors, validateForm } = useFormValidation();
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
        projectID: '',
        unitNumber: ''
    });

    const [showAddressSection, setShowAddressSection] = useState(false);
    const [isSameAddress, setIsSameAddress] = useState(false);

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
                return value && value.length === 13; // ตรวจสอบความยาว id_card
            } else if (field === "phone") {
                return value && value.length === 10; // ตรวจสอบความยาว phone
            } else {
                return value && value.trim() !== ''; // ตรวจสอบให้แน่ใจว่าไม่ว่างเปล่า
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
            checkFormPersonal(updatedUser); // ตรวจสอบฟิลด์หลังจากการอัปเดต
            return updatedUser;
        });
    };

    useEffect(() => {
        // อัปเดตสถานะผู้ใช้เมื่อค่าจาก router.query มีให้ใช้งาน
        if (projectID && unitNumber) {
            setUser(prevUser => ({
                ...prevUser,
                projectID: projectID,
                unitNumber: unitNumber
            }));
        }
    }, [projectID, unitNumber]);

    // ตรวจสอบฟิลด์ที่จำเป็นหลังจากการเปลี่ยนแปลง user
    useEffect(() => {
        checkFormPersonal(user); // ส่ง user เข้าไปใน checkFormPersonal
    }, [user]); // ตรวจสอบทุกครั้งเมื่อ user เปลี่ยนแปลง


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

    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div>เกิดข้อผิดพลาด: {error}</div>;
    }

    if (!user) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    if (typeof user !== 'object') {
        return <div>ไม่พบข้อมูลผู้ใช้</div>;
    }

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setIsSameAddress(checked);

        // If the checkbox is checked, optionally set address fields to the current address
        if (checked) {
            setUser((prevUser) => ({
                ...prevUser,
                address: prevUser.current_address,
                subdistrict: prevUser.current_subdistrict,
                district: prevUser.current_district,
                province: prevUser.current_province,
                postal_code: prevUser.current_postal_code,
            }));
        } else {
            // Clear the fields if checkbox is unchecked
            setUser((prevUser) => ({
                ...prevUser,
                address: '',
                subdistrict: '',
                district: '',
                province: '',
                postal_code: '',
            }));
        }
    };

    const submitRegister = async (e) => {
        e.preventDefault();

        if (!user.member_id) {
            console.error('Member ID is missing');
            return;
        }

        const isValid = validateForm(user, showAddressSection);

        if (isValid) {
            try {
                console.log("Form Data Being Sent:", user);

                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    router.push(`/step/4?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`);
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
                    const errorData = await response.json();
                    console.error('Failed to book', errorData); // ตรวจสอบข้อมูลข้อผิดพลาด
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
            {user.member_id}
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            <Row className='justify-content-center'>
                <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
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

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="first_name" className="form-label th">ชื่อ</label>
                            <input
                                name="first_name" // แก้ไข name ให้ตรง
                                type="text"
                                id="first_name" // แก้ไข id ให้ตรง
                                className="form-control th"
                                aria-describedby="first_name"
                                value={user.first_name || ''}
                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                required
                            />
                            {errors.first_name && <div className="text-danger th mt-2">{errors.first_name}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="last_name" className="form-label th">นามสกุล</label>
                            <input
                                name="last_name" // แก้ไข name ให้ตรง
                                type="text"
                                id="last_name" // แก้ไข id ให้ตรง
                                className="form-control th"
                                aria-describedby="last_name"
                                value={user.last_name || ''}
                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                required
                            />
                            {errors.last_name && <div className="text-danger th mt-2">{errors.last_name}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
                            <input
                                name='phone'
                                type="tel"
                                id="phone"
                                className="form-control th"
                                aria-describedby="phone"
                                minLength={10}
                                maxLength={10}
                                value={user.phone || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('phone', value); // เรียกใช้งานฟังก์ชัน handleInputChange พร้อมค่าที่ถูกต้อง
                                }}
                                required
                            />
                            {errors.phone && <div className="text-danger th mt-2">{errors.phone}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input
                                name='email'
                                type="email"
                                id="email"
                                className="form-control th"
                                aria-describedby="email"
                                value={user.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="text-danger th mt-2">{errors.email}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="id_card" className="form-label th">หมายเลขบัตรประชาชน</label>
                            <input
                                name='id_card' // แก้ไข name ให้ตรง
                                type="text"
                                id="id_card" // แก้ไข id ให้ตรง
                                className="form-control th"
                                aria-describedby="id_card"
                                minLength={13}
                                maxLength={13}
                                value={user.id_card || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('id_card', value);
                                }}
                                required
                            />
                            {errors.id_card && <div className="text-danger th mt-2">{errors.id_card}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="birth_date" className="form-label th">วันเกิด</label>
                            <input
                                name='birth_date'
                                type="date"
                                id="birth_date"
                                className="form-control th"
                                aria-describedby="birth_date"
                                value={user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                required
                            />
                            {errors.birth_date && <div className="text-danger th mt-2">{errors.birth_date}</div>}
                        </Col>

                        <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                            <label htmlFor="nationality" className="form-label th">สัญชาติ</label>
                            <input
                                name='nationality'
                                type="text"
                                id="nationality"
                                className="form-control th"
                                aria-describedby="nationality"
                                value={user.nationality || ''}
                                onChange={(e) => handleInputChange('nationality', e.target.value)}
                                required
                            />
                            {errors.nationality && <div className="text-danger th mt-2">{errors.nationality}</div>}
                        </Col>

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
                    <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
                        <Row>
                            <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                <h5 className='th'>ที่อยู่ปัจจุบัน</h5>
                                <Row className='box-step-3 mb-5'>
                                    <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_address" className="form-label th">ที่อยู่</label>
                                        <input
                                            name="current_address"
                                            type="text"
                                            id="current_address"
                                            className="form-control th"
                                            aria-describedby="current_address"
                                            value={user.current_address || ''}
                                            onChange={(e) => setUser({ ...user, current_address: e.target.value })}
                                            required
                                        />
                                        {errors.current_address && <div className="text-danger th mt-2">{errors.current_address}</div>}
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_subdistrict" className="form-label th">แขวง/ตำบล</label>
                                        <input
                                            name="current_subdistrict"
                                            type="text"
                                            id="current_subdistrict"
                                            className="form-control th"
                                            aria-describedby="current_subdistrict"
                                            value={user.current_subdistrict || ''}
                                            onChange={(e) => setUser({ ...user, current_subdistrict: e.target.value })}
                                            required
                                        />
                                        {errors.current_subdistrict && <div className="text-danger th mt-2">{errors.current_subdistrict}</div>}
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_district" className="form-label th">เขต/อำเภอ</label>
                                        <input
                                            name="current_district"
                                            type="text"
                                            id="current_district"
                                            className="form-control th"
                                            aria-describedby="current_district"
                                            value={user.current_district || ''}
                                            onChange={(e) => setUser({ ...user, current_district: e.target.value })}
                                            required
                                        />
                                        {errors.current_district && <div className="text-danger th mt-2">{errors.current_district}</div>}
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_province" className="form-label th">จังหวัด</label>
                                        <input
                                            name="current_province"
                                            type="text"
                                            id="current_province"
                                            className="form-control th"
                                            aria-describedby="current_province"
                                            value={user.current_province || ''}
                                            onChange={(e) => setUser({ ...user, current_province: e.target.value })}
                                            required
                                        />
                                        {errors.current_province && <div className="text-danger th mt-2">{errors.current_province}</div>}
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_postal_code" className="form-label th">รหัสไปรษณีย์</label>
                                        <input
                                            name="current_postal_code"
                                            type="text"
                                            id="current_postal_code"
                                            className="form-control th"
                                            aria-describedby="current_postal_code"
                                            value={user.current_postal_code || ''}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setUser({ ...user, current_postal_code: value });
                                            }}
                                            minLength={5}
                                            maxLength={5}
                                            required
                                        />
                                        {errors.current_postal_code && <div className="text-danger th mt-2">{errors.current_postal_code}</div>}
                                    </Col>
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
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor="sameAddressCheckbox" className="form-label th m-0 pl-1">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
                                    </Col>
                                </Row>

                                {!isSameAddress && (
                                    <Row className='box-step-3 mb-5'>
                                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="address" className="form-label th">ที่อยู่</label>
                                            <input
                                                name="address"
                                                type="text"
                                                id="address"
                                                className="form-control th"
                                                aria-describedby="address"
                                                value={user.address || ''}
                                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                                required
                                            />
                                            {errors.address && <div className="text-danger th mt-2">{errors.address}</div>}
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="subdistrict" className="form-label th">แขวง/ตำบล</label>
                                            <input
                                                name="subdistrict"
                                                type="text"
                                                id="subdistrict"
                                                className="form-control th"
                                                aria-describedby="subdistrict"
                                                value={user.subdistrict || ''}
                                                onChange={(e) => setUser({ ...user, subdistrict: e.target.value })}
                                                required
                                            />
                                            {errors.subdistrict && <div className="text-danger th mt-2">{errors.subdistrict}</div>}
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="district" className="form-label th">เขต/อำเภอ</label>
                                            <input
                                                name="district"
                                                type="text"
                                                id="district"
                                                className="form-control th"
                                                aria-describedby="district"
                                                value={user.district || ''}
                                                onChange={(e) => setUser({ ...user, district: e.target.value })}
                                                required
                                            />
                                            {errors.districts && <div className="text-danger th mt-2">{errors.districts}</div>}
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="province" className="form-label th">จังหวัด</label>
                                            <input
                                                name="province"
                                                type="text"
                                                id="province"
                                                className="form-control th"
                                                aria-describedby="province"
                                                value={user.province || ''}
                                                onChange={(e) => setUser({ ...user, province: e.target.value })}
                                                required
                                            />
                                            {errors.provinces && <div className="text-danger th mt-2">{errors.provinces}</div>}
                                        </Col>

                                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                            <label htmlFor="postal_code" className="form-label th">รหัสไปรษณีย์</label>
                                            <input
                                                name="postal_code"
                                                type="text"
                                                id="postal_code"
                                                className="form-control th"
                                                aria-describedby="postal_code"
                                                value={user.postal_code || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    setUser({ ...user, postal_code: value })
                                                }}
                                                minLength={5}
                                                maxLength={5}
                                                required
                                            />
                                            {errors.postal_code && <div className="text-danger th mt-2">{errors.postal_code}</div>}
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