import { useEffect, useState } from "react";
import API from "../api/api";

export default function PMDashboard() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    API.programmeSummary().then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl mb-4">Programme Manager</h2>

      <div className="border p-4">
        Total Sessions: {data.total_sessions}
      </div>
    </div>
  );
}