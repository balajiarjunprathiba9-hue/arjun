import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Table, Key, Link } from 'lucide-react';

function CustomTableNode({ data, selected }) {
  const { tableName, columns = [], rowCount = 0, isHighlighted } = data;

  return (
    <div
      className={`min-w-[240px] rounded-xl bg-navy-900 border transition-all duration-200 shadow-2xl overflow-hidden ${
        selected || isHighlighted
          ? 'border-blue-500 ring-4 ring-blue-500/25 shadow-blue-500/20 scale-105'
          : 'border-navy-700 hover:border-navy-500'
      }`}
    >
      {/* Target and Source Handles for Connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="w-3 h-3 !bg-blue-500 border-2 border-navy-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 !bg-amber-500 border-2 border-navy-900"
      />

      {/* Header */}
      <div className="bg-navy-850 px-4 py-2.5 border-b border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-500/20 text-blue-400">
            <Table className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {tableName}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-950 text-slate-400 border border-navy-800">
          {rowCount} {rowCount === 1 ? 'row' : 'rows'}
        </span>
      </div>

      {/* Column Rows */}
      <div className="p-2 space-y-0.5 divide-y divide-navy-800/40">
        {columns.map((col) => (
          <div
            key={col.name}
            className="flex items-center justify-between py-1 px-2 text-xs hover:bg-navy-800/40 rounded transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {col.isPrimaryKey ? (
                <Key className="w-3 h-3 text-amber-400 shrink-0" />
              ) : col.isForeignKey ? (
                <Link className="w-3 h-3 text-blue-400 shrink-0" />
              ) : (
                <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
              )}
              <span
                className={`font-mono truncate ${
                  col.isPrimaryKey
                    ? 'text-amber-300 font-semibold'
                    : col.isForeignKey
                    ? 'text-blue-300 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                {col.name}
              </span>
            </div>

            <span className="text-[10px] font-mono text-slate-500 shrink-0 uppercase">
              {col.dataType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CustomTableNode);
