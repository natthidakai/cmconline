import React from "react";
import { Container, Row } from "react-bootstrap";

import ProjectDetails from "./ProjectDetails";
import FloorPlanAndUnits from "./FloorPlanAndUnits";

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
