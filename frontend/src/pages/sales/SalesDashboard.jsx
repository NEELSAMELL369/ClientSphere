import CreateLead from "../../components/CreateLead";
import LeadsList from "../../components/LeadsList";
import Navbar from "../../components/Navbar";
import NotificationDropdown from "../../components/NotificationDropdown";
import ActivityList from "../../components/ActivityList";
const SalesDashboard = () => {
  return (
    <div>
      <Navbar />

      <CreateLead />
      <LeadsList />
      <ActivityList />
      <NotificationDropdown />
    </div>
  );
};

export default SalesDashboard;
