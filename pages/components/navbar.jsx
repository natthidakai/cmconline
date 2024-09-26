import React, { useState, useEffect } from "react";
import { Container, Navbar, Offcanvas, NavDropdown, Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Image from 'next/image';
import User from '../assert/images/profile-user.png';
import Link from 'next/link';

const Menubar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.reload(`/`);
    };

    const handleLinkClick = () => {
        setShowOffcanvas(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary menu-shadows">
            <Container>
                <Navbar.Brand href="/">
                    <div className="en textlogo">CMC GROUP</div>
                    <div className="th textmenu">บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</div>
                </Navbar.Brand>

                <Navbar.Toggle onClick={() => setShowOffcanvas(true)} aria-controls="offcanvasNavbar" />

                {/* Offcanvas menu */}
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    show={showOffcanvas}
                    onHide={() => setShowOffcanvas(false)}
                >
                    <Offcanvas.Header closeButton className="menu-shadows px-4">
                        <Offcanvas.Title id="offcanvasNavbarLabel">
                            <Link href={`/`} className="text-decoration-none">
                                <div className="en textlogo">CMC GROUP</div>
                                <div className="th textmenu">บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</div>
                            </Link>
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body className="p-3 font-18">
                        <Nav className="mb-0">
                            <Nav.Link href="#" className="th" onClick={handleLinkClick}>
                                ขั้นตอนการจอง
                            </Nav.Link>
                        </Nav>

                        {isLoggedIn ? (
                            <NavDropdown title={
                                <div className="d-flex align-items-center">
                                    <Image src={User} alt="User Icon" width={30} height={30} />
                                    {/* Display name differently if in Offcanvas mode */}
                                    <span className="ms-2">{showOffcanvas ? "ข้อมูลของฉัน" : "ข้อมูลของฉัน"}</span>
                                </div>
                            } id="basic-nav-dropdown" className="th font-18 mb-0 box-profile-menu ms-3">
                                <NavDropdown.Item as={Link} href={`/profile`} onClick={handleLinkClick}>
                                    ข้อมูลส่วนตัว
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} href={`/mybooking`} onClick={handleLinkClick}>
                                    รายการจอง
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} href={`/changepass`} onClick={handleLinkClick}>
                                    เปลี่ยนรหัสผ่าน
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={() => { handleLogout(); handleLinkClick(); }}>
                                    ออกจากระบบ
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <div className="th box-login-menu d-flex align-items-center">
                                <Image src={User} alt="User Icon" width={30} height={30} />
                                <Link href={`/signup`} onClick={handleLinkClick} className="ms-2 text-blue">
                                    สมัครสมาชิก
                                </Link>
                                <span className="ms-2">|</span>
                                <Link href={`/signin`} onClick={handleLinkClick} className="ms-2 text-blue">
                                    เข้าสู่ระบบ
                                </Link>
                            </div>
                        )}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default Menubar;
