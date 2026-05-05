import { useState } from "react";
import API from "../api/api";

export default function TrainerDashboard() {
  const [batchId, setBatchId] = useState("");

  const createSession = async () => {
    const res = await API.createSession({
      batchId,
      title: "React Class",
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    });
    alert("Session Created: " + res.data.id);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Trainer Dashboard</h2>

      <input
        placeholder="Batch ID"
        className="border p-2 mr-2"
        onChange={(e) => setBatchId(e.target.value)}
      />

      <button className="bg-blue-500 text-white p-2" onClick={createSession}>
        Create Session
      </button>
    </div>
  );
}