import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Col, Row } from 'react-bootstrap';
import Image from 'next/image';
import Check from "../../assert/images/check.png";
import ProjectInfo from "../api/data/projectinfo";

const UnitDetails = () => {

    const router = useRouter();
    const { projectID, unitNumber, } = router.query;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ค้นหา projectInfo ตาม projectID ที่ได้จาก query
    const projectInfo = ProjectInfo.find((s) => s.id === projectID);
    const [unitDetails, setUnitDetails] = useState([]);

    if (!projectInfo) {
        // กรณีที่ไม่พบ projectInfo ตาม projectID ที่ระบุ
        return <div>ไม่พบข้อมูลโปรเจกต์ที่คุณค้นหา</div>;
    }

    const fetchDetail = async (unitNumber) => {
        // console.log('unitNumber', unitNumber);
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/getDetail?projectID=${projectID}&unitNumber=${unitNumber}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Network response was not ok: ${res.statusText} - ${errorText}`);
            }

            const result = await res.json();
            if (result.success) {
                setUnitDetails(result.status);
            } else {
                throw new Error(result.message || 'No data found');
            }
        } catch (err) {
            console.error('Error fetching detail:', err);
            setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady && projectID && unitNumber) {
            fetchDetail(unitNumber);
        }
    }, [router.isReady, projectID, unitNumber]);

    return (
        <Row className='justify-content-center-m'>
            <Col xxl="12" xl="12" lg="12" md="12" sm="10" xs="10">
                <h5 className='th mb-3'>รายละเอียดเพิ่มเติม</h5>
                <Row className='box-facility'>
                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                        <h6 className='th font-18'>รายละเอียดยูนิต</h6>
                        {unitDetails.map((detail, index) => (
                            <Col key={index}>
                                <Col className="align-items-baseline">
                                    <Image src={Check} alt="" width={14} height={14} />
                                    <Col key={`${detail.topID || 'unknown'}-${index}`} className="th pl-1 font-16 font-300">หมายเลขห้อง : {detail.UnitNumber}</Col>
                                </Col>

                                <Col className="align-items-baseline">
                                    <Image src={Check} alt="" width={14} height={14} />
                                    <Col key={`${detail.topID || 'unknown'}-${index}`} className="th pl-1 font-16 font-300">พื้นที่ใช้สอย : {detail.SellingArea} ตร.ม.</Col>
                                </Col>

                                <Col className="align-items-baseline">
                                    <Image src={Check} alt="" width={14} height={14} />
                                    <Col key={`${detail.topID || 'unknown'}-${index}`} className="th pl-1 font-16 font-300">ชั้น : {detail.FloorName}</Col>
                                </Col>

                                <Col className="align-items-baseline">
                                    <Image src={Check} alt="" width={14} height={14} />
                                    <Col key={`${detail.topID || 'unknown'}-${index}`} className="th pl-1 font-16 font-300">อาคาร : {detail.TowerName}</Col>
                                </Col>
                            </Col>
                        ))}

                    </Col>
                    <Col xxl="6" xl="6" lg="6" md="6" sm="12" xs="12" className='mb-4'>
                        <h6 className='th'>สิ่งอำนวยความสะดวก</h6>
                        <Row>
                            {projectInfo.facilities.map((facility, index) => (
                                <Col key={index} className="font-16 font-300 pb-2 th align-items-baseline" xxl="6" xl="6" lg="6" md="6" sm="6" xs="6" >
                                    <Image src={Check} alt="" width={14} />
                                    <Col className="th pl-1 font-16 font-300">{facility}</Col>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default UnitDetails;
