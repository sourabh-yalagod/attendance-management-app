import { useEffect, useState } from "react";
import API from "../api/api";

export default function MonitoringDashboard() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    API.programmeSummary().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl mb-4">Monitoring Officer</h2>

      <div className="border p-4 bg-gray-100">
        Read Only Data → Sessions: {data.total_sessions}
      </div>
    </div>
  );
}