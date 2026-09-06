import React from 'react';
import { Key, Link, ShieldCheck, Hash, Sparkles } from 'lucide-react';

export default function ColumnRow({ column }) {
  const {
    name,
    type,
    isPrimaryKey,
    isForeignKey,
    isNullable,
    isUnique,
    isAutoIncrement,
    foreignKey
  } = column;

  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-navy-800/60 rounded-lg transition-colors group border border-transparent hover:border-navy-700/60">
      {/* Column Name and Key Badges */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {isPrimaryKey ? (
            <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40" title="Primary Key">
              <Key className="w-3 h-3" />
            </div>
          ) : isForeignKey ? (
            <div className="p-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40" title={`Foreign Key referencing ${foreignKey?.referencedTable}.${foreignKey?.referencedColumn}`}>
              <Link className="w-3 h-3" />
            </div>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-slate-400" />
          )}
        </div>

        <span className={`font-mono text-xs font-medium truncate ${
          isPrimaryKey ? 'text-amber-300 font-semibold' : isForeignKey ? 'text-blue-300 font-semibold' : 'text-slate-200'
        }`}>
          {name}
        </span>

        {/* Constraint Pills */}
        <div className="flex items-center gap-1 shrink-0">
          {isPrimaryKey && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PK
            </span>
          )}
          {isForeignKey && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              FK
            </span>
          )}
          {isUnique && !isPrimaryKey && (
            <span className="text-[9px] uppercase font-medium px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              UNI
            </span>
          )}
          {isAutoIncrement && (
            <span className="text-[9px] uppercase font-medium px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              A_I
            </span>
          )}
        </div>
      </div>

      {/* Data Type and Nullability */}
      <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono">
        <span className="text-slate-400 bg-navy-950/60 px-2 py-0.5 rounded border border-navy-800">
          {type.toUpperCase()}
        </span>
        <span className={`text-[10px] font-sans ${isNullable ? 'text-slate-500' : 'text-rose-400/80 font-medium'}`} title={isNullable ? 'Nullable' : 'NOT NULL required'}>
          {isNullable ? 'NULL' : 'NOT NULL'}
        </span>
      </div>
    </div>
  );
}
