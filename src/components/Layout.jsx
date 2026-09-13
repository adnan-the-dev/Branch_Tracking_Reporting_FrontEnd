import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  FileClock,
  Settings as SettingsIcon,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/branches', label: 'Branches', icon: Store },
  { to: '/reports', label: 'Daily Reports', icon: FileClock },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 bg-ink-900 text-white flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <UtensilsCrossed size={18} />
          </div>
          <div>
            <p className="font-bold leading-tight">Branch IT Tracker</p>
            <p className="text-xs text-white/50 leading-tight">Multi-Branch Systems</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
