export const fetchProjects = async () => {
  try {
    const res = await fetch("/api/callProject");
    const data = await res.json();

    if (data.success && Array.isArray(data.projects)) {
      const projectsWithAvailableUnits = await Promise.all(
        data.projects
          .filter(project => project.ProjectStatus !== '3')
          .map(async project => {
            const unitAvailable = await fetchStatus(project.ProjectID);
            return unitAvailable ? project : null;
          })
      );

      return projectsWithAvailableUnits.filter(Boolean); // Filter out null values
    } else {
      throw new Error("Data format is incorrect");
    }
  } catch (err) {
    throw new Error("Error fetching data");
  }
};

export const fetchStatus = async (projectID) => {
  try {
    const res = await fetch(`/api/callStatus?projectID=${projectID}`);
    const data = await res.json();
    if (data.success) {
      return data.status.some(unit => unit.UnitStatus === 'Available');
    }
    return false;
  } catch (err) {
    console.error("Error fetching status", err);
    return false;
  }
};
