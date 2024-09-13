import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import dynamic from 'next/dynamic';
import ProjectCard from "./components/ProjectCard";

import Image from "next/image";

const Loading = dynamic(() => import('./components/loading'), {
  ssr: false, // ปิดการเรนเดอร์ฝั่งเซิร์ฟเวอร์สำหรับคอมโพเนนต์นี้
});

import Banner from "./assert/images/banner.jpg";
import Condo from "./assert/images/condominium.png";



const Homepage = () => {
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState(4); // จำนวนโปรเจกต์ที่แสดงเริ่มต้น
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลโปรเจกต์
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/callProject");
      const data = await res.json();

      if (data.success && Array.isArray(data.projects)) {
        const projectsWithAvailableUnits = await Promise.all(
          data.projects
            .filter(project => project.ProjectStatus !== '3')
            .map(async project => {
              const unitAvailable = await fetchStatus(project.ProjectID);
              return unitAvailable ? project : null;
            })
        );

        setProjects(projectsWithAvailableUnits.filter(Boolean)); // กรองค่า null ออก
      } else {
        setError("ข้อมูลไม่ถูกต้อง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  }, []);

  // ดึงสถานะเพื่อตรวจสอบหน่วยที่พร้อมใช้งาน
  const fetchStatus = async (projectID) => {
    try {
      const res = await fetch(`/api/callStatus?projectID=${projectID}`);
      const data = await res.json();
      if (data.success) {
        return data.status.some(unit => unit.UnitStatus === 'Available');
      }
      return false;
    } catch (err) {
      console.error("ข้อผิดพลาดในการดึงสถานะ", err);
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="bg-white">
      <Image src={Banner} alt="Banner" className="img-full" />
      <Container className="py-5">
        <div className="align-items-baseline justify-content-center-m mt-3">
          <Image src={Condo} alt="Condo" width={42} />
          <span className="text-title th px-3">โครงการทั้งหมด</span>
        </div>

        {/* ใช้คอมโพเนนต์ ProjectCard */}
        <ProjectCard
          projects={projects} 
          visibleProjects={visibleProjects} 
          setVisibleProjects={setVisibleProjects}
          loading={loading} 
          error={error} 
        />
      </Container>
    </div>
  );
};

export default Homepage;
