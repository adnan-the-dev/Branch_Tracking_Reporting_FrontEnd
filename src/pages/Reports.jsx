import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileClock, Sparkles, Mail, Eye, AlertTriangle, Delete } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge.jsx';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api
      .get('/reports')
      .then(({ data }) => setReports(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/reports/generate', {});
      navigate(`/reports/${data._id}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Daily Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Track and email daily branch status reports</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          <Sparkles size={16} /> {generating ? 'Generating...' : "Generate Today's Report"}
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-400">
          <FileClock size={32} className="mx-auto mb-3" />
          No reports generated yet. Click "Generate Today's Report" to create one from your branch data.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 bg-slate-50">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Branches</th>
                <th className="py-3 px-5">Issues</th>
                <th className="py-3 px-5">Prepared By</th>
                <th className="py-3 px-5">Email Status</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                  <td className="py-3 px-5 font-medium text-ink-800">{fmtDate(r.date)}</td>
                  <td className="py-3 px-5">{r.branchCount}</td>
                  <td className="py-3 px-5">
                    {r.issueCount > 0 ? (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <AlertTriangle size={14} /> {r.issueCount}
                      </span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </td>
                  <td className="py-3 px-5">{r.preparedBy || '-'}</td>
                  <td className="py-3 px-5">
                    <StatusBadge status={r.emailStatus} />
                  </td>
                  <td className="py-3 px-5 text-right">
                    <Link
                      to={`/reports/${r.id}`}
                      className="inline-flex items-center gap-1 text-green-500 hover:text-brand-700 font-semibold"
                    >
                      <Eye size={14} /> View
                    </Link>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
