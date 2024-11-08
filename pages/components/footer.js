import React from "react"
import Link from "next/link";

import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <div className="footer py-3 footer-shadows">
            <Container>
                <Row className="">
                    <Col xxl="6" xl="6" lg="6" md="12" sm="12" xs="8"
                        className="en mb-2 justify-content-center-m font-12">© 2024 Chaopraya Mahanakorn PLC. All Rights Reserved.
                    </Col>
                    <Col xxl="6" xl="6" lg="6" md="12" sm="12" xs="4" className="th font-13 right justify-content-center-m">
                        <Link href={`/policy`} target="_blank" className="font-12">นโยบายความเป็นส่วนตัว</Link>
                    
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Footer