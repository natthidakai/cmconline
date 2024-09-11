import React from "react"

import {Container, Row, Col} from 'react-bootstrap';

const Footer = () => {
    return (
        <div className="footer py-3 footer-shadows">
            <Container>
                <Row>
                    <Col className="en">© 2024 Chaopraya Mahanakorn PLC. All Rights Reserved.</Col>
                    <Col className="th right">นโยบายความเป็นส่วนตัว</Col>
                </Row>
            </Container>
        </div>  
    )
}
export default Footer