import React, { useEffect } from "react";
import { useActivities } from "../context/ActivitiesContext";

const ActivityList = () => {
  const { activities, loading, error, fetchActivities } = useActivities();

  // Fetch activities when component loads
  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <p className="p-4">Loading activities...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  if (!activities.length)
    return <p className="p-4">No activities found.</p>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-3">Recent Activities</h2>

      {activities.map((activity) => (
        <div
          key={activity.id}
          className="border p-4 rounded-lg shadow-sm bg-white"
        >
          {/* Type */}
          <p className="text-sm font-bold text-blue-600">
            {activity.type}
          </p>

          {/* Content */}
          <p className="mt-1 text-gray-700">
            {activity.content}
          </p>

          {/* Lead info */}
          <p className="mt-2 text-sm text-gray-500">
            Lead: <span className="font-semibold">{activity.lead?.title}</span>
          </p>

          {/* Created by */}
          <p className="mt-1 text-sm text-gray-500">
            Created By:{" "}
            <span className="font-medium">{activity.createdBy?.name}</span>{" "}
            ({activity.createdBy?.role})
          </p>

          {/* Date */}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(activity.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
