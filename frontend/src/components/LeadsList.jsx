import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  selectLeads,
  selectLoading,
  selectError,
} from "../redux/slices/leadsSlice";
import LeadCard from "./LeadCard";

const LeadsList = () => {
  const dispatch = useDispatch();
  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-4">Loading leads...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-red-500">
        {typeof error === "string" ? error : error.message}
      </p>
    );
  if (!leads || leads.length === 0)
    return <p className="text-center mt-4">No leads found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
};

export default LeadsList;
