import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProjectInfo from "../data/projectinfo";
import Loading from "../components/loading";
import Image from "next/image";

import Pin from "../assert/images/pin.png";
import Map from "../assert/images/map.png";
import Check from "../assert/images/check.png";
import Link from "next/link";

const Step1 = ({ projectID }) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTower, setSelectedTower] = useState(""); // Store selected tower
  const [selectedFloor, setSelectedFloor] = useState(""); // Store selected floor
  const [unitNumbers, setUnitNumbers] = useState([]); // Store unit numbers for the selected floor

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/callProject");
      if (!res.ok) throw new Error("เครือข่ายมีปัญหา");
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  // Fetch Status
  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/callStatus?projectID=${projectID}`);
      if (!res.ok) throw new Error("เครือข่ายมีปัญหา");
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStatus();
  }, [projectID]);

  useEffect(() => {
    if (status.length > 0) {
      const initialTower = [...new Set(status.map((unit) => unit.TowerName))][0];
      setSelectedTower(initialTower);
    }
  }, [status]);

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
        .map((unit) => unit.UnitNumber); // Changed from ModelID to UnitNumber
      setUnitNumbers([...new Set(filteredUnits)]); // Store unique unit numbers for the selected floor
    }
  }, [selectedTower, selectedFloor, status]);

  if (loading) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const currentProject = projects.find((p) => p.ProjectID === projectID);
  const projectInfo = ProjectInfo.find((s) => s.id === projectID);

  const towerNames = [...new Set(status.map((unit) => unit.TowerName))];
  const uniqueFilteredFloors = [
    ...new Set(
      status
        .filter((unit) => unit.TowerName === selectedTower)
        .map((unit) => unit.FloorName)
    ),
  ];

  // Dynamically construct the path to the floor plan image
  const floorPlanImagePath = `/images/${projectID}/${selectedTower}/Floor/${selectedFloor}.jpg`;

  return (
    <Container className="py-5">
      <Row>
        {currentProject && projectInfo ? (
          <>
            <Col xxl="4" className="hoverImageProjectInfo border-radius-20">
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
                  src="/path/to/default.jpg"
                  alt="Default image"
                  className="img-100 border-radius-20 hoverImage"
                  width={600}
                  height={400}
                />
              )}
            </Col>
            <Col xl="8" className="pl-2 py-4">
              <Col className="mb-5">
                <Col className="th project-name name-info">
                  {currentProject.BrandName}
                </Col>
                <Col className="align-items-baseline">
                  <Image src={Pin} alt="" width={18} height={18} />
                  <span className="th px-2 name-location">
                    {currentProject.Location}
                  </span>
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
                <Image src={Map} alt="" width={20} />{" "}
                <span className="th">ดูแผนที่</span>
              </Button>
            </Col>
          </>
        ) : (
          <div>ไม่พบข้อมูลโปรเจค</div>
        )}
      </Row>

      <hr className="my-5" />

      <Col xxl="12" xl="12" lg="12" md="12" sm="11" xs="11" className="margin-auto">
        <h3 className="th px-3 mb-4">แบบแปลน</h3>
        <Row className="plan-box p-4">
          <Col>
            <label htmlFor="building" className="form-label th">
              อาคาร
            </label>
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
            <label htmlFor="floor" className="form-label th">
              ชั้น
            </label>
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
              className="img-floorplan "
            />
          </Col>
        </Row>

        {/* Display Selected Unit Information */}

        {unitNumbers.length > 0 ? (
          <Col className="py-4 justify-content-center" xxl="12">
            <Row >

              {unitNumbers.map((unitNumber, index) => (
                <Col xxl="1" key={index}>
                  <Link href="/" className={`box-booking ${projectID}-${unitNumber}`}></Link>
                </Col>
              ))}
            </Row>
          </Col>
        ) : (
          <p>ไม่มีข้อมูลยูนิตสำหรับชั้นนี้</p>
        )}

      </Col>
    </Container>
  );
};

export default Step1;