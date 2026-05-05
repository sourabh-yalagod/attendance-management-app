import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="font-bold">SkillBridge</h1>
      <div className="flex gap-4">
        <span>{user.role}</span>
        <button onClick={() => navigate("/")}>Dashboard</button>
      </div>
    </div>
  );
}