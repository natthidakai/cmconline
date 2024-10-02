import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button } from "react-bootstrap";

import { useFetchUser } from '../hooks/useFetchUser';
import { useSignUp } from '../hooks/useSignUp';

const Step3 = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { projectID, floorName, towerName, unitNumber } = router.query;
    const { 
        errors, 
        setErrors, 
        isSameAddress, 
        handleCheckboxChange, 
        submitBooking, 
        user, 
        setUser, 
        formFieldsPersonal, 
        formFieldsCurrentAddress, 
        formFieldsAddress 
    } = useSignUp();

    const fetchedData = useFetchUser();
    const { user: fetchedUser = {}, error } = fetchedData || {};
    const [userData, setUserData] = useState(null);
    const [showAddressSection, setShowAddressSection] = useState(false);

    

    useEffect(() => {
        if (projectID && unitNumber) {
            setUser(prevUser => ({ ...prevUser, projectID, unitNumber }));
        }
    }, [projectID, unitNumber]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        submitBooking(e, projectID, unitNumber, showAddressSection, floorName, towerName);
    };

    const checkFormPersonal = (userData) => {
        const requiredFields = [
            "title", "first_name", "last_name", "phone", "email", "id_card", "birth_date", "nationality", "marital_status"
        ];

        const allRequiredFieldsFilled = requiredFields.every((field) => {
            const value = userData[field];
            if (field === "id_card") return value && value.length === 13;
            if (field === "phone") return value && value.length === 10;
            return value && value.trim() !== '';
        });

        setShowAddressSection(allRequiredFieldsFilled);
    };

    const fetchUserData = async (memberId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            throw new Error('Unauthorized: Token not found');
        }
    
        const response = await fetch(`/api/getUser?member_id=${memberId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fetch User Data Error:', errorData);
            throw new Error('Error fetching user data');
        }
    
        return await response.json();
    };
    
    useEffect(() => {
        const loadUserData = async () => {
            if (session?.user?.id) {
                try {
                    const userData = await fetchUserData(session.user.id);
                    setUserData(userData); // Set user data from response
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else {
                console.log('No session found');
            }
        };
        loadUserData();
    }, [session, setUser]);
    
    const handleInputChange = (field, value) => {
        setUser((prevUser) => {
            const updatedUser = { ...prevUser, [field]: value };
            // Check form only when necessary
            if (field === "first_name" || field === "last_name" || field === "phone" || field === "email") {
                checkFormPersonal(updatedUser);
            }
            return updatedUser;
        });
    };

    return (
        <Container className='py-5'>
            <h1>Welcome, {userData ? userData.first_name : 'Loading...'}</h1>
            <h3 className="th px-3 center">ข้อมูลการจอง</h3>
            <Col className="th center font-18 text-blue font-500 mb-5">ข้อมูลส่วนบุคคลทั้งหมด จะถูกเก็บเป็นความลับ</Col>
            <Row className='justify-content-center'>
                <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                    <h5 className='th'>ข้อมูลส่วนบุคคล</h5>
                    <Row className='box-step-3 mb-5'>
                        {formFieldsPersonal.map((field) => (
                            <Col key={field.id} xxl={4} xl={4} lg={4} md={4} sm={12} xs={12} className="mb-4">
                                <label htmlFor={field.id} className="form-label th">{field.label}</label>
                                {field.type === "select" ? (
                                    <select
                                        id={field.id}
                                        className="form-select th"
                                        value={field.value}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)} // Pass field.id and value
                                    >
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.id}
                                        id={field.id}
                                        className="form-control th"
                                        value={field.value}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)} // Pass field.id and value
                                    />
                                )}
                            </Col>
                        ))}
                    </Row>
                </Col>

                {showAddressSection && (
                    <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10">
                        <Row>
                            <Col>
                                <h5 className='th'>ที่อยู่ปัจจุบัน</h5>
                                <Row className='box-step-3 mb-5'>
                                    {formFieldsCurrentAddress.map((field) => {
                                        const colSize = ["current_address"].includes(field.id) ? "12" : "6";
                                        return (
                                            <Col key={field.id} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4">
                                                <label htmlFor={field.id} className="form-label th">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    id={field.id}
                                                    name={field.id}
                                                    className="form-control th"
                                                    value={field.value}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)} // Pass field.id and value
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Col>

                            <Col>
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
                                        {formFieldsAddress.map((field) => {
                                            const colSize = ["address"].includes(field.id) ? "12" : "6";
                                            return (
                                                <Col key={field.id} xxl={colSize} xl={colSize} lg={colSize} md={colSize} sm={12} xs={12} className="mb-4">
                                                    <label htmlFor={field.id} className="form-label th">{field.label}</label>
                                                    <input
                                                        type={field.type}
                                                        id={field.id}
                                                        name={field.id}
                                                        className="form-control th"
                                                        value={field.value}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)} // Pass field.id and value
                                                    />
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Col>
                )}
                <Col xxl="10" xl="10" lg="10" md="10" sm="10" xs="10" className="text-center mt-5">
                    <Button variant="blue" type="submit" className="th" onClick={handleSubmit}>ดำเนินการต่อ</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Step3;
