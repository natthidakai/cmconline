import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from './components/loading';
import { useFormValidation } from './hooks/useFormValidation';
import { useFetchUser } from './hooks/useFetchUser';

const Profile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const { isSameAddress, handleCheckboxChange } = useFormValidation();

    const fetchedData = useFetchUser();
    const { user: fetchedUser = {}, error } = fetchedData || {};

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
            setLoading(false);
        }
        if (error) {
            console.error('Error fetching user:', error);
            setLoading(false);
        }
    }, [fetchedUser, error]);

    if (loading) {
        return <Loading />;
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
            router.push('/profile');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="7" xl="6" lg="8" md="10" sm="10" xs="10">
                    <h3 className="th px-3 center mb-4">ข้อมูลของฉัน</h3>

                    {Object.keys(user).length === 0 ? (
                        <div>ไม่พบข้อมูลผู้ใช้</div>
                    ) : (
                        <Row className="box-step-3 px-3 py-5 box-shadow">
                            <h5 className='th mb-4'>ข้อมูลส่วนบุคคล</h5>
                            {[
                                { label: 'ชื่อ', id: 'first_name', type: 'text', value: user.first_name || '' },
                                { label: 'นามสกุล', id: 'last_name', type: 'text', value: user.last_name || '' },
                                { label: 'อีเมล', id: 'email', type: 'text', value: user.email || '' },
                                { label: 'เบอร์โทรศัพท์', id: 'phone', type: 'text', value: user.phone || '' },
                                { label: 'เลขบัตรประชาชน', id: 'id_card', type: 'text', value: user.id_card || '' },
                                { label: 'วันเกิด', id: 'birth_date', type: 'date', value: user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '' },
                                { label: 'สัญชาติ', id: 'nationality', type: 'text', value: user.nationality || '' },
                            ].map(({ label, id, type, value }) => (
                                <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4" key={id}>
                                    <label htmlFor={id} className="form-label th">{label}</label>
                                    <input 
                                        type={type}
                                        id={id}
                                        name={id}
                                        className="form-control th"
                                        value={value}
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

                                            setUser({ ...user, [id]: newValue });
                                        }}
                                    />
                                </Col>
                            ))}

                            <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                                <label htmlFor="marital_status" className="form-label th">สถานะภาพ</label>
                                <select
                                    className="status form-select th"
                                    aria-label="marital_status"
                                    id="marital_status"
                                    name="marital_status"
                                    value={user.marital_status || ''}
                                    onChange={(e) => setUser({ ...user, marital_status: e.target.value })}
                                >
                                    <option value="โสด">โสด</option>
                                    <option value="สมรส">สมรส</option>
                                    <option value="หย่า">หย่า</option>
                                    <option value="หม้าย">หม้าย</option>
                                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                                </select>
                            </Col>

                            <hr className='my-5' />
                            <h5 className='th mb-4'>ที่อยู่ปัจจุบัน</h5>

                            {/* Current Address Fields */}
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
                                            const newValue = (id === 'current_postal_code')
                                                ? e.target.value.replace(/\D/g, '').slice(0, 5)// Filter for numbers for postal code only
                                                : e.target.value; // Allow normal input for other fields
                                            setUser({ ...user, [id]: newValue });
                                        }}
                                    />
                                </Col>
                            ))}


                            <hr className='my-5' />
                            <Row>
                                <Col><h5 className='mb-4 th'>ที่อยู่ตามทะเบียนบ้าน</h5></Col>
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

                            {/* Permanent Address Fields */}
                            {[
                                { label: 'ที่อยู่', id: 'address', isFullWidth: true },
                                { label: 'แขวง/ตำบล', id: 'subdistrict' },
                                { label: 'เขต/อำเภอ', id: 'district' },
                                { label: 'จังหวัด', id: 'province' },
                                { label: 'รหัสไปรษณีย์', id: 'postal_code' },
                            ].map(({ label, id, isFullWidth }) => (
                                <Col key={id} xxl={isFullWidth ? "12" : "6"} xl={isFullWidth ? "12" : "6"} lg={isFullWidth ? "12" : "6"} md={isFullWidth ? "12" : "6"} sm="12" xs="12" className="mb-4">
                                    <label htmlFor={id} className="form-label th">{label}</label>
                                    <input key={user.member_id}
                                        type="text"
                                        id={id}
                                        name={id}
                                        className="form-control th"
                                        value={user[id] || ''}
                                        onChange={(e) => {
                                            const newValue = (id === 'postal_code')
                                                ? e.target.value.replace(/\D/g, '').slice(0, 5)// Filter for numbers for postal code only
                                                : e.target.value; // Allow normal input for other fields
                                            setUser({ ...user, [id]: newValue });
                                        }}
                                    />
                                </Col>
                            ))}
                            <Row>
                                <Col className="justify-content-center">
                                    <Button className="btn-xl th" onClick={saveUserData}>บันทึกข้อมูล</Button>
                                </Col>
                            </Row>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;