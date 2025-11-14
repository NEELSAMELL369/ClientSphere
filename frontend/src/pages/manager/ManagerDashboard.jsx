import CreateLead from "../../components/CreateLead";
import GetAllUsers from "../../components/GetAllUsers";
import LeadsList from "../../components/LeadsList";
import Navbar from "../../components/Navbar";
import NotificationDropdown from "../../components/NotificationDropdown";
import ActivityList from "../../components/ActivityList";


const ManagerDashboard = () => {
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

export default ManagerDashboard;
