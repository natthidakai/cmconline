import React from "react";
import Link from 'next/link';
import Image from "next/image";
import { Row, Col, Button } from "react-bootstrap";

import Default from "../assert/images/default.jpg";
import Pin from "../assert/images/pin.png";

// Images for projects
import BHCPWS from "../assert/images/BH-CPWS.jpg";
import BHTWN1 from "../assert/images/BH-TWN1.jpg";
import BHRAMC from "../assert/images/BH-RAMC.jpg";
import CTKSCP from "../assert/images/CT-KSCP.jpg";
import BHBN36 from "../assert/images/BH-BN36.jpg";
import BHRH from "../assert/images/BHRH.jpg";
import CP00 from "../assert/images/CP00.jpg";
import CTR362 from "../assert/images/CT-R362.jpg";
import P392 from "../assert/images/P392.jpg";
import BK52 from "../assert/images/BK52.jpg";
import BHSUKS from "../assert/images/BH-SUKS.jpg";
import BHNWSR from "../assert/images/BH-NWSR.jpg";

const ProjectCard = ({ projects, visibleProjects, setVisibleProjects }) => {
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

  return (
    <>
      <Row className="pt-2 mb-3 justify-content-center-m">
        {projects.slice(0, visibleProjects).map((project) => {
          const status = parseInt(project.ProjectStatus, 10);
          
          // Debugging output
          // console.log("Project Status:", status);

          return (
            <Col key={project.ProjectID} xxl="3" xl="3" lg="3" md="6" sm="10" xs="10">
              {/* แสดงสถานะของโปรเจกต์ */}
              {status === 0 || status === 1 ? (
                <div className="th newproject">โครงการใหม่</div>
              ) : status === 2 ? (
                <div className="th ready2move">โครงการพร้อมอยู่</div>
              ) : null}
              <div className="project-shadows border-radius-20">
                <div className="hoverImageWrapper">
                  <Link href={`/step/1?projectID=${project.ProjectID}`}>
                    <Image
                      src={projectImages[project.ProjectID] || Default}
                      alt={project.BrandName}
                      className="img-100 p-0 hoverImage"
                      layout="responsive"
                      width={500} // ปรับขนาดความกว้าง
                      height={300} // ปรับขนาดความสูง
                    />
                  </Link>
                </div>

                <Col className="bg-white p-4 border-radius-bottom">
                  <div className="th project-name">{project.BrandName}</div>
                  <div className="align-items-baseline">
                    <Image src={Pin} alt="Pin" width={12} />
                    <span className="th px-2">{project.Location}</span>
                  </div>
                  {/* <span className="th px-2">{project.ProjectID}</span> */}
                  <div className="price th">
                    เริ่มต้น {project.MINPrice} ล้านบาท
                  </div>
                </Col>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* ปุ่มเพื่อโหลดโปรเจกต์เพิ่มเติม */}
      {visibleProjects < projects.length && (
        <div className="justify-content-center mt-5">
          <Button onClick={() => setVisibleProjects((prev) => prev + 4)} className="btn th btn-xl">
            ดูเพิ่มเติม
          </Button>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
