import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "./components/loading";
import { Container, Row, Col } from "react-bootstrap";
import { useSignUp } from './hooks/useSignUp';

const Profile = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { handleInputChange, formData, handleCheckboxChange } = useSignUp();
    const [isSameAddress, setIsSameAddress] = useState(false);

    useEffect(() => {
        if (status === "loading") {
            setLoading(true);
        } else if (status === "unauthenticated") {
            router.push("/signin");
        } else if (session) {
            setLoading(false);
            // อัปเดต formData แค่เมื่อ session.user เปลี่ยน
            setFormData(prev => ({
                ...prev,
                title: session.user.title || '',
                first_name: session.user.first_name || '',
                last_name: session.user.last_name || '',
                email: session.user.email || '',
                phone: session.user.phone || '',
                id_card: session.user.id_card || '',
                birth_date: session.user.birth_date || '',
                nationality: session.user.nationality || '',
                current_address: session.user.current_address || '',
                current_subdistrict: session.user.current_subdistrict || '',
                current_district: session.user.current_district || '',
                current_province: session.user.current_province || '',
                current_postal_code: session.user.current_postal_code || '',
                address: session.user.address || '',
                subdistrict: session.user.subdistrict || '',
                district: session.user.district || '',
                province: session.user.province || '',
                postal_code: session.user.postal_code || ''
            }));
        }
    }, [status, session, router]);

    useEffect(() => {
        console.log("Session data:", session);
        // ... รหัสที่เหลือ
    }, [status, session]);

    useEffect(() => {
        if (session) {
            const userData = {
                // ... ค่าต่างๆ
                postal_code: session.user.postal_code || ''
            };
            setUser(userData); // อัพเดตค่า user
            setFormData(userData); // อัพเดตค่า formData
        }
    }, [session]);

    const setFormData = (newData) => {
        handleInputChange(newData); // ปรับให้ตรงกับการใช้งาน
    };

    if (loading) {
        return <Loading />;
    }

    const formFieldsPersonal = [
        { label: 'คำนำหน้าชื่อ', id: 'title', type: 'select', options: ['-- กรุณาเลือก --', 'นาย', 'นาง', 'นางสาว'], value: formData.title },
        { label: 'ชื่อ', id: 'first_name', type: 'text', value: formData.first_name },
        { label: 'นามสกุล', id: 'last_name', type: 'text', value: formData.last_name },
        { label: 'อีเมล', id: 'email', type: 'text', value: formData.email },
        { label: 'เบอร์โทรศัพท์', id: 'phone', type: 'text', value: formData.phone },
        { label: 'เลขบัตรประชาชน', id: 'id_card', type: 'text', value: formData.id_card },
        { label: 'วันเกิด', id: 'birth_date', type: 'date', value: formData.birth_date },
        { label: 'สัญชาติ', id: 'nationality', type: 'text', value: formData.nationality },
    ];

    const formFieldsCurrentAddress = [
        { label: 'ที่อยู่', id: 'current_address', type: 'text', value: formData.current_address, isFullWidth: true },
        { label: 'แขวง/ตำบล', id: 'current_subdistrict', type: 'text', value: formData.current_subdistrict },
        { label: 'เขต/อำเภอ', id: 'current_district', type: 'text', value: formData.current_district },
        { label: 'จังหวัด', id: 'current_province', type: 'text', value: formData.current_province },
        { label: 'รหัสไปรษณีย์', id: 'current_postal_code', type: 'text', value: formData.current_postal_code },
    ];

    const formFieldsAddress = [
        { label: 'ที่อยู่', id: 'address', type: 'text', value: formData.address, isFullWidth: true },
        { label: 'แขวง/ตำบล', id: 'subdistrict', type: 'text', value: formData.subdistrict },
        { label: 'เขต/อำเภอ', id: 'district', type: 'text', value: formData.district },
        { label: 'จังหวัด', id: 'province', type: 'text', value: formData.province },
        { label: 'รหัสไปรษณีย์', id: 'postal_code', type: 'text', value: formData.postal_code },
    ];

    return (
        <Container className="py-5">
            {session.user.title}
            <Row className="justify-content-center">
                <Col xxl="7" xl="6" lg="8" md="10" sm="10" xs="10">
                    <h3 className="th px-3 center mb-4">ข้อมูลของฉัน</h3>
                    <Row className="box-step-3 px-3 py-5 box-shadow">
                        <h5 className='th mb-4'>ข้อมูลส่วนบุคคล</h5>
                        {formFieldsPersonal.map(({ label, id, type, options }) => (
                            <Col key={id} xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className="mb-4">
                                <label htmlFor={id} className="form-label th">{label}</label>
                                {type === 'select' ? (
                                    <select
                                        className="form-select th"
                                        id={id}
                                        value={formData[id] || ''}
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
                                        name={id}
                                        className="form-control th"
                                        value={formData[id] || ''}
                                        onChange={(e) => handleInputChange(id, e.target.value)}
                                    />
                                )}
                            </Col>
                        ))}

                        <hr className='my-5' />

                        <h5 className='th mb-4'>ที่อยู่ปัจจุบัน</h5>
                        {formFieldsCurrentAddress.map(({ label, id, type, isFullWidth }) => (
                            <Col key={id} xxl={isFullWidth ? "12" : "6"} xl={isFullWidth ? "12" : "6"} lg={isFullWidth ? "12" : "6"} md={isFullWidth ? "12" : "6"} sm="12" xs="12" className="mb-4">
                                <label htmlFor={id} className="form-label th">{label}</label>
                                <input
                                    type={type}
                                    id={id}
                                    name={id}
                                    className="form-control th"
                                    value={formData[id] || ''}
                                    onChange={(e) => handleInputChange(id, e.target.value)}
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
                                    onChange={handleCheckboxChange(setIsSameAddress)} // ปรับให้ตรงกับ handleCheckboxChange
                                />
                                <label htmlFor="sameAddressCheckbox" className="form-label th m-0 pl-1">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
                            </Col>
                        </Row>
                        {formFieldsAddress.map(({ label, id, type, isFullWidth }) => (
                            <Col key={id} xxl={isFullWidth ? "12" : "6"} xl={isFullWidth ? "12" : "6"} lg={isFullWidth ? "12" : "6"} md={isFullWidth ? "12" : "6"} sm="12" xs="12" className="mb-4">
                                <label htmlFor={id} className="form-label th">{label}</label>
                                <input
                                    type={type}
                                    id={id}
                                    name={id}
                                    className="form-control th"
                                    value={isSameAddress ? formData.current_address || '' : formData[id] || ''}
                                    onChange={(e) => handleInputChange(id, e.target.value)}
                                    disabled={isSameAddress} // ปิดใช้งานถ้าติ๊ก Checkbox
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
