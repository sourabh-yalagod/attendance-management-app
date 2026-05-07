import { useState, useEffect } from "react";
import API from "../api/api";

interface Batch {
  id: string;
  name: string;
  student_count: number;
  trainer_count: number;
  attendance_rate: number;
}

interface SessionSummary {
  session_id: string;
  title: string;
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
}

interface Trainer {
  id: string;
  name: string;
  batches: string[];
}

interface InstitutionStats {
  total_batches: number;
  avg_attendance: number;
  active_trainers: number;
}

export default function InstitutionDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [summary, setSummary] = useState<SessionSummary[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [stats, setStats] = useState<InstitutionStats>({
    total_batches: 0,
    avg_attendance: 0,
    active_trainers: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all batches + trainers for this institution
  const fetchInstitutionData = async () => {
    setLoadingBatches(true);
    try {
      const [batchRes, trainerRes] = await Promise.all([
        API.getInstitutionBatches(), // GET /institutions/:id/batches
        API.getInstitutionTrainers(), // GET /institutions/:id/trainers
      ]);
      const batchList: Batch[] = batchRes.data;
      setBatches(batchList);
      setTrainers(trainerRes.data);

      // Compute stats from batch list
      const avgRate =
        batchList.length > 0
          ? Math.round(
              batchList.reduce((sum, b) => sum + b.attendance_rate, 0) /
                batchList.length,
            )
          : 0;
      const uniqueTrainers = new Set(trainerRes.data.map((t: Trainer) => t.id))
        .size;
      setStats({
        total_batches: batchList.length,
        avg_attendance: avgRate,
        active_trainers: uniqueTrainers,
      });

      // Auto-select first batch
      if (batchList.length > 0) {
        handleSelectBatch(batchList[0]);
      }
    } catch {
      showToast("Failed to load institution data", "error");
    } finally {
      setLoadingBatches(false);
    }
  };

  // Fetch attendance summary for a batch
  const handleSelectBatch = async (batch: Batch) => {
    setSelectedBatch(batch);
    setLoadingSummary(true);
    setSummary([]);
    try {
      const res = await API.batchSummary(batch.id); // GET /batches/:id/summary
      setSummary(res.data);
    } catch {
      showToast(`Failed to load summary for ${batch.name}`, "error");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchInstitutionData();
  }, []);

  const rateColor = (rate: number) => {
    if (rate >= 85) return "text-emerald-400";
    if (rate >= 70) return "text-amber-400";
    return "text-red-400";
  };

  const barColor = (rate: number) => {
    if (rate >= 85) return "bg-emerald-400";
    if (rate >= 70) return "bg-amber-400";
    return "bg-red-400";
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-sm border
          ${toast.type === "success" ? "bg-[#1e2433] border-violet-500 text-violet-400" : "bg-[#1e2433] border-red-500 text-red-400"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Institution Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user.institution_name || "Your Institution"} · Admin View
          </p>
        </div>
        <span className="bg-[#1e2433] border border-[#2d3748] px-3 py-1.5 rounded-full text-xs text-violet-400 font-mono">
          INSTITUTION
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Batches",
            value: stats.total_batches,
            color: "text-violet-400",
            sub: "Across all programmes",
          },
          {
            label: "Avg Attendance",
            value: `${stats.avg_attendance}%`,
            color: "text-emerald-400",
            sub: "This month",
          },
          {
            label: "Active Trainers",
            value: stats.active_trainers,
            color: "text-blue-400",
            sub: "Across batches",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5"
          >
            <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
              {s.label}
            </p>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Batch Cards */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
          Batches — Select to view summary
        </p>

        {loadingBatches ? (
          <p className="text-center text-gray-600 text-sm py-8">
            Loading batches...
          </p>
        ) : batches.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8">
            No batches found for this institution
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                onClick={() => handleSelectBatch(batch)}
                className={`bg-[#0f1117] border rounded-xl p-4 cursor-pointer transition-colors
                  ${selectedBatch?.id === batch.id ? "border-violet-600" : "border-[#1e2433] hover:border-gray-600"}`}
              >
                <h3 className="text-sm font-medium text-gray-200 mb-2">
                  {batch.name}
                </h3>
                <div className="flex gap-4 mb-3">
                  <span className="text-xs text-gray-500 font-mono">
                    {batch.student_count} students
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {batch.trainer_count} trainers
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${rateColor(batch.attendance_rate)}`}
                  >
                    {batch.attendance_rate}% att.
                  </span>
                </div>
                <div className="bg-[#1e2433] rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${barColor(batch.attendance_rate)}`}
                    style={{ width: `${batch.attendance_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Batch Attendance Summary Table */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
          Attendance Summary
          {selectedBatch && (
            <span className="text-violet-400 normal-case tracking-normal font-normal ml-1">
              — {selectedBatch.name}
            </span>
          )}
        </p>

        {!selectedBatch ? (
          <p className="text-center text-gray-600 text-sm py-6 border border-dashed border-[#1e2433] rounded-lg">
            Select a batch above to view its session attendance
          </p>
        ) : loadingSummary ? (
          <p className="text-center text-gray-600 text-sm py-8">
            Loading summary...
          </p>
        ) : summary.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8">
            No sessions recorded for this batch yet
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Session", "Date", "Present", "Absent", "Late", "Rate"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] uppercase tracking-widest text-gray-500 pb-3 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {summary.map((row, i) => (
                <tr key={i} className="border-t border-[#1e2433]">
                  <td className="py-3 text-sm text-gray-200">{row.title}</td>
                  <td className="py-3 text-xs text-gray-500 font-mono">
                    {row.date}
                  </td>
                  <td className="py-3 text-sm text-emerald-400">
                    {row.present}
                  </td>
                  <td className="py-3 text-sm text-red-400">{row.absent}</td>
                  <td className="py-3 text-sm text-amber-400">{row.late}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-semibold ${rateColor(row.rate)}`}
                      >
                        {row.rate}%
                      </span>
                      <div className="flex-1 bg-[#1e2433] rounded-full h-1 w-16 overflow-hidden">
                        <div
                          className={`h-1 rounded-full ${barColor(row.rate)}`}
                          style={{ width: `${row.rate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Trainers */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Trainers in this Institution
        </p>

        {trainers.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-6">
            No trainers assigned yet
          </p>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="flex items-center justify-between py-3 border-b border-[#1e2433] last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2d1b69] flex items-center justify-center text-xs font-semibold text-violet-400">
                  {initials(trainer.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {trainer.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {trainer.batches.join(" · ")}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-[#1e2433] text-gray-400 rounded">
                {trainer.batches.length} batch
                {trainer.batches.length !== 1 ? "es" : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
