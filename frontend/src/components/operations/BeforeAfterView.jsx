import React from 'react';
import { ArrowRight, CheckCircle2, Database, Sparkles, Terminal } from 'lucide-react';

export default function BeforeAfterView({ operationData }) {
  if (!operationData) return null;

  const {
    operation,
    sql,
    before = [],
    after = [],
    insertedRow,
    diff,
    deletedRow
  } = operationData;

  const targetId = insertedRow?.student_id || diff?.student_id || deletedRow?.student_id;

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Title & Generated SQL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Database State Transition (Before → Operation → After)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {operation}
          </span>
        </div>

        {/* Generated SQL Banner */}
        <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 font-mono text-xs text-cyan-300 flex items-center gap-2 overflow-x-auto">
          <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-slate-400 font-semibold shrink-0">Generated SQL:</span>
          <code className="text-emerald-300">{sql}</code>
        </div>
      </div>

      {/* Side-by-Side Before vs After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
        {/* BEFORE PANEL */}
        <div className="bg-navy-950/80 rounded-xl border border-navy-800 overflow-hidden">
          <div className="p-2.5 bg-navy-850/80 border-b border-navy-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
              Database State: BEFORE
            </span>
            <span className="text-slate-400 text-[11px] font-mono">{before.length} rows</span>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-slate-400 uppercase border-b border-navy-850">
                <tr>
                  <th className="py-1 px-2">ID</th>
                  <th className="py-1 px-2">Name</th>
                  <th className="py-1 px-2">Course</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900">
                {before.map((row) => {
                  const isTarget = row.student_id === targetId;
                  const isDeletedTarget = operation === 'DELETE' && isTarget;

                  return (
                    <tr
                      key={row.student_id}
                      className={`transition-colors ${
                        isDeletedTarget
                          ? 'bg-rose-500/20 text-rose-300 line-through font-semibold'
                          : isTarget && operation === 'UPDATE'
                          ? 'bg-amber-500/15 text-amber-200'
                          : 'text-slate-300'
                      }`}
                    >
                      <td className="py-1.5 px-2">{row.student_id}</td>
                      <td className="py-1.5 px-2">{row.name}</td>
                      <td className="py-1.5 px-2">Course #{row.course_id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AFTER PANEL */}
        <div className="bg-navy-950/80 rounded-xl border border-navy-800 overflow-hidden">
          <div className="p-2.5 bg-navy-850/80 border-b border-navy-800 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-300 uppercase tracking-wider font-mono">
              Database State: AFTER
            </span>
            <span className="text-slate-400 text-[11px] font-mono">{after.length} rows</span>
          </div>

          <div className="p-2 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-slate-400 uppercase border-b border-navy-850">
                <tr>
                  <th className="py-1 px-2">ID</th>
                  <th className="py-1 px-2">Name</th>
                  <th className="py-1 px-2">Course</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900">
                {after.map((row) => {
                  const isTarget = row.student_id === targetId;
                  const isNew = operation === 'INSERT' && isTarget;
                  const isUpdated = operation === 'UPDATE' && isTarget;

                  return (
                    <tr
                      key={row.student_id}
                      className={`transition-colors ${
                        isNew
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-4 border-l-emerald-400'
                          : isUpdated
                          ? 'bg-blue-500/20 text-blue-300 font-bold border-l-4 border-l-blue-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <td className="py-1.5 px-2">
                        {row.student_id}
                        {isNew && <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200">NEW</span>}
                        {isUpdated && <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-blue-500/30 text-blue-200">EDIT</span>}
                      </td>
                      <td className="py-1.5 px-2">{row.name}</td>
                      <td className="py-1.5 px-2">Course #{row.course_id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
