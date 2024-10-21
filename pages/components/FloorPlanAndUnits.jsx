import React from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const FloorPlanAndUnits = ({ 
    selectedTower, 
    setSelectedTower, 
    selectedFloor, 
    setSelectedFloor, 
    towerNames, 
    uniqueFilteredFloors, 
    floorPlanImagePath, 
    unitNumbers, 
    unitModelIDs, 
    projectID 
}) => {

    
    return (
        <Col xxl="12" xl="12" lg="12" md="12" sm="11" xs="11" className="margin-auto">
            <h3 className="th px-3 mb-4">แบบแปลน</h3>
            <Row className="plan-box p-4">
                <Col>
                    <label htmlFor="building" className="form-label th">อาคาร</label>
                    <select
                        className="form-select th"
                        id="building"
                        value={selectedTower}
                        onChange={(e) => setSelectedTower(e.target.value)}
                    >
                        {towerNames.map((towerName, index) => (
                            <option key={index} value={towerName}>
                                {towerName}
                            </option>
                        ))}
                    </select>
                </Col>

                <Col>
                    <label htmlFor="floor" className="form-label th">ชั้น</label>
                    <select
                        className="form-select th"
                        id="floor"
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                    >
                        {uniqueFilteredFloors.map((floorName, index) => (
                            <option key={index} value={floorName}>
                                {floorName}
                            </option>
                        ))}
                    </select>
                </Col>
            </Row>

            {/* Display Floor Plan Image */}
            <Row className="py-4">
                <Col className="justify-content-center">
                    <Image
                        src={floorPlanImagePath}
                        alt={`Floor plan for ${selectedFloor} of ${selectedTower}`}
                        width={800}
                        height={500}
                        className="img-floorplan"
                    />
                </Col>
            </Row>

            {/* Display Selected Unit Information */}
            {unitNumbers.length > 0 ? (
                <Col className="justify-content-center" xxl="12">
                    <Row>
                        {unitNumbers.map((unitNumber, index) => {
                            const modelID = unitModelIDs[unitNumber] || "Unknown"; // Get the ModelID from unitModelIDs
                            return (
                                <Col xxl="1" xl="1" lg="1" md="1" sm="2" xs="2" key={index}>
                                    <Link
                                        href={`/step/2?projectID=${projectID}&floorName=${selectedFloor}&towerName=${selectedTower}&unitNumber=${unitNumber}`}
                                        className={`box-booking ${projectID}-${unitNumber}`}
                                    >
                                    </Link>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
            ) : (
                <p>ไม่มีข้อมูลยูนิตสำหรับชั้นนี้</p>
            )}
        </Col>
    );
};

export default FloorPlanAndUnits;
