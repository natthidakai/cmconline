import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import Check from "../assert/images/check.png";

const UnitDetails = ({ unitDetails, projectInfo }) => {
    return (
        <Row className='justify-content-center-m'>
            <Col xxl="12" xl="12" lg="12" md="12" sm="10" xs="10">
            <h5 className='th mb-3'>รายละเอียดเพิ่มเติม</h5>
            <Row className='pl-2'>
                <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                    <h6 className='th font-18'>รายละเอียดยูนิต</h6>
                    {unitDetails.map((detail, index) => (
                        <Col key={index}>
                            <Col className="align-items-baseline">
                                <Image src={Check} alt="" width={14} height={14} />
                                <Col key={`${detail.topID}-${index}`} className="th pl-1 font-16 font-300">หมายเลขห้อง : {detail.UnitNumber}</Col>
                            </Col>

                            <Col className="align-items-baseline">
                                <Image src={Check} alt="" width={14} height={14} />
                                <Col key={`${detail.topID}-${index}`} className="th pl-1 font-16 font-300">พื้นที่ใช้สอย : {detail.SellingArea} ตร.ม.</Col>
                            </Col>

                            <Col className="align-items-baseline">
                                <Image src={Check} alt="" width={14} height={14} />
                                <Col key={`${detail.topID}-${index}`} className="th pl-1 font-16 font-300">ชั้น : {detail.FloorName}</Col>
                            </Col>

                            <Col className="align-items-baseline">
                                <Image src={Check} alt="" width={14} height={14} />
                                <Col key={`${detail.topID}-${index}`} className="th pl-1 font-16 font-300">อาคาร : {detail.TowerName}</Col>
                            </Col>
                        </Col>
                    ))}
                </Col>
                <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                    <h6 className='th'>สิ่งอำนวยความสะดวก</h6>
                    <Row>
                        {projectInfo.facilities.map((facility, index) => (
                            <Col
                                key={index}
                                className="font-16 font-300 pb-2 th"
                                xxl="6"
                                xl="6"
                                lg="6"
                                md="6"
                                sm="6"
                                xs="6"
                            >
                                <Image src={Check} alt="" width={16} /> {facility}
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Col>
        </Row>
    );
};

export default UnitDetails;
