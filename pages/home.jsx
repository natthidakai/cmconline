import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import dynamic from 'next/dynamic';
import ProjectCard from "./components/ProjectCard";
import Image from "next/image";

const Loading = dynamic(() => import('./components/loading'), {
  ssr: false, // Disable server-side rendering for this component
});

import Banner from "./assert/images/banner.jpg";
import Condo from "./assert/images/condominium.png";

const Homepage = () => {
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState(4); // Number of projects to display initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects data
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/callProject");
      const data = await res.json();

      if (data.success && Array.isArray(data.projects)) {
        // Directly set projects without filtering based on unit availability
        setProjects(data.projects.filter(project => project.ProjectStatus !== '3'));
      } else {
        setError("Invalid data");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

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

        {/* Use ProjectCard component */}
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
