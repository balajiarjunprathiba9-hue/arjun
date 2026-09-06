import React from 'react';
import { HelpCircle, Check, Database, Network, ListOrdered } from 'lucide-react';

export default function QueryExplanation({ explanation }) {
  if (!explanation) return null;

  const {
    title = 'Query Explanation: What Happened?',
    points = [],
    tablesUsed = [],
    operation = 'SELECT',
    relationshipUsed = null,
    rowsReturned,
    rowsAffected
  } = explanation;

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-navy-800 pb-3">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
          <span className="text-[11px] text-slate-400">Beginner-friendly relational breakdown</span>
        </div>
      </div>

      {/* Numbered Explanation Points */}
      <div className="space-y-2 text-xs">
        <span className="font-semibold text-slate-300 uppercase text-[10px] tracking-wider block">
          Step-by-Step Breakdown:
        </span>
        <ol className="space-y-2 pl-1">
          {points.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-slate-300">
              <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-navy-800 text-xs font-mono">
        <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
          <span className="text-[10px] uppercase text-slate-500 block font-sans">Tables Used</span>
          <span className="text-slate-200 font-semibold truncate block mt-0.5">
            {tablesUsed.join(', ') || 'N/A'}
          </span>
        </div>

        <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
          <span className="text-[10px] uppercase text-slate-500 block font-sans">Operation</span>
          <span className="text-blue-300 font-semibold truncate block mt-0.5">
            {operation}
          </span>
        </div>

        <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
          <span className="text-[10px] uppercase text-slate-500 block font-sans">Relationship</span>
          <span className="text-amber-300 font-semibold truncate block mt-0.5" title={relationshipUsed || 'Direct query'}>
            {relationshipUsed ? '1:N FK Match' : 'None'}
          </span>
        </div>

        <div className="bg-navy-950 p-2.5 rounded-xl border border-navy-800">
          <span className="text-[10px] uppercase text-slate-500 block font-sans">
            {rowsReturned !== undefined ? 'Rows Returned' : 'Rows Affected'}
          </span>
          <span className="text-emerald-400 font-bold block mt-0.5 text-sm">
            {rowsReturned !== undefined ? rowsReturned : rowsAffected || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
