import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-lg flex items-center justify-between hover:border-navy-600 transition-all group">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-black text-white font-mono mt-1">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      <div className={`p-3.5 rounded-xl border ${colorStyles[color] || colorStyles.blue} group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
