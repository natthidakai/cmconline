import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import Pin from "../assert/images/pin.png";
import Map from "../assert/images/map.png";
import Check from "../assert/images/check.png";

import Default from "../assert/images/default.jpg";

const ProjectDetails = ({ projectInfo, projectID }) => {

    return (
        <Row className="justify-content-center-m">
            <Col xxl="4" xl="4" lg="6" md="6" sm="12" xs="10" className="hoverImageProjectInfo border-radius-20">
                {projectInfo.pic ? (
                    <Image
                        src={projectInfo.pic}
                        alt={`ภาพของโปรเจค ${projectID}`}
                        className="img-100 border-radius-20 hoverImage"
                        width={600}
                        height={400}
                    />
                ) : (
                    <Image
                        src={Default}
                        alt="Default image"
                        className="img-100 border-radius-20 hoverImage"
                        width={600}
                        height={400}
                    />
                )}
            </Col>
            <Col xxl="8" xl="8" lg="6" md="6" sm="12" xs="11" className="pl-2 py-4">
                <Col className="mb-5">
                    <Col className="th project-name name-info">{projectInfo.nameProject}</Col>
                    <Col className="align-items-baseline">
                        <Image src={Pin} alt="" width={18} height={18} />
                        <span className="th px-2 name-location">{projectInfo.location}</span>
                    </Col>
                </Col>

                <Row className="mb-4">
                    <Col xxl="6" className="mb-4">
                        <Col className="th projectinfo-dec mb-3">
                            {projectInfo.description}
                        </Col>
                    </Col>
                    <Col xxl="6" className="box-facility">
                        <Col className="th font-20">
                            <strong>สิ่งอำนวยความสะดวก</strong>
                            <Row className="pl-1 mt-3">
                                {projectInfo.facilities.map((facility, index) => (
                                    <Col
                                        key={index}
                                        className="font-16 font-300 pb-2"
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
                    </Col>
                </Row>
                <Button className="btn-xl" href={projectInfo.map} target="_blank">
                    <Image src={Map} alt="" width={20} /> <span className="th">ดูแผนที่</span>
                </Button>
            </Col>
        </Row>
    );
};

export default ProjectDetails;
