import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";

import Image from "next/image";
import Banner from "./assert/images/banner.jpg";
import Condo from "./assert/images/condominium.png";
import BHCPWS from "./assert/images/BH-CPWS.jpg";
import BHTWN1 from "./assert/images/BH-TWN1.jpg";
import BHRAMC from "./assert/images/BH-RAMC.jpg";
import CTKSCP from "./assert/images/CT-KSCP.jpg";
import BHBN36 from "./assert/images/BH-BN36.jpg";
import BHRH from "./assert/images/BHRH.jpg";
import CP00 from "./assert/images/CP00.jpg";
import CTR362 from "./assert/images/CT-R362.jpg";
import P392 from "./assert/images/P392.jpg";
import BK52 from "./assert/images/BK52.jpg";
import BHSUKS from "./assert/images/BH-SUKS.jpg";
import BHNWSR from "./assert/images/BH-NWSR.jpg";
import Pin from "./assert/images/pin.png";
import Default from "./assert/images/default.jpg";

import Loading from "./components/loading";

const Homepage = () => {
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState(4); // จำนวนโครงการที่จะแสดงเริ่มต้น
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/callProject");
      const data = await res.json();
      console.log("API Response:", data);
      if (data.success && Array.isArray(data.projects)) {
        // ก่อนจะแสดงผล จัดเรียงโครงการตามว่ามีรูปภาพหรือไม่
        const sortedProjects = data.projects.sort((a, b) => {
          const aHasImage = !!projectImages[a.ProjectID]; // ตรวจสอบว่า Project A มีรูปภาพหรือไม่
          const bHasImage = !!projectImages[b.ProjectID]; // ตรวจสอบว่า Project B มีรูปภาพหรือไม่
          return bHasImage - aHasImage; // ถ้า B มีภาพ จะถูกเรียงไว้ก่อน A
        });

        setProjects(sortedProjects); // เก็บข้อมูลโครงการใน state
      } else {
        setError("Data format is incorrect");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const projectImages = {
    "CT-KSCP": CTKSCP,
    "BH-TWN1": BHTWN1,
    "BH-RAMC": BHRAMC,
    "BH-BN36": BHBN36,
    "BH-CPWS": BHCPWS,
    BHRH: BHRH,
    CP00: CP00,
    "CT-R362": CTR362,
    BK52: BK52,
    P392: P392,
    "BH-SUKS": BHSUKS,
    "BH-NWSR": BHNWSR,
  };

  useEffect(() => {
    fetchProjects(); // เรียกใช้ API เมื่อโหลดหน้า
  }, []);

  // ฟังก์ชันสำหรับการโหลดโครงการเพิ่มเติม
  const loadMoreProjects = () => {
    setVisibleProjects((prev) => prev + 4); // เพิ่มจำนวนโครงการทีละ 4
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="bg-white">
      <Image src={Banner} alt="" className="img-full" />
      <Container className="py-5">
        <div className="align-items-baseline justify-content-center-m mt-3">
          <Image src={Condo} alt="" width={42} />
          <span className="text-title th px-3">โครงการทั้งหมด</span>
        </div>

        <Row className="pt-2 justify-content-center mb-3">
          {projects.slice(0, visibleProjects).map((project) => (
            <Col key={project.ProjectID} xl="3" sm="10" xs="10" className="">
              {/* แสดงข้อความตามค่า ProjectStatus */}
              {project.ProjectStatus == 0 || project.ProjectStatus == 1 ? (
                <div className="th newproject">โครงการใหม่</div>
              ) : project.ProjectStatus == 2 ? (
                <div className="th ready2move">โครงการพร้อมอยู่</div>
              ) : null}
              <div className="project-shadows border-radius-20">
                <div className="hoverImageWrapper">
                  <Link href={`/step/1?projectID=${project.ProjectID}`}>
                    <Image
                      src={projectImages[project.ProjectID] || Default}
                      alt={project.BrandName}
                      className="img-100 p-0 hoverImage"
                    />
                  </Link>
                </div>

                <Col className="bg-white p-4 border-radius-bottom">
                  <div className="th project-name">{project.BrandName}</div>
                  <div className="align-items-baseline">
                    <Image src={Pin} alt="" width={12} />
                    <span className="th px-2">{project.Location}</span>
                  </div>
                  <span className="th px-2">{project.ProjectID}</span>
                  <div className="price th">
                    เริ่มต้น {project.MINPrice} ล้านบาท
                  </div>
                </Col>
              </div>
            </Col>
          ))}
        </Row>

        {/* ปุ่มสำหรับการโหลดโครงการเพิ่มเติม */}
        {visibleProjects < projects.length && (
          <div className="justify-content-center mt-5">
            <Button onClick={loadMoreProjects} className="btn th btn-xl">
              ดูเพิ่มเติม
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Homepage;
