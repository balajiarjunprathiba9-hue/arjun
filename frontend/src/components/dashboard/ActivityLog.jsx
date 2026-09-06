import React from 'react';
import { Activity, CheckCircle2, AlertCircle, Info, Clock, RotateCcw } from 'lucide-react';

export default function ActivityLog({ logs = [] }) {
  const getIcon = (status, type) => {
    if (type === 'RESET') return <RotateCcw className="w-3.5 h-3.5 text-amber-400" />;
    if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (status === 'error') return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
    return <Info className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-navy-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-bold text-white tracking-tight">Recent Activity Log</h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Live Audit Trail</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No recent activity recorded.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-navy-950/70 rounded-xl border border-navy-800/80 flex items-start gap-3 hover:border-navy-700 transition-colors"
            >
              <div className="mt-0.5 shrink-0">{getIcon(log.status, log.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate">{log.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{log.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed truncate">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
