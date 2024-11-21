import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Row, Col, Button } from "react-bootstrap";
import Image from 'next/image';
import Pin from "../../assert/images/pin.png";
import Call from "../../assert/images/phone-call.png";

import ProjectInfo from "../api/data/projectinfo";

import Loading from './loading';

const UnitDetailsBooking = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();
    const { projectID, floorName, unitNumber, towerName } = router.query;

    const projectInfo = ProjectInfo.find((s) => s.id === projectID);
    const [unitDetails, setUnitDetails] = useState([]);

    const [unitModelIDs, setUnitModelIDs] = useState({});

    const modelID = unitModelIDs[unitNumber];
    const unitPlanImagePath = modelID ? `/images/${projectID}/${towerName}/Unit/${modelID}.jpg` : '';

    const fetchModelID = async (unitNumber) => {
        setError(null); // Reset error before new request
        try {
            const res = await fetch(`/api/getModelIDs?projectID=${projectID}&unitNumber=${unitNumber}`);
            if (!res.ok) throw new Error("Network response was not ok");

            const data = await res.json();
            if (data.success) {
                const unitModelMap = data.status.reduce((acc, item) => {
                    acc[item.UnitNumber] = item.ModelID;
                    return acc;
                }, {});
                setUnitModelIDs(unitModelMap);
            } else {
                throw new Error(data.message || "No data found");
            }
        } catch (err) {
            console.error("Fetch Unit Model IDs Error:", err);
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
    };

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
            fetchModelID(unitNumber);
            fetchDetail(unitNumber);
        }
    }, [router.isReady, projectID, unitNumber]);

    return (
        <Col>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {Object.entries(unitModelIDs).map(([unitNumber, modelID]) => (
                        <Row key={unitNumber} className='mb-4 justify-content-center-m'>
                            <Col className='center mb-4' xxl="4" xl="4" lg="6" md="6" sm="10" xs="10">
                                {modelID && (
                                    <Image
                                        src={unitPlanImagePath}
                                        alt={`Floor plan for ${floorName} of ${modelID}`}
                                        width={800}
                                        height={500}
                                        className="img-full"
                                    />
                                )}
                            </Col>
                            <Col className='align-content-center box-facility' xxl="8" xl="8" lg="6" md="6" sm="10" xs="10">
                                <Col className="th project-name name-info">{projectInfo.nameProject}</Col>
                                <Col xxl="7" xl="7" lg="7" md="10" sm="12" xs="12" className='mb-3'>
                                    <Row>
                                        <Col className="align-items-baseline">
                                            <Image src={Pin} alt="" width={18} height={18} />
                                            <span className="th px-2 name-location">{projectInfo.location}</span>
                                        </Col>
                                        {unitDetails.length > 0 && (
                                            <Col className="align-items-baseline">
                                                <Image src={Call} alt="" width={18} height={18} />
                                                {unitDetails.map((detail, index) => (
                                                    <Col key={`${detail.topID}-${index}`} className="th px-2 name-location">{detail.ProjectTel}</Col>
                                                ))}
                                            </Col>
                                        )}
                                    </Row>
                                </Col>

                                <Col className="th projectinfo-dec mb-3">
                                    {projectInfo.description}
                                </Col>

                                {unitDetails.length > 0 && (
                                    <Col xxl="8">
                                        {unitDetails.map((detail, index) => (
                                            <Col key={index}>
                                                <h5 className='th'>ราคา (บาท)</h5>
                                                <Row>
                                                    <Col className='th'>ราคาต่อ ตร.ม.</Col>
                                                    <Col className='th'>
                                                        {detail.PricePerArea !== null && detail.PricePerArea !== undefined
                                                            ? `${detail.PricePerArea.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`
                                                            : 'ข้อมูลไม่พร้อมใช้งาน'}
                                                    </Col>
                                                </Row>

                                                <Row className='mb-4'>
                                                    <Col className='th'>ราคาสุทธิ</Col>
                                                    <Col className='th'>
                                                        {detail.SellingPrice !== null && detail.SellingPrice !== undefined
                                                            ? `${detail.SellingPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`
                                                            : 'ข้อมูลไม่พร้อมใช้งาน'}
                                                    </Col>
                                                </Row>

                                                <h5 className='th'>รายละเอียดการจ่ายเงิน (บาท)</h5>

                                                <Row className='mb-4'>
                                                    <Col className='th'>ราคาจอง</Col>
                                                    <Col className='th'>
                                                        {detail.BookAmount !== null && detail.BookAmount !== undefined
                                                            ? `${detail.BookAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`
                                                            : 'ข้อมูลไม่พร้อมใช้งาน'}
                                                    </Col>
                                                </Row>

                                                {/* Corrected the Button and unitNumber reference */}
                                                <Button className="btn-xl th" href={`/step/3?projectID=${projectID}&floorName=${floorName}&towerName=${towerName}&unitNumber=${unitNumber}`}>
                                                    จองทันที
                                                </Button>
                                            </Col>
                                        ))}
                                    </Col>
                                )}
                            </Col>
                        </Row>
                    ))}
                </>
            )}
        </Col>
    );
};

export default UnitDetailsBooking;
