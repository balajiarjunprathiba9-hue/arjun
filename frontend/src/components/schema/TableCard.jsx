import React from 'react';
import { Table, Eye, Layers, ArrowRight } from 'lucide-react';
import ColumnRow from './ColumnRow';

export default function TableCard({ table, onSelect, isSelected }) {
  const { tableName, rowCount, columns, description } = table;

  return (
    <div
      onClick={onSelect}
      className={`bg-navy-900/90 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden shadow-lg flex flex-col ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10'
          : 'border-navy-700/80 hover:border-navy-600 hover:shadow-xl'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-navy-700/80 bg-navy-850/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
              {tableName}
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {description || `${columns.length} columns defined`}
            </p>
          </div>
        </div>

        {/* Row Count Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-navy-800 text-slate-300 border border-navy-700 font-medium">
            {rowCount} {rowCount === 1 ? 'row' : 'rows'}
          </span>
        </div>
      </div>

      {/* Columns Listing */}
      <div className="p-3 space-y-1 flex-1">
        <div className="flex items-center justify-between px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Attribute</span>
          <span>Type / Nullable</span>
        </div>
        <div className="divide-y divide-navy-800/40">
          {columns.map((col) => (
            <ColumnRow key={col.name} column={col} />
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-2.5 bg-navy-950/40 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Click to inspect table records</span>
        <div className="flex items-center gap-1 text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
