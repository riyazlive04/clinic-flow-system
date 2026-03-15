import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase ────────────────────────────────────────────────────────────────

const SUPABASE_URL = "https://lbsiyqbhjatlmqphjitf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxic2l5cWJoamF0bG1xcGhqaXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzYyMTgsImV4cCI6MjA4ODExMjIxOH0.iWUso735ZmnaqI-WxtlSvhboFFPDMRPzETlCN9wzYDI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth ────────────────────────────────────────────────────────────────────

const AUTH_KEY = "sirah_admin_auth";
const VALID_HASH =
  "c5c316e1cf572dceddc9ae3d624f7a1b2b1efd405e4a9249f4b73005033efb19";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Types ───────────────────────────────────────────────────────────────────

type AttendanceStatus = "not_attended" | "attended" | null;

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  business_type: string;
  meeting_time: string | null;
  created_at: string;
  attendance_status: AttendanceStatus;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

const WEBHOOK_ATTENDED =
  "https://n8n.srv930949.hstgr.cloud/webhook/meeting-attended";
const WEBHOOK_NOT_ATTENDED =
  "https://n8n.srv930949.hstgr.cloud/webhook/meeting-not-attended";

function fireWebhook(url: string, payload: object) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((e) => console.warn("Webhook failed:", e));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shortId(id: string) {
  return id.replace(/-/g, "").slice(0, 5);
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function formatPhone(countryCode: string, phone: string): string {
  if (!phone) return "—";
  const cc = (countryCode || "").replace(/^\+/, "");
  return `+${cc}${phone}`;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const hash = await sha256(`${username}:${password}`);
    if (hash === VALID_HASH) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Booking Admin · Sirah Digital</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <Input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, country_code, business_type, meeting_time, created_at, attendance_status"
      )
      .order("created_at", { ascending: false });

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateAttendance = async (
    lead: Lead,
    status: AttendanceStatus
  ) => {
    // Toggle: if already set to this status, clear it
    const newStatus: AttendanceStatus = lead.attendance_status === status ? null : status;

    // 1. Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, attendance_status: newStatus } : l))
    );
    setUpdating((prev) => new Set(prev).add(lead.id));

    // 2. Call edge function (bypasses RLS)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/update-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ id: lead.id, attendance_status: newStatus }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      // 3. Fire webhook only when setting (not clearing) a status
      if (newStatus === "attended") {
        fireWebhook(WEBHOOK_ATTENDED, {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          country_code: lead.country_code,
          business_type: lead.business_type,
          meeting_time: lead.meeting_time,
          attendance_status: newStatus,
        });
      } else if (newStatus === "not_attended") {
        fireWebhook(WEBHOOK_NOT_ATTENDED, {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          country_code: lead.country_code,
          business_type: lead.business_type,
          meeting_time: lead.meeting_time,
          attendance_status: newStatus,
          calendarLink: "https://clinic-flow-system.sirahagents.com/",
        });
      }

      // 4. Silent re-fetch to sync DB state
      await fetchLeads(true);
    } catch (err) {
      // Revert optimistic update on failure
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, attendance_status: lead.attendance_status } : l
        )
      );
      alert(`Update failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: "#22c55e" }}>
            Booking Admin
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLeads(false)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing || loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Total Bookings</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your strategy session requests
            </p>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center px-3 py-1 rounded-full border border-gray-300 text-sm font-medium text-gray-700 bg-white whitespace-nowrap">
            Total: {leads.length}
          </span>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 className="w-7 h-7 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          )}

          {/* Empty */}
          {!loading && leads.length === 0 && (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              No bookings yet.
            </div>
          )}

          {/* Table */}
          {!loading && leads.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["S.NO", "ID", "NAME", "EMAIL", "PHONE", "DATE TIME", "TYPE", "ACTIONS"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead, i) => {
                  const busy = updating.has(lead.id);
                  const datetime = formatDateTime(lead.meeting_time ?? lead.created_at);
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">

                      {/* S.NO */}
                      <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>

                      {/* ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {shortId(lead.id)}
                        </span>
                      </td>

                      {/* NAME */}
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                        {lead.name || "—"}
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {lead.email || "—"}
                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {lead.phone ? formatPhone(lead.country_code, lead.phone) : "—"}
                      </td>

                      {/* DATE TIME */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {datetime}
                      </td>

                      {/* TYPE */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {lead.business_type || "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Not Attended */}
                          <button
                            disabled={busy}
                            onClick={() => updateAttendance(lead, "not_attended")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                              lead.attendance_status === "not_attended"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                            }`}
                          >
                            Not Attended
                          </button>

                          {/* Attended */}
                          <button
                            disabled={busy}
                            onClick={() => updateAttendance(lead, "attended")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                              lead.attendance_status === "attended"
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-600"
                            }`}
                          >
                            Attended
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── Admin Page ───────────────────────────────────────────────────────────────

const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");

  const handleLogin = () => setAuthed(true);
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
};

export default Admin;
