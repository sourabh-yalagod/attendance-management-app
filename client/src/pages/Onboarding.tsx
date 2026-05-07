// pages/Onboarding.tsx
import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role =
  | "STUDENT"
  | "TRAINER"
  | "INSTITUTION"
  | "PROGRAMME_MANAGER"
  | "MONITORING_OFFICER";

const ROLES: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Student" },
  { value: "TRAINER", label: "Trainer" },
  { value: "INSTITUTION", label: "Institution" },
  { value: "PROGRAMME_MANAGER", label: "Programme Manager" },
  { value: "MONITORING_OFFICER", label: "Monitoring Officer" },
];

export default function Onboarding() {
  const { user } = useUser() as any;
  const [role, setRole] = useState<Role>("STUDENT");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currantRole = user?.unsafeMetadata?.role as Role | undefined;
    if (!!currantRole) {
      navigate("/");
      return;
    }
    console.log({ users: user });

    // if(!user){
    //   navigate("/login");
    //   return;
    // }
  }, [user]);
  const handleSaveRole = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      localStorage.setItem("user", role);
      navigate("/");
    } catch (err: any) {
      alert(err?.message || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 border rounded-lg shadow-sm w-80 bg-white">
        <h2 className="text-xl font-semibold mb-1">One more step</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select your role to continue
        </p>

        <select
          className="w-full p-2 border rounded mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleSaveRole}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white w-full p-2 rounded transition-colors"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
