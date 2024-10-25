import React from "react";
import { Container, Row } from "react-bootstrap";

import ProjectDetails from "../components/ProjectDetails";
import FloorPlanAndUnits from "../components/FloorPlanAndUnits";

const Step1 = () => {
    return (
        <Container className="py-5">
            <ProjectDetails/>
            <hr className="my-5" />
            <FloorPlanAndUnits/>
        </Container>
    );
};

export default Step1;
