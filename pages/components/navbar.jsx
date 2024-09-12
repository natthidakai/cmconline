import React from "react"
import {Container, Navbar} from 'react-bootstrap';

import Image from 'next/image';
import User from '../assert/images/profile-user.png';


const Menubar = () => {
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
                <Navbar.Text>
                    {/* <a href="#">Mark Otto</a> */}
                    <div className="th box-login-menu">
                        <Image src={User} alt=""/>
                        <a href="#" style={{paddingLeft: '.5rem'}}>สมัครสมาชิก</a> / <a href="#">เข้าสู่ระบบ</a>
                    </div>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Menubar