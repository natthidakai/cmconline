import React from 'react';
import { Container, Col, Row, Button } from "react-bootstrap";

const StepBar = ({ currentStep, handleStepClick }) => {

  return (
    <div className="stepbar-bg py-5">
      <Container className="justify-content-center">
        <Col xxl="6" xl="6" lg="7" md="10" sm="12" xs="12">
          <Row className="step-row">
            {[1, 2, 3, 4].map((step) => (
              <Col
                key={step}
                className={`step-col ${currentStep >= step ? "active" : ""}`}
              >
                <Button
                  className={`box-step ${
                    currentStep >= step ? "step-active" : ""
                  } mb-2`}
                  onClick={() => handleStepClick(step)}
                  disabled={step > currentStep}
                >
                  {step}
                </Button>
                <div className="th text-align-center font-14">
                  ขั้นตอนที่ {step}
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Container>
    </div>
  );
};

export default StepBar;
