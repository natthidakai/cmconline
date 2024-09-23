import React, { useState, useEffect } from "react"
import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';

import Image from 'next/image';
import User from '../assert/images/profile-user.png';
import Link from 'next/link';


const Menubar = () => {

    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <Navbar className="bg-body-tertiary menu-shadows">
            <Container>
                <Navbar.Brand href="/">
                    <div className="en textlogo ">CMC GRUOP</div>
                    <div className="th textmenu">บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</div>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text><a href="#" className="th">ขั้นตอนการจอง</a></Navbar.Text>
                    {isLoggedIn ? (
                        <NavDropdown title="ข้อมูลของฉัน" id="basic-nav-dropdown" className="th">
                            <NavDropdown.Item as={Link} href={`/profile`}>ข้อมูลส่วนตัว</NavDropdown.Item>
                            <NavDropdown.Item as={Link} href={`/changepass`}>เปลี่ยนรหัสผ่าน</NavDropdown.Item>
                            <NavDropdown.Item href="#" onClick={handleLogout}>ออกจากระบบ</NavDropdown.Item>
                        </NavDropdown>

                    ) : (
                        <Navbar.Text>
                            {/* <a href="#">Mark Otto</a> */}
                            <div className="th box-login-menu">
                                <Image src={User} alt="" />
                                <Link href={`/register`} style={{ paddingLeft: '.5rem' }}>สมัครสมาชิก</Link> / <Link href={`/login`}>เข้าสู่ระบบ</Link>
                            </div>
                        </Navbar.Text>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Menubar