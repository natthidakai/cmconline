import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectInfo from "../data/projectinfo";
import { Container, Row, Col } from "react-bootstrap";
import Image from 'next/image';
import Loading from './loading';
import Pin from "../assert/images/pin.png";

const Step2 = () => {
    const router = useRouter();
    const { projectID, floorName, unitNumber, towerName } = router.query;

    const projectInfo = ProjectInfo.find((s) => s.id === projectID);

    const [unitModelIDs, setUnitModelIDs] = useState({});
    const [unitDetails, setUnitDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchModelID = async (unitNumber) => {
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
        console.log('unitNumber', unitNumber);
        try {
            const res = await fetch(`/api/getDetail?projectID=${projectID}&unitNumber=${unitNumber}`); // Adjust API endpoint if needed
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
        if (projectID && unitNumber) {
            fetchModelID(unitNumber);
            fetchDetail(unitNumber);
        }
    }, [projectID, unitNumber]);



    const modelID = unitModelIDs[unitNumber];
    const unitPlanImagePath = modelID ? `/images/${projectID}/${towerName}/Unit/${modelID}.jpg` : '';

    return (
        <Container className='py-5'>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
                <Loading />
            ) : (
                <div>
                    {Object.entries(unitModelIDs).map(([unitNumber, modelID]) => (
                        <Row key={unitNumber} className='mb-4'>
                            <Col>
                                {modelID && (
                                    <Image
                                        src={unitPlanImagePath}
                                        alt={`Floor plan for ${floorName} of ${modelID}`}
                                        width={800}
                                        height={500}
                                        className="img-floorplan"
                                    />
                                )}
                            </Col>
                            <Col>
                                <Col className="th project-name name-info">{projectInfo.nameProject}</Col>
                                <Col xxl="7" xl="7" lg="7" md="10" sm="12" xs="12" className='mb-3'>
                                    <Row>
                                        <Col className="align-items-baseline">
                                            <Image src={Pin} alt="" width={18} height={18} />
                                            <span className="th px-2 name-location">{projectInfo.location}</span>
                                        </Col>
                                        {unitDetails.length > 0 && (
    <Col className="align-items-baseline">
        <Image src={Pin} alt="" width={18} height={18} />
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
                                            <Row>
                                                <Col key={index} className='th'>ห้องขนาด {detail.SellingArea} ตร.ม.</Col>
                                                <Col key={index} className='th'>{detail.ProjectTel}</Col>
                                            </Row>

                                        ))}
                                    </Col>
                                )}
                            </Col>
                        </Row>
                    ))}
                </div>
            )}

            <hr className="my-5" />
        </Container>
    );
};

export default Step2;
