import { useState } from "react";
import API from "../api/api";

export default function StudentDashboard() {
  const [sessionId, setSessionId] = useState("");

  const mark = async () => {
    await API.markAttendance({
      sessionId,
      status: "PRESENT",
    });
    alert("Marked!");
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Student Dashboard</h2>

      <input
        placeholder="Session ID"
        className="border p-2 mr-2"
        onChange={(e) => setSessionId(e.target.value)}
      />

      <button className="bg-green-500 text-white p-2" onClick={mark}>
        Mark Attendance
      </button>
    </div>
  );
}