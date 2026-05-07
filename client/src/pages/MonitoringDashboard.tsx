import { useEffect, useState } from "react";
import API from "../api/api";

interface InstitutionStat {
  id: string;
  name: string;
  batch_count: number;
  student_count: number;
  attendance_rate: number;
}

interface LowAttendanceBatch {
  batch_id: string;
  batch_name: string;
  institution_name: string;
  student_count: number;
  attendance_rate: number;
}

interface ProgrammeSummary {
  total_sessions: number;
  total_students: number;
  total_batches: number;
  total_institutions: number;
  sessions_this_month: number;
  total_marks: number;
  present_rate: number;
  late_rate: number;
  absent_rate: number;
  institutions: InstitutionStat[];
  low_attendance_batches: LowAttendanceBatch[];
  weekly_activity: number[][];  // [week][day] session counts
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<ProgrammeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.programmeSummary(); // GET /programme/summary
        setData(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to load programme data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rateColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400";
    if (rate >= 70) return "text-amber-400";
    return "text-red-400";
  };

  const barColor = (rate: number) => {
    if (rate >= 80) return "bg-emerald-400";
    if (rate >= 70) return "bg-amber-400";
    return "bg-red-400";
  };

  const heatColor = (count: number) => {
    if (count === 0) return "bg-[#1e2433]";
    if (count <= 2) return "bg-[#14532d] text-green-300";
    if (count <= 3) return "bg-[#166534] text-green-200";
    if (count <= 4) return "bg-[#15803d] text-green-100";
    return "bg-[#16a34a] text-green-50";
  };

  const initials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading programme data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || "No data available"}</p>
      </div>
    );
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Monitoring Officer</h1>
          <p className="text-sm text-gray-500 mt-0.5">Programme-wide read-only view</p>
        </div>
        <span className="bg-[#1e2433] border border-[#2d3748] px-3 py-1.5 rounded-full text-xs text-orange-400 font-mono">
          READ ONLY
        </span>
      </div>

      {/* Read-only banner — always visible, no dismiss */}
      <div className="flex items-center gap-2 bg-[#1c1a10] border border-amber-900 rounded-lg px-4 py-2.5 mb-7 text-xs text-amber-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        You have read-only access. No create, edit, or delete actions are available on this dashboard.
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Sessions", value: data.total_sessions, color: "text-orange-400", sub: "Across all batches" },
          { label: "Programme Attendance", value: `${data.present_rate}%`, color: "text-emerald-400", sub: "Overall rate" },
          { label: "Total Students", value: data.total_students, color: "text-blue-400", sub: "Enrolled" },
          { label: "Institutions", value: data.total_institutions, color: "text-violet-400", sub: "Active" },
        ].map(s => (
          <div key={s.label} className="bg-[#161b27] border border-[#1e2433] rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Institution breakdown + Alerts + Totals */}
      <div className="grid grid-cols-2 gap-5 mb-5">

        {/* Institutions */}
        <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
            Institutions — Attendance Breakdown
          </p>
          {data.institutions.map(inst => (
            <div key={inst.id} className="flex items-center justify-between py-3 border-b border-[#1e2433] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1c1917] flex items-center justify-center text-xs font-semibold text-orange-400 shrink-0">
                  {initials(inst.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{inst.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {inst.batch_count} batches · {inst.student_count} students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="w-20 bg-[#1e2433] rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${barColor(inst.attendance_rate)}`}
                    style={{ width: `${inst.attendance_rate}%` }}
                  />
                </div>
                <span className={`text-xs font-mono font-semibold ${rateColor(inst.attendance_rate)}`}>
                  {inst.attendance_rate}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts + Programme totals stacked */}
        <div className="flex flex-col gap-4">

          {/* Low attendance alerts */}
          <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
              Low Attendance Alerts (&lt; 70%)
            </p>
            {data.low_attendance_batches.length === 0 ? (
              <p className="text-center text-gray-600 text-sm py-4">No batches below threshold</p>
            ) : (
              data.low_attendance_batches.map(b => (
                <div
                  key={b.batch_id}
                  className="flex items-center justify-between px-3 py-2.5 bg-[#0f1117] border border-red-950 rounded-lg mb-2 last:mb-0"
                >
                  <div>
                    <p className="text-sm text-red-300">{b.batch_name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{b.institution_name} · {b.student_count} students</p>
                  </div>
                  <span className="text-sm font-mono font-semibold text-red-400">{b.attendance_rate}%</span>
                </div>
              ))
            )}
          </div>

          {/* Programme totals */}
          <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              Programme Totals
            </p>
            <table className="w-full">
              <tbody>
                {[
                  { label: "Total Batches", value: data.total_batches, color: "text-gray-200" },
                  { label: "Sessions This Month", value: data.sessions_this_month, color: "text-gray-200" },
                  { label: "Attendance Marks", value: data.total_marks.toLocaleString(), color: "text-gray-200" },
                  { label: "Present Rate", value: `${data.present_rate}%`, color: "text-emerald-400" },
                  { label: "Late Rate", value: `${data.late_rate}%`, color: "text-amber-400" },
                  { label: "Absent Rate", value: `${data.absent_rate}%`, color: "text-red-400" },
                ].map(row => (
                  <tr key={row.label} className="border-b border-[#1e2433] last:border-b-0">
                    <td className="py-2.5 text-xs text-gray-500">{row.label}</td>
                    <td className={`py-2.5 text-xs font-mono font-semibold text-right ${row.color}`}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Weekly activity heatmap */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
          Session Activity — Last {data.weekly_activity.length} Weeks
        </p>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
          {/* Day labels */}
          {days.map(d => (
            <div key={d} className="text-[10px] text-gray-600 text-center pb-1">{d}</div>
          ))}
          {/* Cells */}
          {data.weekly_activity.flatMap((week, wi) =>
            week.map((count, di) => (
              <div
                key={`${wi}-${di}`}
                className={`h-7 rounded flex items-center justify-center text-[10px] font-mono ${heatColor(count)}`}
              >
                {count > 0 ? count : ""}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}