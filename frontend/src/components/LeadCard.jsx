import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeLead } from "../redux/slices/leadsSlice";
import EditLeadModal from "./EditLeadModal";

const LeadCard = ({ lead }) => {
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${lead.title}"?`)) {
      dispatch(removeLead(lead.id));
    }
  };

  return (
    <div className="border rounded p-4 shadow mb-4 bg-white relative">
      <h3 className="text-xl font-bold mb-2">
        {lead.owner?.name || "Unassigned"}
      </h3>
      <p><strong>Title:</strong> {lead.title}</p>
      <p><strong>Email:</strong> {lead.email}</p>
      <p><strong>Phone:</strong> {lead.phone}</p>
      <p><strong>Status:</strong> {lead.status}</p>

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setIsEditOpen(true)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      {isEditOpen && (
        <EditLeadModal
          lead={lead}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};

export default LeadCard;
