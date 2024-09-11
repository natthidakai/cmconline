import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assert/animations/Animation.json';

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