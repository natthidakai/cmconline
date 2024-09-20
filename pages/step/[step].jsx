import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Step1 from '../components/step1';
import Step2 from '../components/step2';
import Step3 from '../components/step3';
import Step4 from '../components/step4';
import StepBar from '../components/stepbar';

const StepPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [projectID, setProjectID] = useState(null); // เพิ่ม state สำหรับ projectID
    const [isReady, setIsReady] = useState(false);

    const { step, stepId } = router.query;

    // รายการของขั้นตอนที่มี
    const totalSteps = 4;

    useEffect(() => {
        if (router.isReady) {
            const stepFromQuery = parseInt(step, 10);
            const projectIDFromQuery = router.query.projectID; // ดึง projectID จาก query
            if (!isNaN(stepFromQuery) && stepFromQuery > 0 && stepFromQuery <= totalSteps) {
                setCurrentStep(stepFromQuery);
                setProjectID(projectIDFromQuery); // ตั้งค่า projectID
            } else {
                setCurrentStep(1); // ตั้งค่าขั้นตอนเริ่มต้นเป็น 1 ถ้าข้อมูล query ไม่ถูกต้อง
            }
            setIsReady(true);
        }
    }, [router.isReady, step, router.query.projectID]);

    const handleStepClick = (step) => {
        if (step <= currentStep) {
            router.push(`/step/${step}?projectID=${projectID}`); // ส่ง projectID ไปพร้อมกับ query
        }
    };

    if (!isReady) {
        return null; // รอจนกว่า router จะพร้อม
    }

    const renderContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1 currentStep={currentStep} projectID={projectID} />;
            case 2:
                return <Step2 currentStep={currentStep} projectID={projectID} />;
            case 3:
                return <Step3 currentStep={currentStep} projectID={projectID} />;
            case 4:
                return <Step4 currentStep={currentStep} projectID={projectID} />;
            default:
                return <div>ไม่พบขั้นตอนที่คุณกำลังค้นหา</div>; // แสดงข้อผิดพลาดหากไม่พบขั้นตอน
        }
    };

    return (
        <>
            <StepBar currentStep={currentStep} handleStepClick={handleStepClick} />
            <div className="step-content">
                {renderContent()} {/* แสดงเนื้อหาตาม currentStep */}
            </div>
        </>
    );
};

export default StepPage;
