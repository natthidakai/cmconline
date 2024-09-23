import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import Image from "next/image";
import LOGO from "./assert/images/logo.jpg";

const ChangePassword = () => {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
                if (!usersData || !usersData.member_id) {
                    throw new Error('Invalid user data');
                }

                setUser(usersData);
            } catch (err) {
                setError(err.message);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (currentPassword === '') {
            setError('กรุณาระบุรหัสผ่านปัจจุบัน');
            return;
        } else if (newPassword === '') {
            setError('กรุณากำหนดรหัสผ่านใหม่');
            return;
        } else if (confirmPassword === '') {
            setError('กรุณายืนยันรหัสผ่านใหม่');
            return;
        } else if (newPassword !== confirmPassword) {
            setError('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }
    
        try {
            const response = await fetch('/api/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword, member_id: user.member_id }),
            });
    
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }
    
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            alert('เปลี่ยนรหัสผ่านเรียบร้อย');
            router.push('/profile')
            // แสดงข้อความสำเร็จที่นี่
        } catch (error) {
            setError(error.message);
        }
    };
    

    if (loading) return <p>Loading...</p>;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xxl="5" xl="6" lg="6" md="8" sm="11" xs="11">
                    <Row className="box-step-3 p-5 box-shadow">
                        <div>
                            <Col className="center mb-3">
                                <Image src={LOGO} alt="" width={70} height={70} />
                                <br />
                            </Col>
                            <Col>
                                <h3 className="th px-3 center mb-4">เปลี่ยนรหัสผ่าน</h3>
                            </Col>
                        </div>

                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="currentPassword" className="form-label th">
                                รหัสผ่านปัจจุบัน
                            </label>
                            <input
                                name="currentPassword"
                                type="password"
                                id="currentPassword"
                                className="form-control th"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Col>

                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="newPassword" className="form-label th">
                                รหัสผ่านใหม่
                            </label>
                            <input
                                name="newPassword"
                                type="password"
                                id="newPassword"
                                className="form-control th"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Col>

                        <Col xxl="12" xl="12" lg="12" md="12" sm="12" xs="12" className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label th">
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                id="confirmPassword"
                                className="form-control th"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Col>
                        <Row>
                            {error && <p className="text-danger th center">{error}</p>}
                            <Col className="justify-content-center">
                                <Button className="btn-xl th" onClick={handleSubmit}>
                                    เปลี่ยนรหัสผ่าน
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ChangePassword;
