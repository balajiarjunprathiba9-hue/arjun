import React from 'react';
import { Table, Key, Link, Hash, RefreshCw, AlertCircle } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export default function DatabaseTable({ tableName, columns = [], rows = [], highlightedRowId = null, title = null }) {
  const { fetchTableRecords } = useDatabase();

  const handleRefreshTable = () => {
    if (tableName) {
      fetchTableRecords(tableName);
    }
  };

  const pkCol = columns.find(c => c.isPrimaryKey)?.name || (tableName === 'students' ? 'student_id' : 'course_id');

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Table Header Controls */}
      <div className="p-3.5 bg-navy-850/80 border-b border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {title || tableName}
            </h4>
            <span className="text-[11px] text-slate-400">
              {rows.length} {rows.length === 1 ? 'record' : 'records'} in database
            </span>
          </div>
        </div>

        <button
          onClick={handleRefreshTable}
          title="Reload table records"
          className="p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white hover:bg-navy-700 border border-navy-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-950/80 border-b border-navy-800 text-slate-400 font-mono">
            <tr>
              {columns.map((col) => (
                <th key={col.name} className="px-4 py-2.5 font-semibold tracking-wider">
                  <div className="flex items-center gap-1.5">
                    {col.isPrimaryKey && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                    {col.isForeignKey && <Link className="w-3 h-3 text-blue-400 shrink-0" />}
                    <span className={col.isPrimaryKey ? 'text-amber-300' : col.isForeignKey ? 'text-blue-300' : 'text-slate-300'}>
                      {col.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">
                      ({col.dataType || 'val'})
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 font-mono">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length || 4} className="px-4 py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <span>No records currently present in {tableName}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const rowKeyVal = row[pkCol] !== undefined ? row[pkCol] : idx;
                const isHighlighted = highlightedRowId !== null && (rowKeyVal === highlightedRowId || row.student_id === highlightedRowId);

                return (
                  <tr
                    key={rowKeyVal}
                    className={`transition-colors ${
                      isHighlighted
                        ? 'bg-blue-500/20 border-l-4 border-l-blue-400'
                        : idx % 2 === 0
                        ? 'bg-navy-900/40 hover:bg-navy-800/40'
                        : 'bg-navy-950/30 hover:bg-navy-800/40'
                    }`}
                  >
                    {columns.map((col) => {
                      const val = row[col.name];
                      const isPk = col.isPrimaryKey;
                      const isFk = col.isForeignKey;

                      return (
                        <td key={col.name} className="px-4 py-2.5">
                          <span
                            className={
                              isPk
                                ? 'text-amber-400 font-semibold'
                                : isFk
                                ? 'text-blue-400 font-medium'
                                : 'text-slate-200'
                            }
                          >
                            {val !== null && val !== undefined ? String(val) : <span className="text-slate-600 italic">NULL</span>}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
