import React from 'react';
import {
  Terminal,
  Database,
  Link2,
  Filter,
  Columns,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  PlusCircle,
  Edit3,
  Trash2
} from 'lucide-react';

const iconMap = {
  Terminal,
  Database,
  Link: Link2,
  Filter,
  Columns,
  CheckCircle2,
  ShieldCheck,
  Search,
  PlusCircle,
  Edit3,
  Trash2
};

export default function QueryFlow({ flowSteps = [] }) {
  if (!flowSteps || flowSteps.length === 0) {
    return (
      <div className="p-6 bg-navy-900 border border-navy-700/80 rounded-2xl text-center text-slate-500">
        Run a query to visualize its step-by-step relational execution flow.
      </div>
    );
  }

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-navy-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h4 className="text-sm font-bold text-white tracking-tight">
            Relational Query Execution Flow
          </h4>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          {flowSteps.length} Sequential Operations
        </span>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {flowSteps.map((step, idx) => {
            const Icon = iconMap[step.icon] || Database;
            const isLast = idx === flowSteps.length - 1;

            return (
              <React.Fragment key={step.step || idx}>
                {/* Flow Node Card */}
                <div className="bg-navy-950 border border-navy-700/90 rounded-xl p-3 w-56 flex flex-col justify-between hover:border-cyan-500/60 transition-all shadow-md group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-navy-800 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                        STEP 0{step.step}
                      </span>
                      <div className="p-1.5 rounded-lg bg-navy-800/80 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h5 className="font-mono text-xs font-bold text-slate-200 truncate">
                      {step.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {step.description}
                    </p>
                  </div>

                  {step.condition && (
                    <div className="mt-2.5 pt-2 border-t border-navy-850">
                      <span className="text-[10px] font-mono text-cyan-300 block truncate">
                        {step.condition}
                      </span>
                    </div>
                  )}
                </div>

                {/* Connector Arrow */}
                {!isLast && (
                  <div className="text-slate-600 flex items-center px-0.5">
                    <ArrowRight className="w-4 h-4 text-cyan-500/60 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
