import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, MonitorSmartphone, Printer, Wifi, AlertTriangle, Mail, ArrowRight } from 'lucide-react';
import api from '../api/client';

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tint}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400">Loading dashboard...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of all branch systems</p>
        </div>
        <Link
          to="/reports"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Mail size={16} /> Generate Today's Report
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Store} label="Branches" value={stats.totalBranches} tint="bg-brand-50 text-brand-600" />
        <StatCard
          icon={MonitorSmartphone}
          label="POS / Screens"
          value={stats.totalStations}
          tint="bg-blue-50 text-blue-600"
        />
        <StatCard icon={Printer} label="Printers" value={stats.totalPrinters} tint="bg-purple-50 text-purple-600" />
        <StatCard
          icon={Wifi}
          label="Internet Connections"
          value={stats.totalInternetConnections}
          tint="bg-teal-50 text-teal-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Open Issues"
          value={stats.openIssues}
          tint={stats.openIssues > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Systems by Station Type</h2>
          <div className="space-y-3">
            {Object.entries(stats.stationTypeCounts).length === 0 && (
              <p className="text-sm text-slate-400">No stations added yet.</p>
            )}
            {Object.entries(stats.stationTypeCounts).map(([type, count]) => {
              const pct = Math.round((count / stats.totalStations) * 100) || 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-700">{type}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Systems by Generation</h2>
          <div className="space-y-3">
            {Object.entries(stats.generationCounts).length === 0 && (
              <p className="text-sm text-slate-400">No generation info recorded yet.</p>
            )}
            {Object.entries(stats.generationCounts).map(([gen, count]) => {
              const pct = Math.round((count / stats.totalStations) * 100) || 0;
              return (
                <div key={gen}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-700">{gen}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-semibold text-ink-900 mb-4">Branches Needing Attention</h2>
        {stats.branchesWithIssues.length === 0 ? (
          <p className="text-sm text-green-600">All branches reporting healthy systems 🎉</p>
        ) : (
          <div className="space-y-2">
            {stats.branchesWithIssues.map((b) => (
              <Link
                key={b.id}
                to={`/branches/${b.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                <span className="font-medium text-ink-800">{b.name}</span>
                <span className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                  {b.issues} issue{b.issues > 1 ? 's' : ''} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
