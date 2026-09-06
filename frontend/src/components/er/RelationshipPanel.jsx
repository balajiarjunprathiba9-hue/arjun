import React from 'react';
import { Network, ArrowRight, ShieldCheck, Info, Link2, GitFork } from 'lucide-react';

export default function RelationshipPanel({ relationship, selectedNode, onClose }) {
  if (!relationship) {
    return (
      <div className="bg-navy-900 border border-navy-700/80 rounded-xl p-5 text-center text-slate-400">
        <Network className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
        <p className="text-sm font-medium text-slate-300">Click a table or relationship</p>
        <p className="text-xs text-slate-500 mt-1">
          Inspect foreign keys, cardinality (1:N), and referential integrity constraints.
        </p>
      </div>
    );
  }

  const {
    constraintName,
    parentTable,
    parentColumn,
    childTable,
    childColumn,
    cardinality,
    type,
    direction,
    explanation,
    onDelete,
    onUpdate
  } = relationship;

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 bg-navy-850/90 border-b border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Network className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm text-white">Relationship Details</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {cardinality} ({type})
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Visual Map */}
        <div className="bg-navy-950/80 p-3 rounded-lg border border-navy-800 flex items-center justify-between font-mono">
          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Parent (1)</span>
            <span className="text-amber-300 font-bold text-sm">{parentTable}</span>
            <span className="text-slate-400 text-[10px] block font-mono">.{parentColumn} (PK)</span>
          </div>

          <div className="flex flex-col items-center px-3">
            <span className="text-[10px] text-blue-400 font-semibold mb-0.5">1 : N</span>
            <div className="flex items-center text-blue-400">
              <div className="w-8 h-[2px] bg-blue-500/60" />
              <ArrowRight className="w-3.5 h-3.5 -ml-1 text-blue-400" />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5">has many</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Child (N)</span>
            <span className="text-cyan-300 font-bold text-sm">{childTable}</span>
            <span className="text-slate-400 text-[10px] block font-mono">.{childColumn} (FK)</span>
          </div>
        </div>

        {/* Plain-English Meaning */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-slate-300 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Pedagogical Meaning</span>
          </div>
          <p className="text-[11px]">
            {explanation || 'One course can have multiple students enrolled. Each student references an existing course ID.'}
          </p>
        </div>

        {/* Constraint Specification Table */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-slate-400">Constraint:</span>
            <span className="text-slate-200">{constraintName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-slate-400">Foreign Key:</span>
            <span className="text-blue-300">{childTable}.{childColumn}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-slate-400">References:</span>
            <span className="text-amber-300">{parentTable}.{parentColumn}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-navy-800">
            <span className="text-slate-400">ON DELETE:</span>
            <span className="text-emerald-400 font-semibold">{onDelete || 'CASCADE'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">ON UPDATE:</span>
            <span className="text-emerald-400 font-semibold">{onUpdate || 'CASCADE'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
