import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormValidation } from '../hooks/useFormValidation';

import Loading from './loading';


const Step3 = () => {

    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;

    const { errors, validateForm } = useFormValidation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddressSection, setShowAddressSection] = useState(false);
    const [isSameAddress, setIsSameAddress] = useState(false);

    // State for form fields
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return; // ออกจากการทำงานหากไม่พบ token
            }
    
            setLoading(true);
    
            try {
                const response = await fetch("/api/getUser", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    const responseData = await response.json();
                    console.error("Failed to fetch user data:", responseData);
                    throw new Error(responseData.error || 'Failed to fetch user data');
                }
    
                const responseData = await response.json();
                setUser(responseData);
                console.log("Fetched user data:", responseData);
            } catch (err) {
                console.error('Error fetching user data:', err.message);
                // แสดงข้อความหรือจัดการข้อผิดพลาดที่เหมาะสม
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, [router]);
    

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                member_id: user.member_id || '',
                title: user.title || "",
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
                email: user.email || "",
                id_card: user.id_card || "",
                birth_date: user.birth_date || "",
                nationality: user.nationality || "",
                marital_status: user.marital_status || "",
                current_address: user.current_address || "",
                current_subdistrict: user.current_subdistrict || "",
                current_district: user.current_district || "",
                current_province: user.current_province || "",
                current_postal_code: user.current_postal_code || "",
                address: user.address || "",
                subdistrict: user.subdistrict || "",
                district: user.district || "",
                province: user.province || "",
                postal_code: user.postal_code || "",
            }));
        } else {
            console.error('User is null or undefined');
            // คุณอาจต้องการตั้งค่าฟอร์มที่เป็นค่าเริ่มต้นหรือแสดงข้อความ
            setFormData((prevData) => ({
                ...prevData,
                member_id: '', // กำหนดเป็นค่าว่างหรือตามต้องการ
                // ตั้งค่าฟิลด์อื่น ๆ เป็นค่าเริ่มต้นถ้าจำเป็น
            }));
        }
    }, [user]);

    const submitRegister = async (e) => {
        e.preventDefault();

        if (!formData.member_id) {
            console.error('Member ID is missing');
            return;
        }

        const isValid = validateForm(formData, showAddressSection);

        if (isValid) {
            try {
                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    router.push(`/step/4?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`);
                    setFormData({
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
                    console.error('Failed to book', errorData);
                }
            } catch (error) {
                console.error('Error submitting form', error);
            }
        } else {
            console.error('Form validation failed');
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);
        console.log('Checkbox checked:', checked);
    };

    const checkFormPersonal = () => {
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
            if (field === "id_card") {
                return formData[field] && formData[field].length === 13;
            }
            return formData[field];
        });

        setShowAddressSection(allRequiredFieldsFilled);
    };

    useEffect(() => {
        checkFormPersonal();
    }, [formData]);


    return (
        <Container className='py-5'>
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            <Row className='justify-content-center'>
                <Col xxl="10" xl="10" lg="10" md="11" sm="11" xs="11">
                    <h5 className='th'>ข้อมูลส่วนบุคคล</h5>
                    {projectID},{unitNumber},{user.member_id}
                    {/* {user.member_id} */}

                    {loading ? (
                        <Loading />
                    ) : (
                        <Row className='box-step-3 mb-5'>
                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                                <label htmlFor="title" className="form-label th">คำนำหน้าชื่อ</label>
                                <Col>
                                    <select
                                        className="form-select th"
                                        aria-label="title"
                                        id="title"
                                        name='title'
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                                    name="districts"
                                    type="text"
                                    id="districts"
                                    className="form-control th"
                                    aria-describedby="districts"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            first_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {errors.first_name && <div className="text-danger th mt-2">{errors.first_name}</div>}
                            </Col>

                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                                <label htmlFor="last_name" className="form-label th">นามสกุล</label>
                                <input
                                    name="last_name"
                                    type="text" id="last_name"
                                    className="form-control th"
                                    aria-describedby="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                                    value={formData.phone}
                                    onChange={(e) => {
                                        value = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, value })
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
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                {errors.email && <div className="text-danger th mt-2">{errors.email}</div>}
                            </Col>

                            <Col xxl="4" xl="4" lg="4" md="4" sm="12" xs="12" className='mb-4'>
                                <label htmlFor="id_card" className="form-label th">หมายเลขบัตรประชาชน</label>
                                <input
                                    name=' id_card'
                                    type="text"
                                    id=" id_card"
                                    className="form-control th"
                                    aria-describedby="id_card"
                                    minLength={13}
                                    maxLength={13}
                                    value={formData.id_card}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, id_card: value })
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
                                    value={formData.birth_date ? new Date(formData.birth_date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
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
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
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
                                        value={formData.marital_status} // Use formData to bind the value
                                        onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })} // Update formData state
                                        required
                                    >
                                        <option value="" defaultValue>-- กรุณาเลือก --</option>
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
                    )}
                </Col>

                {/* Address Section */}
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
                                            value={formData.current_address}
                                            onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
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
                                            value={formData.current_subdistrict}
                                            onChange={(e) => setFormData({ ...formData, current_subdistrict: e.target.value })}
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
                                            value={formData.current_district}
                                            onChange={(e) => setFormData({ ...formData, current_district: e.target.value })}
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
                                            value={formData.current_province}
                                            onChange={(e) => setFormData({ ...formData, current_province: e.target.value })}
                                            required
                                        />
                                    </Col>

                                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                                        <label htmlFor="current_postal_code" className="form-label th">รหัสไปรษณีย์</label>
                                        <input
                                            name="current_postal_code"
                                            type="text"
                                            id="current_postal_code"
                                            className="form-control th"
                                            aria-describedby="current_postal_code"
                                            value={formData.current_postal_code}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setFormData({ ...formData, current_postal_code: value })
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
                                    <Col>
                                        <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            id="sameAddressCheckbox"
                                            onChange={handleCheckboxChange}
                                            required
                                        />
                                        <label htmlFor="sameAddressCheckbox" className="form-label th">ที่อยู่เดียวกับที่อยู่ปัจจุบัน</label>
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
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                                                value={formData.subdistrict}
                                                onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
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
                                                value={formData.district}
                                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                                                value={formData.province}
                                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
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
                                                value={formData.postal_code || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, postal_code: value })
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
