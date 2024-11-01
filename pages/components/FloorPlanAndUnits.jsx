import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import Loading from "../components/loading";

const FloorPlanAndUnits = () => {

    const router = useRouter();
    const { projectID } = router.query;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTower, setSelectedTower] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [status, setStatus] = useState([]);

    const [unitNumbers, setUnitNumbers] = useState([]);
    const [unitModelIDs, setUnitModelIDs] = useState({});

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const res = await fetch(`/api/callStatus?projectID=${projectID}`);
            if (!res.ok) throw new Error("เครือข่ายมีปัญหา");
            const data = await res.json();
            setStatus(data.status);

            // Assuming data.projects is part of the response
            setProjects(data.projects);
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [projectID]);

    useEffect(() => {
        if (selectedTower) {
            const filteredFloors = status
                .filter((unit) => unit.TowerName === selectedTower)
                .map((unit) => unit.FloorName);
            setSelectedFloor([...new Set(filteredFloors)][0]);
        }
    }, [selectedTower, status]);

    useEffect(() => {
        if (selectedTower && selectedFloor) {
            const filteredUnits = status
                .filter((unit) => unit.TowerName === selectedTower && unit.FloorName === selectedFloor)
                .map((unit) => unit.UnitNumber);
            setUnitNumbers([...new Set(filteredUnits)]);
        }
    }, [selectedTower, selectedFloor, status]);

    const floorPlanImagePath = `/images/${projectID}/${selectedTower}/Floor/${selectedFloor}.jpg`;

    useEffect(() => {
        if (status.length > 0) {
            const initialTower = [...new Set(status.map((unit) => unit.TowerName))][0];
            setSelectedTower(initialTower);
        }
    }, [status]);

    const towerNames = [...new Set(status.map((unit) => unit.TowerName))];
    const uniqueFilteredFloors = [
        ...new Set(
            status
                .filter((unit) => unit.TowerName === selectedTower) // ไม่กรอง FloorName
                .map((unit) => unit.FloorName)
        ),
    ];

    return (
        <Col xxl="12" xl="12" lg="12" md="12" sm="11" xs="11" className="margin-auto">
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h3 className="th px-3 mb-4">แบบแปลน</h3>
                    <Col>
                        
                    </Col>
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
                        <Col className="py-4 justify-content-center" xxl="12">
                            <Row>
                                {unitNumbers.map((unitNumber, index) => {
                                    const modelID = unitModelIDs[unitNumber] || "Unknown"; // Get the ModelID from unitModelIDs
                                    return (
                                        <Col xxl={1} xl={1} lg={1} md={1} sm={1} xs={1} key={index}>
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
                </>
            )
            }
        </Col>
    );
};

export default FloorPlanAndUnits;
