import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import ProjectInfo from "../data/projectinfo";
import Loading from "../components/loading";
import Image from "next/image";

import Pin from "../assert/images/pin.png";

const Step1 = ({ projectID }) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/callProject");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // เรียกใช้ API เมื่อโหลดหน้า
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // ค้นหาข้อมูลโปรเจคที่ตรงกับ projectID
  const currentProject = projects.find((p) => p.ProjectID === projectID);
  const projectInfo = ProjectInfo.find((s) => s.id === projectID); // ข้อมูลเพิ่มเติมจาก ProjectInfo

  return (
    <Container className="py-5">
      <Row>
        {currentProject && projectInfo ? (
          <>
            <Col xxl="4" className="hoverImageProjectInfo border-radius-20">
              {projectInfo.pic ? (
                <Image
                  src={projectInfo.pic} // ใช้เส้นทางที่เริ่มต้นด้วย /
                  alt={`ภาพของโปรเจค ${projectID}`}
                  className="img-100 border-radius-20 hoverImage"
                  width={600} // ปรับขนาดตามต้องการ
                  height={400} // ปรับขนาดตามต้องการ
                />
              ) : (
                <Image
                  src="/path/to/default.jpg" // รูปภาพเริ่มต้นถ้าไม่มีข้อมูล
                  alt="Default image"
                  className="img-100 border-radius-20 hoverImage"
                  width={600}
                  height={400}
                />
              )}
              {/* คุณยังสามารถแสดงรายละเอียดเพิ่มเติมที่นี่ */}
            </Col>
            <Col xl="8" className="pl-2">
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

              <Row>
                <Col xxl="7">
                  <Col className="th projectinfo-dec mb-3">
                    {projectInfo.description}
                  </Col>
                  <Button className="btn-xl">ดูแผนที่</Button>
                </Col>
                <Col xxl="5">
                  <Col className="th">สิ่งอำนวยความสะดวก</Col>
                </Col>
              </Row>
            </Col>
          </>
        ) : (
          <div>ไม่พบข้อมูลโปรเจค</div> // ถ้าไม่พบข้อมูลโปรเจค
        )}
      </Row>
    </Container>
  );
};

export default Step1;
