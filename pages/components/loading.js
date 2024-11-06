import React from 'react';
import dynamic from 'next/dynamic';
import animationData from '../../assert/animations/Animation.json';

// โหลด Lottie โดยใช้ dynamic import
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

const Loading = () => {
    // กำหนดค่าเริ่มต้นสำหรับแอนิเมชัน
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // ไฟล์ JSON ของแอนิเมชัน Lottie
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Lottie options={defaultOptions} height={200} width={200} /> {/* แสดงแอนิเมชัน */}
        </div>
    );
};

export default Loading;