import CreateLead from "../../components/CreateLead";
import GetAllUsers from "../../components/GetAllUsers";
import LeadsList from "../../components/LeadsList";
import ActivityList from "../../components/ActivityList";
import Navbar from "../../components/Navbar";
import NotificationDropdown from "../../components/NotificationDropdown";

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <GetAllUsers />
      <CreateLead />
      <LeadsList />
      <ActivityList />
      <NotificationDropdown/>
    </div>
  );
};

export default AdminDashboard;
