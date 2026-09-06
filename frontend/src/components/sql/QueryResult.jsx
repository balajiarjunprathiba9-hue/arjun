import React from 'react';
import { Table, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QueryResult({ result }) {
  if (!result) return null;

  const {
    rows = [],
    columns = [],
    rowCount = 0,
    executionTimeMs = 0,
    affectedRows = 0,
    classification
  } = result;

  const isMutation = classification && classification.startsWith('MUTATION');

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Header bar */}
      <div className="p-3.5 bg-navy-850/90 border-b border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Query Result
            </h4>
            <span className="text-[11px] text-slate-400">
              {isMutation ? `${affectedRows} rows affected` : `${rowCount} rows returned`}
            </span>
          </div>
        </div>

        {/* Execution Time badge */}
        <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-navy-950 text-slate-300 border border-navy-800">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{executionTimeMs} ms</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto max-h-72">
        {isMutation ? (
          <div className="p-6 text-center text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-400">Operation Executed Successfully</p>
            <p className="text-slate-400">Affected {affectedRows} row(s) in the database.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-1">
            <AlertCircle className="w-5 h-5 mx-auto text-slate-600 mb-1" />
            <p>Query returned 0 rows matching criteria.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-950/80 border-b border-navy-800 text-slate-400">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2.5 font-semibold text-slate-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {rows.map((row, idx) => {
                // Highlight CS101 matching rows
                const isCs101Match = row.course_code === 'CS101' || (row.name && ['Ananya', 'Kavin'].includes(row.name));

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCs101Match
                        ? 'bg-blue-500/15 hover:bg-blue-500/25 border-l-4 border-l-blue-400'
                        : idx % 2 === 0
                        ? 'bg-navy-900/40 hover:bg-navy-800/40'
                        : 'bg-navy-950/40 hover:bg-navy-800/40'
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-2 text-slate-200">
                        {row[col] !== null && row[col] !== undefined ? (
                          String(row[col])
                        ) : (
                          <span className="text-slate-600 italic">NULL</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
