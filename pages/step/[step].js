import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Step1 from '../components/step1';
import Step2 from '../components/step2';
import Step3 from '../components/step3';
import Step4 from '../components/step4';
import StepBar from '../components/stepbar';

const StepPage = ({ projectID }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isReady, setIsReady] = useState(false);

    const { step } = router.query;

    const totalSteps = 4;

    useEffect(() => {
        if (router.isReady) {
            const stepFromQuery = parseInt(step, 10);
            if (!isNaN(stepFromQuery) && stepFromQuery > 0 && stepFromQuery <= totalSteps) {
                setCurrentStep(stepFromQuery);
            } else {
                setCurrentStep(1);
            }
            setIsReady(true);
        }
    }, [router.isReady, step]);

    const handleStepClick = (step) => {
        if (step <= currentStep) {
            router.push(`/step/${step}?projectID=${projectID}`);
        }
    };

    if (!isReady) {
        return null;
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
                return <div>ไม่พบขั้นตอนที่คุณกำลังค้นหา</div>;
        }
    };

    return (
        <>
            <StepBar currentStep={currentStep} handleStepClick={handleStepClick} />
            <div className="step-content">
                {renderContent()}
            </div>
        </>
    );
};

export async function getStaticPaths() {
    return {
        paths: [
            { params: { step: '1' } },
            { params: { step: '2' } },
            { params: { step: '3' } },
            { params: { step: '4' } },
        ],
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const projectID = params.projectID || null;
    return {
        props: { projectID },
    };
}

export default StepPage;
