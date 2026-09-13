import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Store, MonitorSmartphone, Printer, Wifi, Search } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/branches')
      .then(({ data }) => setBranches(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = branches.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Branches</h1>
          <p className="text-slate-500 text-sm mt-1">Manage systems for every branch</p>
        </div>
        <Link
          to="/branches/new"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Add Branch
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search branches..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading branches...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center text-slate-400">
          <Store size={32} className="mx-auto mb-3" />
          No branches found. Click "Add Branch" to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <Link
              key={b._id}
              to={`/branches/${b._id}`}
              className="bg-white rounded-2xl shadow-card p-5 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-ink-900">{b.name}</h3>
                  {b.address && <p className="text-xs text-slate-400 mt-0.5">{b.address}</p>}
                </div>
                <StatusBadge status={b.camera?.recordingStatus || 'Ok'} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl py-2">
                  <MonitorSmartphone size={16} className="mx-auto mb-1 text-blue-500" />
                  <p className="text-sm font-bold">{b.stations?.length || 0}</p>
                  <p className="text-[10px] text-slate-400">Stations</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                  <Printer size={16} className="mx-auto mb-1 text-purple-500" />
                  <p className="text-sm font-bold">{b.printers?.length || 0}</p>
                  <p className="text-[10px] text-slate-400">Printers</p>
                </div>
                <div className="bg-slate-50 rounded-xl py-2">
                  <Wifi size={16} className="mx-auto mb-1 text-teal-500" />
                  <p className="text-sm font-bold">{b.internetConnections?.length || 0}</p>
                  <p className="text-[10px] text-slate-400">Internet</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
