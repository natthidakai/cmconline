import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Container, Row, Col, Button } from "react-bootstrap";

import Loading from './components/loading';
import { useFormValidation } from "./hooks/useFormValidation";

const Profile = () => {

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const { isDateWithinLast10Years } = useFormValidation();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // ดึง token จาก localStorage
            if (!token) {
                router.push('/login'); // ถ้าไม่มี token ให้ redirect ไปที่หน้า login
                return;
            }

            try {
                const response = await fetch('/api/getUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // ส่ง token ไปกับ headers
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const usersData = await response.json();
                setUser(usersData); // สมมติว่า setUser เป็น object
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
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    // ตรวจสอบว่าผู้ใช้มีข้อมูลหรือไม่
    if (typeof user !== 'object') {
        return <div>ไม่พบข้อมูลผู้ใช้</div>;
    }

    const saveUserData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Failed to save user data');
            }

            alert('ข้อมูลถูกบันทึกเรียบร้อย');
            router.push('/profile')
        } catch (error) {
            console.error('Error saving user data:', error);
            // alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);

        if (checked) {
            // ตั้งค่า address ตาม current_address
            setUser(prevData => ({
                ...prevData,
                address: prevData.current_address || '',
                subdistrict: prevData.current_subdistrict || '',
                district: prevData.current_district || '',
                province: prevData.current_province || '',
                postal_code: prevData.current_postal_code || ''
            }));
        } else {
            // เคลียร์ค่าที่อยู่เมื่อไม่เลือก
            setUser(prevData => ({
                ...prevData,
                address: '',
                subdistrict: '',
                district: '',
                province: '',
                postal_code: ''
            }));
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="7" xl="6" lg="6" md="8" sm="10" xs="10">
                    <h3 className="th px-3 center mb-4">ข้อมูลของฉัน</h3>

                    {loading ? (
                        <Loading />
                    ) : (<Row className="box-step-3 p-5 box-shadow">
                        <h5 className='th mb-4'>ข้อมูลส่วนบุคคล</h5>

                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="first_name" className="form-label th">ชื่อ</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="form-control th"
                                value={user.first_name || ''}
                                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="last_name" className="form-label th">นามสกุล</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="form-control th"
                                value={user.last_name || ''}
                                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="email" className="form-label th">อีเมล</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                className="form-control th"
                                value={user.email || ''}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .replace(/[\u0E00-\u0E7F]/g, '') // ลบตัวอักษรภาษาไทย
                                        .replace(/[^a-zA-Z0-9@._-]/g, ''); // ยอมให้เฉพาะตัวเลข, ตัวอักษรภาษาอังกฤษ, @, ., - และ _

                                    // อัปเดต user.email ไม่ต้องมีการตรวจสอบอีเมล
                                    setUser({ ...user, email: value });
                                }}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="phone" className="form-label th">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-control th"
                                value={user.phone || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // กรองเฉพาะตัวเลข
                                    setUser({ ...user, phone: value });
                                }}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="id_card" className="form-label th">เลขบัตรประชาชน</label>
                            <input
                                type="text"
                                id="id_card"
                                name="id_card"
                                className="form-control th"
                                value={user.id_card || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // กรองเฉพาะตัวเลข
                                    setUser({ ...user, id_card: value });
                                }}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="birth_date" className="form-label th">วันเกิด</label>
                            <input
                                type="date"
                                id="birth_date"
                                name="birth_date"
                                className="form-control th"
                                value={user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '' }
                                onChange={(e) => setUser({ ...user, birth_date: e.target.value })}
                            />

                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="nationality" className="form-label th">สัญชาติ</label>
                            <input
                                type="text"
                                id="nationality"
                                name="nationality"
                                className="form-control th"
                                value={user.nationality || ''}
                                onChange={(e) => setUser({ ...user, nationality: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="marital_status" className="form-label th">สถานะภาพ</label>
                            <select
                                className="status form-select th"
                                aria-label="marital_status"
                                id="marital_status"
                                name="marital_status"  // เพิ่ม name attribute เพื่อให้ฟอร์มรู้ว่าค่าใน select นี้ควรถูกส่งเป็น status
                                value={user.marital_status || ''}
                                onChange={(e) => setUser({ ...user, marital_status: e.target.value })}
                            >
                                {/* <option value="" defaultValue>-- กรุณาเลือก --</option> */}
                                <option value="โสด">โสด</option>
                                <option value="สมรส">สมรส</option>
                                <option value="หย่า">หย่า</option>
                                <option value="หม้าย">หม้าย</option>
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                            </select>
                        </Col>

                        <hr className='my-5' />

                        <h5 className='th mb-4'>ที่อยู่ปัจจุบัน</h5>
                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="current_address" className="form-label th">ที่อยู่</label>
                            <input
                                type="text"
                                id="current_address"
                                name="current_address"
                                className="form-control th"
                                value={user.current_address || ''}
                                onChange={(e) => setUser({ ...user, current_address: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="current_subdistrict" className="form-label th">แขวง/ตำบล</label>
                            <input
                                type="text"
                                id="current_subdistrict"
                                name="current_subdistrict"
                                className="form-control th"
                                value={user.current_subdistrict || ''}
                                onChange={(e) => setUser({ ...user, current_subdistrict: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="current_district" className="form-label th">เขต/อำเภอ</label>
                            <input
                                type="text"
                                id="current_district"
                                name="current_district"
                                className="form-control th"
                                value={user.current_district || ''}
                                onChange={(e) => setUser({ ...user, current_district: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="current_province" className="form-label th">จังหวัด</label>
                            <input
                                type="text"
                                id="current_province"
                                name="current_province"
                                className="form-control th"
                                value={user.current_province || ''}
                                onChange={(e) => setUser({ ...user, current_province: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="current_postal_code" className="form-label th">รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                id="current_postal_code"
                                name="current_postal_code"
                                className="form-control th"
                                minLength={5}
                                max={5}
                                value={user.current_postal_code || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // กรองเฉพาะตัวเลข
                                    setUser({ ...user, current_postal_code: value });
                                }}
                            />
                        </Col>

                        <hr className='my-5' />

                        <Row>
                            <Col><h5 className='th'>ที่อยู่ตามทะเบียนบ้าน</h5></Col>
                            <Col className='sameAddressCheckbox'>
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    id="sameAddressCheckbox"
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="sameAddressCheckbox" className="form-label th m-0 pl-1">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
                            </Col>
                        </Row>
                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="address" className="form-label th">ที่อยู่</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-control th"
                                value={user.address || ''}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="subdistrict" className="form-label th">แขวง/ตำบล</label>
                            <input
                                type="text"
                                id="subdistrict"
                                name="subdistrict"
                                className="form-control th"
                                value={user.subdistrict || ''}
                                onChange={(e) => setUser({ ...user, subdistrict: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="district" className="form-label th">เขต/อำเภอ</label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                className="form-control th"
                                value={user.district || ''}
                                onChange={(e) => setUser({ ...user, district: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="province" className="form-label th">จังหวัด</label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                className="form-control th"
                                value={user.province || ''}
                                onChange={(e) => setUser({ ...user, province: e.target.value })}
                            />
                        </Col>
                        <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                            <label htmlFor="postal_code" className="form-label th">รหัสไปรษณีย์</label>
                            <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                className="form-control th"
                                minLength={5}
                                max={5}
                                value={user.postal_code || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ''); // กรองเฉพาะตัวเลข
                                    setUser({ ...user, postal_code: value });
                                }}
                            />
                        </Col>

                        <Col className="justify-content-center">
                            <Button className="btn-xl th" onClick={saveUserData}>
                                บันทึกข้อมูล
                            </Button>
                        </Col>
                    </Row>)}

                </Col>
            </Row>
        </Container>

    );

};

export default Profile;
