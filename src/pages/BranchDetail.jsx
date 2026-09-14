import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MonitorSmartphone,
  Printer,
  Wifi,
  Camera,
  Zap,
  Star,
  Copy,
} from "lucide-react";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge.jsx";

function Card({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-brand-500" />
        <h2 className="font-semibold text-ink-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/branches/${id}`)
      .then(({ data }) => setBranch(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(`Delete branch "${branch.name}"? This cannot be undone.`)
    )
      return;
    await api.delete(`/branches/${id}`);
    navigate("/branches");
  };

  if (loading) return <p className="text-slate-400">Loading...</p>;
  if (!branch) return <p className="text-slate-400">Branch not found.</p>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/branches" className="p-2 rounded-lg hover:bg-slate-200/60">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">{branch.name}</h1>
            {branch.address && (
              <p className="text-slate-500 text-sm">{branch.address}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
         
          <Link
            to={`/branches/${id}/edit`}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-ink-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Pencil size={15} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {(branch.contactPerson || branch.contactPhone) && (
        <div className="bg-white rounded-2xl shadow-card p-4 flex gap-8 text-sm">
          {branch.contactPerson && (
            <p>
              <span className="text-slate-400">Contact: </span>
              <span className="font-medium">{branch.contactPerson}</span>
            </p>
          )}
          {branch.contactPhone && (
            <p>
              <span className="text-slate-400">Phone: </span>
              <span className="font-medium">{branch.contactPhone}</span>
            </p>
          )}
        </div>
      )}

      <Card
        icon={MonitorSmartphone}
        title={`POS / Kitchen Stations (${branch.stations.length})`}
      >
        {branch.stations.length === 0 ? (
          <p className="text-sm text-slate-400">No stations recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Brand</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4">Generation</th>
                  <th className="py-2 pr-4">RAM</th>
                  <th className="py-2 pr-4">STORAGE</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {branch.stations.map((s) => (
                  <tr key={s._id} className="border-b border-slate-50">
                    <td className="py-2 pr-4 font-medium text-ink-800">
                      {s.stationType}
                    </td>
                    <td className="py-2 pr-4">{s.brand || "-"}</td>
                    <td className="py-2 pr-4">{s.model || "-"}</td>
                    <td className="py-2 pr-4">{s.generation || "-"}</td>
                    <td className="py-2 pr-4">
                      {s.ramGb ? `${s.ramGb} GB` : "-"}
                    </td>
                    <td className="py-2 pr-4">
                      {s.storage ? `${s.storage} GB` : "-"}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-2 text-slate-500">{s.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card icon={Printer} title={`Printers (${branch.printers.length})`}>
        {branch.printers.length === 0 ? (
          <p className="text-sm text-slate-400">No printers recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4">Label</th>
                  <th className="py-2 pr-4">Brand</th>
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {branch.printers.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50">
                    <td className="py-2 pr-4 font-medium text-ink-800">
                      {p.label}
                    </td>
                    <td className="py-2 pr-4">{p.brand || "-"}</td>
                    <td className="py-2 pr-4">{p.model || "-"}</td>
                    <td className="py-2">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card
        icon={Wifi}
        title={`Internet Connections (${branch.internetConnections.length})`}
      >
        {branch.internetConnections.length === 0 ? (
          <p className="text-sm text-slate-400">
            No internet connections recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2 pr-4">Connection ID</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Pending Dues</th>
                </tr>
              </thead>
              <tbody>
                {branch.internetConnections.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50">
                    <td className="py-2 pr-4 font-medium text-ink-800">
                      {c.provider}
                    </td>
                    <td className="py-2 pr-4">{c.connectionId || "-"}</td>
                    <td className="py-2 pr-4">{c.purpose || "-"}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2">{c.pendingDues ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card icon={Camera} title="Camera / DVR">
          <p className="text-sm mb-2">
            Status:{" "}
            <StatusBadge status={branch.camera?.recordingStatus || "Ok"} />
          </p>
          {branch.camera?.dvrBrand && (
            <p className="text-sm text-slate-500">
              DVR: {branch.camera.dvrBrand}
            </p>
          )}
          {branch.camera?.remarks && (
            <p className="text-sm text-slate-500 mt-1">
              {branch.camera.remarks}
            </p>
          )}
        </Card>
        <Card icon={Star} title="Google Business">
          <p className="text-sm mb-2">
            Phone:{" "}
            <StatusBadge
              status={branch.googleBusiness?.phoneNumberStatus || "Ok"}
            />
          </p>
          <p className="text-sm mb-2">
            Location Verified:{" "}
            {branch.googleBusiness?.locationVerified ? "Yes" : "No"}
          </p>
          {branch.googleBusiness?.businessHours && (
            <p className="text-sm text-slate-500">
              Hours: {branch.googleBusiness.businessHours}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
