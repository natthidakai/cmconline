import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Row, Col, Button } from "react-bootstrap";

import DefaultImage from "../assert/images/default.jpg";
import Pin from "../assert/images/pin.png";
import ProjectInfo from "../data/projectinfo";

const ProjectCard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState(4);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/callProject");
      const data = await res.json();

      if (data.success && Array.isArray(data.projects)) {
        const enrichedProjects = data.projects
          .filter((project) => project.ProjectStatus !== "3")
          .map((project) => {
            const info = ProjectInfo.find((p) => p.id === project.ProjectID) || {};
            return {
              ...project,
              ...info, // รวมข้อมูลจาก ProjectInfo (ถ้ามี)
              pic: info.pic || DefaultImage, // ใช้ DefaultImage ถ้าไม่มีรูป
            };
          });

        setProjects(enrichedProjects);
      } else {
        setError("Invalid data");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  // เรียก fetchProjects เมื่อ component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Row className="pt-2 mb-3 justify-content-center-m">
        {projects.slice(0, visibleProjects).map((project) => {
          const status = parseInt(project.ProjectStatus, 10);
          
          return (
            <Col key={project.ProjectID} xxl="3" xl="3" lg="3" md="6" sm="10" xs="10">
              {/* แสดงสถานะของโปรเจ็ค */}
              {status === 0 || status === 1 ? (
                <div className="th newproject">โครงการใหม่</div>
              ) : status === 2 ? (
                <div className="th ready2move">โครงการพร้อมอยู่</div>
              ) : null}

              <div className="project-shadows border-radius-20">
                <div className="hoverImageWrapper">
                  <Link href={`/step/1?projectID=${project.ProjectID}`}>
                    <Image
                      src={project.pic} // ใช้รูปจากข้อมูลที่ดึงมา
                      alt={`ภาพของโปรเจค ${project.ProjectID}`}
                      className="img-100 border-radius-top hoverImage"
                      width={600}
                      height={400}
                    />
                  </Link>
                </div>

                <Col className="bg-white p-4 border-radius-bottom">
                  <div className="th project-name">{project.nameProject}</div>
                  <div className="align-items-baseline">
                    <Image src={Pin} alt="Pin" width={12} />
                    <span className="th px-2">{project.location}</span>
                  </div>
                  <div className="price th">
                    เริ่มต้น {project.minprice} ล้านบาท
                  </div>
                </Col>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* ปุ่มเพื่อโหลดโปรเจ็คเพิ่มเติม */}
      {visibleProjects < projects.length && (
        <div className="justify-content-center mt-5">
          <Button
            onClick={() => setVisibleProjects((prev) => prev + 4)}
            className="btn th btn-xl"
          >
            ดูเพิ่มเติม
          </Button>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
