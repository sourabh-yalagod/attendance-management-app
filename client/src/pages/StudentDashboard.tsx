import { useState, useEffect } from "react";
import API from "../api/api";

interface Session {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  batch_id: string;
  isActive: boolean;
}

interface AttendanceRecord {
  session_id: string;
  session_title: string;
  date: string;
  status: "present" | "absent" | "late";
}

interface BatchInfo {
  id: string;
  name: string;
}

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [batch, setBatch] = useState<BatchInfo | null>(null);
  const [inviteToken, setInviteToken] = useState("");
  const [markedSessions, setMarkedSessions] = useState<Set<string>>(new Set());
  const [loadingMark, setLoadingMark] = useState<string | null>(null);
  const [joiningBatch, setJoiningBatch] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "present" | "absent" | "late"
  >("all");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [stats, setStats] = useState({
    rate: 0,
    active: 0,
    total: 0,
    present: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const showToast = (
    msg: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch active sessions for the student's batch
  const fetchSessions = async () => {
    try {
      const res = await API.getStudentSessions(); // GET /sessions/my
      const all: Session[] = res.data;
      setSessions(all);
      setStats((prev) => ({
        ...prev,
        active: all.filter((s) => s.isActive).length,
      }));
    } catch {
      showToast("Failed to load sessions", "error");
    }
  };

  // Fetch attendance history
  const fetchHistory = async () => {
    try {
      const res = await API.getMyAttendance(); // GET /attendance/my
      const records: AttendanceRecord[] = res.data;
      setHistory(records);
      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      setStats((prev) => ({
        ...prev,
        total,
        present,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      }));
    } catch {
      showToast("Failed to load attendance history", "error");
    }
  };

  // Fetch batch info
  const fetchBatch = async () => {
    try {
      const res = await API.getMyBatch();
      setBatch(res.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchHistory();
    fetchBatch();
  }, []);

  const handleMarkAttendance = async (sessionId: string) => {
    setLoadingMark(sessionId);
    try {
      await API.markAttendance({ sessionId, status: "present" });
      setMarkedSessions((prev) => new Set(prev).add(sessionId));
      showToast("Attendance marked successfully!");
      fetchHistory(); // refresh stats
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to mark attendance";
      showToast(msg, "error");
    } finally {
      setLoadingMark(null);
    }
  };

  const handleJoinBatch = async () => {
    if (!inviteToken.trim()) {
      showToast("Please enter an invite token", "error");
      return;
    }
    setJoiningBatch(true);
    try {
      await API.joinBatch(inviteToken.trim());
      showToast("Successfully joined batch!");
      setInviteToken("");
      fetchBatch();
      fetchSessions();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Invalid or expired invite token";
      showToast(msg, "error");
    } finally {
      setJoiningBatch(false);
    }
  };

  const filteredHistory =
    activeTab === "all"
      ? history
      : history.filter((r) => r.status === activeTab);

  const statusChip = (status: string) => {
    const map: Record<string, string> = {
      present: "bg-emerald-900 text-emerald-400 border border-emerald-800",
      absent: "bg-red-950 text-red-400 border border-red-900",
      late: "bg-amber-950 text-amber-400 border border-amber-900",
    };
    return map[status] || "bg-gray-800 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 p-6 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-sm border
            ${toast.type === "success" ? "bg-[#1e2433] border-emerald-500 text-emerald-400" : ""}
            ${toast.type === "error" ? "bg-[#1e2433] border-red-500 text-red-400" : ""}
            ${toast.type === "info" ? "bg-[#1e2433] border-blue-500 text-blue-400" : ""}
          `}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Student Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {user.name || "Student"}
          </p>
        </div>
        <span className="bg-[#1e2433] border border-[#2d3748] px-3 py-1.5 rounded-full text-xs text-blue-400 font-mono">
          STUDENT
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          {
            label: "Attendance Rate",
            value: `${stats.rate}%`,
            sub: `${stats.present} of ${stats.total} sessions`,
            color: "text-emerald-400",
          },
          {
            label: "Active Sessions",
            value: stats.active,
            sub: "Open for marking",
            color: "text-blue-400",
          },
          {
            label: "Batch",
            value: batch?.name || "—",
            sub: batch ? "Enrolled" : "Not enrolled yet",
            color: "text-white text-base pt-1",
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

      {/* Active Sessions */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Active Sessions — Mark Attendance
        </p>

        {sessions.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-8">
            No sessions available right now
          </p>
        )}

        {sessions.map((session) => {
          const alreadyMarked = markedSessions.has(session.id);
          const isLoading = loadingMark === session.id;
          return (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-[#0f1117] border border-[#1e2433] rounded-lg mb-2.5 last:mb-0 hover:border-gray-600 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {session.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  {session.date} · {session.start_time}–{session.end_time} · #
                  {session.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {session.isActive ? (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#1e2433] text-gray-500 border border-[#2d3748]">
                    CLOSED
                  </span>
                )}
                {session.isActive && !alreadyMarked ? (
                  <button
                    onClick={() => handleMarkAttendance(session.id)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? "Marking..." : "Mark Present"}
                  </button>
                ) : alreadyMarked ? (
                  <button
                    disabled
                    className="px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 text-xs font-medium rounded-lg"
                  >
                    ✓ Marked
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-3 py-1.5 bg-transparent text-gray-600 border border-[#2d3748] text-xs font-medium rounded-lg"
                  >
                    Closed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance History */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6 mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
          Attendance History
        </p>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 bg-[#0f1117] p-1 rounded-lg border border-[#1e2433] w-fit">
          {(["all", "present", "absent", "late"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs transition-all capitalize
                ${activeTab === tab ? "bg-[#1e2433] text-gray-200" : "text-gray-500 hover:text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-6">
            No records found
          </p>
        )}

        {filteredHistory.map((record, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-[#1e2433] last:border-b-0"
          >
            <div>
              <p className="text-sm text-gray-300">{record.session_title}</p>
              <p className="text-xs text-gray-600 font-mono mt-0.5">
                {record.date}
              </p>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded uppercase ${statusChip(record.status)}`}
            >
              {record.status}
            </span>
          </div>
        ))}
      </div>

      {/* Join Batch */}
      {!batch && (
        <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Join a Batch via Invite Link
          </p>
          <div className="flex items-center gap-3 bg-[#0f1117] border border-dashed border-[#2d3748] rounded-lg p-4">
            <input
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              placeholder="Paste invite token here..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-blue-400 font-mono placeholder:text-gray-600"
            />
            <button
              onClick={handleJoinBatch}
              disabled={joiningBatch}
              className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-900 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {joiningBatch ? "Joining..." : "Join Batch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
