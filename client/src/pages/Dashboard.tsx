import Navbar from "../components/Navbar";
import InstitutionDashboard from "./InstitutionDashboard";
import MonitoringDashboard from "./MonitoringDashboard";
import PMDashboard from "./ProgrammeManagerDashboard";
import StudentDashboard from "./StudentDashboard";
import TrainerDashboard from "./TrainerDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user);
  return (
    <div>
      <Navbar />
      <div className="p-6">
        {user.role === "STUDENT" && <StudentDashboard />}
        {user.role === "TRAINER" && <TrainerDashboard />}
        {user.role === "INSTITUTION" && <InstitutionDashboard />}
        {user.role === "PROGRAMME_MANAGER" && <PMDashboard />}
        {user.role === "MONITORING_OFFICER" && <MonitoringDashboard />}
      </div>
    </div>
  );
}