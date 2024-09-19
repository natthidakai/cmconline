import { Row, Col, Button } from "react-bootstrap";
import Image from 'next/image';
import Pin from "../assert/images/pin.png";
import Call from "../assert/images/phone-call.png";

const UnitDetailsBooking = ({ 
    projectID,
    selectedFloor,
    selectedTower,
    unitModelIDs,
    unitPlanImagePath,
    floorName,
    projectInfo,
    unitDetails 
}) => {
    return (
        <Col>
            {Object.entries(unitModelIDs).map(([unitNumber, modelID]) => (
                <Row key={unitNumber} className='mb-4'>
                    <Col className='center'>
                        {modelID && (
                            <Image
                                src={unitPlanImagePath}
                                alt={`Floor plan for ${floorName} of ${modelID}`}
                                width={800}
                                height={500}
                                className="img-floorplan"
                            />
                        )}
                    </Col>
                    <Col className='align-content-center'>
                        <Col className="th project-name name-info">{projectInfo.nameProject}</Col>
                        <Col xxl="7" xl="7" lg="7" md="10" sm="12" xs="12" className='mb-3'>
                            <Row>
                                <Col className="align-items-baseline">
                                    <Image src={Pin} alt="" width={18} height={18} />
                                    <span className="th px-2 name-location">{projectInfo.location}</span>
                                </Col>
                                {unitDetails.length > 0 && (
                                    <Col className="align-items-baseline">
                                        <Image src={Call} alt="" width={18} height={18} />
                                        {unitDetails.map((detail, index) => (
                                            <Col key={`${detail.topID}-${index}`} className="th px-2 name-location">{detail.ProjectTel}</Col>
                                        ))}
                                    </Col>
                                )}
                            </Row>
                        </Col>

                        <Col className="th projectinfo-dec mb-3">
                            {projectInfo.description}
                        </Col>

                        {unitDetails.length > 0 && (
                            <Col xxl="8">
                                {unitDetails.map((detail, index) => (
                                    <Col key={index}>
                                        <h5 className='th'>ราคา (บาท)</h5>
                                        <Row>
                                            <Col className='th'>ราคาต่อ ตร.ม.</Col>
                                            <Col className='th'> {detail.PricePerArea.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</Col>
                                        </Row>

                                        <Row className='mb-4'>
                                            <Col className='th'>ราคาสุทธิ</Col>
                                            <Col className='th'> {detail.SellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</Col>
                                        </Row>

                                        <h5 className='th'>รายละเอียดการจ่ายเงิน (บาท)</h5>

                                        <Row className='mb-4'>
                                            <Col className='th'>ราคาจอง</Col>
                                            <Col className='th'> {detail.BookAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</Col>
                                        </Row>

                                        {/* Corrected the Button and unitNumber reference */}
                                        <Button className="btn-xl th" href={`/step/3?projectID=${projectID}&floorName=${selectedFloor}&towerName=${selectedTower}&unitNumber=${unitNumber}`}>
                                            จองทันที
                                        </Button>
                                    </Col>
                                ))}
                            </Col>
                        )}
                    </Col>
                </Row>
            ))}
        </Col>
    );
};

export default UnitDetailsBooking;
