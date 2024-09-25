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

    // Close Offcanvas when navigating to a new page
    const handleLinkClick = () => {
        setShowOffcanvas(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary menu-shadows">
            <Container>
                <Navbar.Brand href="/">
                    <div className="en textlogo ">CMC GROUP</div>
                    <div className="th textmenu">บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</div>
                </Navbar.Brand>

                <Navbar.Toggle onClick={() => setShowOffcanvas(true)} aria-controls="offcanvasNavbar" /> {/* Toggle button */}

                {/* Offcanvas menu */}
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end" // Set the menu to slide in from the right (end)
                    show={showOffcanvas} // Control visibility via state
                    onHide={() => setShowOffcanvas(false)} // Close when clicking outside or pressing the close button
                >
                    <Offcanvas.Header closeButton className="menu-shadows px-4">
                        <Offcanvas.Title id="offcanvasNavbarLabel" >
                            <Link href={`/`} className="text-decoration-none" >
                                <div className="en textlogo">CMC GROUP</div>
                                <div className="th textmenu">บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</div>
                            </Link>
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body className="p-4 font-18">
                        <Nav className="me-auto">
                            <Nav.Link href="#" className="th" onClick={handleLinkClick}>ขั้นตอนการจอง</Nav.Link>
                        </Nav>

                        {isLoggedIn ? (
                            <NavDropdown title="ข้อมูลของฉัน" id="basic-nav-dropdown" className="th font-18">
                                <NavDropdown.Item as={Link} href={`/profile`} onClick={handleLinkClick}>ข้อมูลส่วนตัว</NavDropdown.Item>
                                <NavDropdown.Item as={Link} href={`/mybooking`} onClick={handleLinkClick}>รายการจอง</NavDropdown.Item>
                                <NavDropdown.Item as={Link} href={`/changepass`} onClick={handleLinkClick}>เปลี่ยนรหัสผ่าน</NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={() => { handleLogout(); handleLinkClick(); }}>ออกจากระบบ</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <div className="th box-login-menu">
                                <Image src={User} alt="User Icon" />
                                <Link href={`/register`} onClick={handleLinkClick} style={{ paddingLeft: '.5rem' }}>สมัครสมาชิก</Link> / <Link href={`/login`} onClick={handleLinkClick}>เข้าสู่ระบบ</Link>
                            </div>
                        )}
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default Menubar;
