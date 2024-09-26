import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import Loading from './components/loading';
import { useSignUp } from './hooks/useSignUp';
import { useSession } from 'next-auth/react';

const Profile = () => {

    const { data: session, status } = useSession();

    // Loading state while session is being checked
    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    // Redirect if user is not authenticated
    if (status === 'unauthenticated') {
        return <p>Please log in to access this page.</p>;
    }
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { isSameAddress, handleCheckboxChange, user, setUser, updateUserData } = useSignUp();
    const [errors, setErrors] = useState('');

    // Set user data from session when the component mounts
    useEffect(() => {
        if (session) {
            setUser(session.user);
        }
        setLoading(false);
    }, [session, setUser]);


    const validateForm = () => {
        setErrors('');

        if (!user.first_name) {
            setErrors('กรุณาระบุชื่อ');
            return false; 
        } else if (!user.last_name) {
            setErrors('กรุณาระบุนามสกุล');
            return false; 
        } else if (!user.email) {
            setErrors('กรุณาระบุอีเมล'); 
            return false; 
        } else if (!user.phone) {
            setErrors('กรุณาระบุหมายเลขโทรศัพท์'); 
            return false; 
        } else if (!user.id_card) {
            setErrors('กรุณาระบุหมายเลขบัตรประชาชน'); 
            return false; 
        }

        return true; 
    };
    
    const handleSubmit = () => {
        if (validateForm()) {
            updateUserData(user); // ส่ง user ที่ถูกต้อง
        }
    };

    // Show loading state until data is fetched and set
    if (loading) {
        return <Loading />;
    }

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
                            {/* Personal information fields */}
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
                                            let newValue = e.target.value;

                                            // Filtering logic for email, phone, id_card
                                            if (id === 'email') {
                                                newValue = newValue.replace(/[\u0E00-\u0E7F]/g, '').replace(/[^a-zA-Z0-9@._-]/g, '');
                                            } else if (id === 'phone') {
                                                newValue = newValue.replace(/\D/g, '').slice(0, 10); // Phone number limited to 10 digits
                                            } else if (id === 'id_card') {
                                                newValue = newValue.replace(/\D/g, '').slice(0, 13); // ID card limited to 13 digits
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
                                                ? e.target.value.replace(/\D/g, '').slice(0, 5) // Limit postal code to 5 digits
                                                : e.target.value;
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
                                    <input
                                        type="text"
                                        id={id}
                                        name={id}
                                        className="form-control th"
                                        value={user[id] || ''}
                                        onChange={(e) => {
                                            const newValue = (id === 'postal_code')
                                                ? e.target.value.replace(/\D/g, '').slice(0, 5) // Limit postal code to 5 digits
                                                : e.target.value;
                                            setUser({ ...user, [id]: newValue });
                                        }}
                                    />
                                </Col>
                            ))}
                            <div className="text-danger th mb-4 center">{errors}</div>
                            <Row>
                                <Col className="justify-content-center">
                                    <Button className="btn-xl th" onClick={handleSubmit} disabled={loading}>
                                        {loading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูล'}
                                    </Button>
                                </Col>
                            </Row>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
