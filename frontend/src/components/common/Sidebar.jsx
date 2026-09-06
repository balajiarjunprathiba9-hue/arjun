import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TableProperties,
  Network,
  Terminal,
  Layers,
  GraduationCap,
  Database,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Schema', path: '/schema', icon: TableProperties, badge: '2 Tables' },
  { name: 'Relationships', path: '/relationships', icon: Network, badge: '1:N' },
  { name: 'SQL Lab', path: '/sql', icon: Terminal, badge: 'Interactive' },
  { name: 'Operations', path: '/operations', icon: Layers, badge: 'CRUD' },
  { name: 'Learning', path: '/learning', icon: GraduationCap, badge: 'Theory' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-700/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-700/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
            DB Visualizer
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              EDU
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Database System Lab</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-700/80 text-blue-100'
                          : 'bg-navy-800 text-slate-400 group-hover:bg-navy-700 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Safety & Learning Banner Footer */}
      <div className="p-4 border-t border-navy-700/80 bg-navy-950/40 m-3 rounded-xl border">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Educational Guard Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Destructive SQL commands are sandboxed with live visual error translations.
        </p>
      </div>
    </aside>
  );
}
