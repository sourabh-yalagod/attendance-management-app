import { useUser } from "@clerk/react";
import Navbar from "../components/Navbar";
import InstitutionDashboard from "./InstitutionDashboard";
import MonitoringDashboard from "./MonitoringDashboard";
import PMDashboard from "./ProgrammeManagerDashboard";
import StudentDashboard from "./StudentDashboard";
import TrainerDashboard from "./TrainerDashboard";
import type { Role } from "../auth/role";

export default function Dashboard() {
  const { user } = useUser();
  const role = (user?.unsafeMetadata?.role as Role) || undefined;
  console.log({ userRole: user });
  return (
    <div>
      <Navbar />
      <div className="p-6">
        {role === "STUDENT" && <StudentDashboard />}
        {role === "TRAINER" && <TrainerDashboard />}
        {role === "INSTITUTION" && <InstitutionDashboard />}
        {role === "PROGRAMME_MANAGER" && <PMDashboard />}
        {role === "MONITORING_OFFICER" && <MonitoringDashboard />}
      </div>
    </div>
  );
}
