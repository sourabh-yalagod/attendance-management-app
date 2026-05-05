import { useState } from "react";
import API from "../api/api";

export default function InstitutionDashboard() {
  const [batchId, setBatchId] = useState("");
  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    const res = await API.batchSummary(batchId);
    setData(res.data);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Institution Dashboard</h2>

      <input
        placeholder="Batch ID"
        className="border p-2 mr-2"
        onChange={(e) => setBatchId(e.target.value)}
      />

      <button className="bg-purple-500 text-white p-2" onClick={load}>
        Load Summary
      </button>

      <div className="mt-4">
        {data.map((item, i) => (
          <div key={i} className="border p-2 mb-2">
            Session: {item.session_id} | Total: {item.total}
          </div>
        ))}
      </div>
    </div>
  );
}