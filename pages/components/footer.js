import React from "react"

import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <div className="footer py-3 footer-shadows">
            <Container>
                <Row className="">
                    <Col xxl="6" xl="6" lg="6" md="12" sm="12" xs="12"
                        className="en font-13 mb-2 justify-content-center-m">© 2024 Chaopraya Mahanakorn PLC. All Rights Reserved.
                    </Col>
                    <Col xxl="6" xl="6" lg="6" md="12" sm="12" xs="12"
                        className="th font-13 right justify-content-center-m">นโยบายความเป็นส่วนตัว
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Footer