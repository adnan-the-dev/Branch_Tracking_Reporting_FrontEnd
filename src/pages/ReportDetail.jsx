import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Save,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge.jsx";

// Fetches the preview HTML through axios (so the auth token is attached) and opens it
// in a new tab as a blob URL - a plain <a href> would bypass the token and get a 401.
async function openEmailPreview(id, setMessage) {
  try {
    const { data } = await api.get(`/reports/${id}/preview`, {
      responseType: "text",
    });
    const blob = new Blob([data], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    setMessage({ type: "error", text: "Could not load email preview." });
  }
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState(null);

  console.log(report, "reports");

  const load = () => {
    api.get(`/reports/${id}`).then(({ data }) => {
      setReport(data);
      setLoading(false);
    });
  };

  useEffect(load, [id]);

  const updateEntry = (idx, section, key, value) => {
    setReport((r) => {
      const entries = [...r.entries];
      entries[idx] = {
        ...entries[idx],
        [section]: { ...entries[idx][section], [key]: value },
      };
      return { ...r, entries };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/reports/${id}`, {
        entries: report.entries,
        preparedBy: report.preparedBy,
      });
      setMessage({ type: "success", text: "Report saved." });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setMessage(null);
    try {
      const recipientList = recipients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { data } = await api.post(`/reports/${id}/send`, {
        recipients: recipientList.length ? recipientList : undefined,
      });
      setReport(data.report);
      setMessage({ type: "success", text: "Report emailed successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send email.",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-slate-400">Loading report...</p>;
  if (!report) return <p className="text-slate-400">Report not found.</p>;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="p-2 rounded-lg hover:bg-slate-200/60">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              Report - {fmtDate(report.date)}
            </h1>
            <p className="text-slate-500 text-sm">
              {report.entries.length} branches included
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={report.emailStatus} />
          <button
            type="button"
            onClick={() => openEmailPreview(id, setMessage)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-ink-700 text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            <Eye size={15} /> Preview Email
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 font-semibold text-sm text-ink-800">
          1. Camera &amp; Recording Status
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 px-5">Branch</th>
              <th className="py-2 px-5">Recording Status</th>
              <th className="py-2 px-5">Recording Period</th>
              <th className="py-2 px-5">Remarks / Issue</th>
            </tr>
          </thead>
          <tbody>
            {report.entries.map((e, idx) => (
              <tr key={e.branch} className="border-b border-slate-50">
                <td className="py-2 px-5 font-medium text-ink-800">
                  {e.branchName}
                </td>
                <td className="py-2 px-5">
                  <select
                    value={e.camera.recordingStatus}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "camera",
                        "recordingStatus",
                        ev.target.value,
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option>Ok</option>
                    <option>Issue</option>
                    <option>Off</option>
                  </select>
                </td>

                {/* <td className="py-2 px-5">
                  <select
                    value={e.camera.recordingPeriod}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "camera",
                        "recordingPeriod",
                        ev.target.value,
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option>Ok</option>
                    <option>Issue</option>
                    <option>Off</option>
                  </select>
                </td> */}

                <td className="py-2 px-5">
                  <input
                    value={e.camera.recordingPeriod}
                    onChange={(ev) =>
                      updateEntry(idx, "camera", "recordingPeriod", ev.target.value)
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="Date range or duration"
                  />
                </td>
                <td className="py-2 px-5">
                  <input
                    value={e.camera.remarks}
                    onChange={(ev) =>
                      updateEntry(idx, "camera", "remarks", ev.target.value)
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="Remarks / Issue"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 font-semibold text-sm text-ink-800">
          2. Network / Fiber Connection &amp; Other Systems
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 px-5">Branch</th>
              <th className="py-2 px-5">Status</th>
              <th className="py-2 px-5">Pending Dues</th>
              <th className="py-2 px-5">Remarks / Issue</th>
            </tr>
          </thead>
          <tbody>
            {report.entries.map((e, idx) => (
              <tr key={e.branch} className="border-b border-slate-50">
                <td className="py-2 px-5 font-medium text-ink-800">
                  {e.branchName}
                </td>
                <td className="py-2 px-5">
                  <select
                    value={e.network.status}
                    onChange={(ev) =>
                      updateEntry(idx, "network", "status", ev.target.value)
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option>Ok</option>
                    <option>Issue</option>
                    <option>Down</option>
                  </select>
                </td>
                <td className="py-2 px-5">
                  <select
                    value={e.network.pendingDues ? "yes" : "no"}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "network",
                        "pendingDues",
                        ev.target.value === "yes",
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </td>
                <td className="py-2 px-5">
                  <input
                    value={e.network.remarks}
                    onChange={(ev) =>
                      updateEntry(idx, "network", "remarks", ev.target.value)
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="Remarks / Issue"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 font-semibold text-sm text-ink-800">
          3. Google Business
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 px-5">Branch</th>
              <th className="py-2 px-5">Phone Number</th>
              <th className="py-2 px-5">Location Verified</th>
              <th className="py-2 px-5">Business Hours</th>
            </tr>
          </thead>
          <tbody>
            {report.entries.map((e, idx) => (
              <tr key={e.branch} className="border-b border-slate-50">
                <td className="py-2 px-5 font-medium text-ink-800">
                  {e.branchName}
                </td>
                <td className="py-2 px-5">
                  <select
                    value={e.googleBusiness.phoneNumberStatus}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "googleBusiness",
                        "phoneNumberStatus",
                        ev.target.value,
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option>Ok</option>
                    <option>Duplicate</option>
                    <option>Missing</option>
                  </select>
                </td>
                <td className="py-2 px-5">
                  <select
                    value={e.googleBusiness.locationVerified ? "yes" : "no"}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "googleBusiness",
                        "locationVerified",
                        ev.target.value === "yes",
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td className="py-2 px-5">
                  <input
                    value={e.googleBusiness.businessHours}
                    onChange={(ev) =>
                      updateEntry(
                        idx,
                        "googleBusiness",
                        "businessHours",
                        ev.target.value,
                      )
                    }
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="11Am-3Am"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-ink-900">
          Send by Email (Outlook / Office365)
        </h2>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Recipients (comma separated - leave blank to use default recipients
            from .env)
          </label>
          <input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
            placeholder="manager@yourcompany.com, owner@yourcompany.com"
          />
        </div>
        {report.emailSentAt && (
          <p className="text-xs text-slate-400">
            Last sent: {new Date(report.emailSentAt).toLocaleString()} to{" "}
            {report.emailRecipients?.join(", ")}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-ink-700 text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60"
          >
            <Mail size={16} /> {sending ? "Sending..." : "Send Report Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
