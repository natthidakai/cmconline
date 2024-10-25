import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import ProjectCard from "./components/ProjectCard";
import Image from "next/image";

import Loading from './components/loading';

import Banner from "./assert/images/banner.jpg";
import Condo from "./assert/images/condominium.png";

const Homepage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="bg-white">
      <Image src={Banner} alt="Banner" className="img-full" />

      <Container className="py-5">
        <div className="align-items-baseline justify-content-center-m mt-3">
          <Image src={Condo} alt="Condo" width={42} />
          <span className="text-title th px-3">โครงการทั้งหมด</span>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <ProjectCard />
        )}
      </Container>
    </div>
  );
};

export default Homepage;
