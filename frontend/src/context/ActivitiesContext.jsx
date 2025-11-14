import { createContext, useContext, useState } from "react";
import { getAllActivities } from "../services/activityService";

const ActivitiesContext = createContext();

export const ActivitiesProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(activities)
  const fetchActivities = async () => {
    try {
      setLoading(true);

      const res = await getAllActivities(); // no filters
      setActivities(res.data.activities || []);
      setError(null);

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        loading,
        error,
        fetchActivities,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => useContext(ActivitiesContext);
