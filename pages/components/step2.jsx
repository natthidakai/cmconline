import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectInfo from "../data/projectinfo";
import { Container } from "react-bootstrap";
import Loading from './loading';
import UnitDetailsBooking from './UnitDetailsBooking';
import UnitDetails from './UnitDetails';

const Step2 = () => {
    const router = useRouter();
    const { projectID, floorName, unitNumber, towerName } = router.query;

    const projectInfo = ProjectInfo.find((s) => s.id === projectID);

    const [unitModelIDs, setUnitModelIDs] = useState({});
    const [unitDetails, setUnitDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        console.log('unitNumber', unitNumber);
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

    const modelID = unitModelIDs[unitNumber];
    const unitPlanImagePath = modelID ? `/images/${projectID}/${towerName}/Unit/${modelID}.jpg` : '';

    return (
        <Container className='py-5'>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
                <Loading />
            ) : (
                <>
                    <UnitDetailsBooking
                        unitModelIDs={unitModelIDs}
                        unitPlanImagePath={unitPlanImagePath}
                        floorName={floorName}
                        projectInfo={projectInfo}
                        unitDetails={unitDetails}
                        projectID={projectID} // Ensure correct routing
                        selectedFloor={floorName}
                        selectedTower={towerName}
                    />
                    <hr className="my-5" />
                    <UnitDetails unitDetails={unitDetails} projectInfo={projectInfo} />
                </>
            )}
        </Container>
    );
};

export default Step2;
