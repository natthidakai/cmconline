import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import ProjectInfo from "../data/projectinfo";
import Loading from "../components/loading";
import ProjectDetails from "../components/ProjectDetails";
import FloorPlanAndUnits from "../components/FloorPlanAndUnits";

const Step1 = ({ projectID }) => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState([]);
    const [selectedTower, setSelectedTower] = useState("");
    const [selectedFloor, setSelectedFloor] = useState("");
    const [unitNumbers, setUnitNumbers] = useState([]);
    const [unitModelIDs, setUnitModelIDs] = useState({});

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const res = await fetch(`/api/callStatus?projectID=${projectID}`);
            if (!res.ok) throw new Error("เครือข่ายมีปัญหา");
            const data = await res.json();
            setStatus(data.status);

            // Assuming data.projects is part of the response
            setProjects(data.projects);
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [projectID]);

    useEffect(() => {
        if (status.length > 0) {
            const initialTower = [...new Set(status.map((unit) => unit.TowerName))][0];
            setSelectedTower(initialTower);
        }
    }, [status]);

    useEffect(() => {
        if (selectedTower) {
            const filteredFloors = status
                .filter((unit) => unit.TowerName === selectedTower)
                .map((unit) => unit.FloorName);
            setSelectedFloor([...new Set(filteredFloors)][0]);
        }
    }, [selectedTower, status]);

    useEffect(() => {
        if (selectedTower && selectedFloor) {
            const filteredUnits = status
                .filter((unit) => unit.TowerName === selectedTower && unit.FloorName === selectedFloor)
                .map((unit) => unit.UnitNumber);
            setUnitNumbers([...new Set(filteredUnits)]);
        }
    }, [selectedTower, selectedFloor, status]);

    const projectInfo = ProjectInfo.find((s) => s.id === projectID);

    const towerNames = [...new Set(status.map((unit) => unit.TowerName))];
    const uniqueFilteredFloors = [
        ...new Set(
            status
                .filter((unit) => unit.TowerName === selectedTower)
                .map((unit) => unit.FloorName)
        ),
    ];

    const floorPlanImagePath = `/images/${projectID}/${selectedTower}/Floor/${selectedFloor}.jpg`;

    return (
        <Container className="py-5">
            {loading ? (
                <Loading />
            ) : (
                <ProjectDetails
                    projectInfo={projectInfo}
                    projectID={projectID}
                />
            )}

            <hr className="my-5" />

            {loading ? (
                <Loading />
            ) : (
                <FloorPlanAndUnits
                selectedTower={selectedTower}
                setSelectedTower={setSelectedTower}
                selectedFloor={selectedFloor}
                setSelectedFloor={setSelectedFloor}
                towerNames={towerNames}
                uniqueFilteredFloors={uniqueFilteredFloors}
                floorPlanImagePath={floorPlanImagePath}
                unitNumbers={unitNumbers}
                unitModelIDs={unitModelIDs}
                projectID={projectID}
            />
            )}
        </Container>
    );
};

export default Step1;
