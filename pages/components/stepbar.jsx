import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';

const StepBar = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            console.log('Router is ready');
            console.log('Router Query:', router.query); // ตรวจสอบค่าทั้งหมดใน query
            const stepFromQuery = parseInt(router.query.step, 10);
            if (!isNaN(stepFromQuery) && stepFromQuery > 0) {
                setCurrentStep(stepFromQuery);
            } else {
                setCurrentStep(1); // ใช้ค่าเริ่มต้นถ้าพารามิเตอร์ไม่ถูกต้อง
            }
            setIsReady(true);
        }
    }, [router.isReady, router.query.step]);

    const handleStepClick = (step) => {
        if (step <= currentStep) {
            router.push(`/step/${step}`);
        }
    };

    if (!isReady) {
        return null; // รอจนกว่าค่า router จะพร้อม
    }

    return (
        <div className='stepbar-bg py-5'>
            <Container className='justify-content-center'>
                <Col xxl="6" xl="6" lg="7" md="10" sm="12" xs="12">
                    <Row className="step-row">
                        {[1, 2, 3, 4].map(step => (
                            <Col key={step} className={`step-col ${currentStep >= step ? 'active' : ''}`}>
                                <Button
                                    className={`box-step ${currentStep === step ? 'active' : ''} mb-2`}
                                    onClick={() => handleStepClick(step)}
                                    disabled={step > currentStep}
                                >
                                    {step}
                                </Button>
                                <div className='th text-align-center font-14'>
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
