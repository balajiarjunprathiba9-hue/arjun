import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Lightbulb,
  Terminal,
  BookOpen,
  ArrowUp,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function LearningFeedback({ feedback, onClear }) {
  if (!feedback) return null;

  const isSuccess = feedback.success !== false && !feedback.error;
  const errorObj = feedback.error || {};

  const title = feedback.title || errorObj.title || (isSuccess ? 'Operation Completed' : 'Database Constraint Error');
  const whatHappened = feedback.whatHappened || errorObj.whatHappened || feedback.message || errorObj.message;
  const why = feedback.why || errorObj.why || '';
  const databaseConcept = feedback.databaseConcept || errorObj.databaseConcept || '';
  const suggestion = feedback.suggestion || errorObj.suggestion || '';
  const visualExplanation = feedback.visualExplanation || errorObj.visualExplanation || null;
  const sql = feedback.sql || errorObj.sql || null;
  const errorCode = feedback.code || errorObj.code || null;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-2xl space-y-4 animate-in fade-in transition-all ${
        isSuccess
          ? 'bg-emerald-950/20 border-emerald-500/40'
          : 'bg-rose-950/20 border-rose-500/40'
      }`}
    >
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-3 border-b border-navy-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
              {errorCode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-950 text-slate-400 border border-navy-800">
                  {errorCode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSuccess ? 'Educational verification successful' : 'Visual relational error translation'}
            </p>
          </div>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-navy-800"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* SQL Snippet if provided */}
      {sql && (
        <div className="bg-navy-950 p-2.5 rounded-lg border border-navy-850 text-xs font-mono text-cyan-300 flex items-center gap-2 overflow-x-auto">
          <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <code className="truncate">{sql}</code>
        </div>
      )}

      {/* Section 1: What happened? */}
      <div className="space-y-1">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          <span>What happened?</span>
        </h5>
        <p className="text-xs text-slate-200 leading-relaxed pl-5">
          {whatHappened}
        </p>
      </div>

      {/* Section 2: Why? */}
      {why && (
        <div className="space-y-1">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why did this occur?</span>
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed pl-5">
            {why}
          </p>
        </div>
      )}

      {/* Section 3: Database Concept */}
      {databaseConcept && (
        <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Database Engineering Concept</span>
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {databaseConcept}
          </p>
        </div>
      )}

      {/* Section 4: Visual Explanation / Diagram */}
      {visualExplanation && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Visual Explanation</span>
          </span>

          {visualExplanation.type === 'fk_violation' ? (
            <div className="bg-navy-950 p-4 rounded-xl border border-rose-500/30 font-mono text-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                {/* Courses Box */}
                <div className="p-3 bg-navy-900 rounded-lg border border-navy-700 w-full sm:w-48 text-center shadow-lg">
                  <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">
                    [ COURSES ] (Parent Table)
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="py-0.5 px-2 bg-navy-950 rounded">ID 1: CS101 ✓</div>
                    <div className="py-0.5 px-2 bg-navy-950 rounded">ID 2: CS102 ✓</div>
                    <div className="py-0.5 px-2 bg-navy-950 rounded">ID 3: CS103 ✓</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center text-rose-400">
                  <span className="text-[10px] font-bold uppercase mb-1">Required Parent</span>
                  <div className="h-8 w-0.5 bg-rose-500/50" />
                  <ArrowUp className="w-4 h-4" />
                </div>

                {/* Attempted Student Record */}
                <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-500/50 w-full sm:w-48 text-center shadow-lg">
                  <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">
                    [ STUDENTS ] (Child Table)
                  </div>
                  <div className="p-2 bg-rose-900/30 rounded text-rose-300 font-bold text-[11px]">
                    course_id = {visualExplanation.attemptedValue} ❌
                  </div>
                  <span className="text-[10px] text-rose-400 mt-1 block">
                    Parent record not found in courses!
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-navy-950 p-3 rounded-xl border border-navy-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {visualExplanation.diagram}
            </div>
          )}
        </div>
      )}

      {/* Section 5: How to fix it */}
      {suggestion && (
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">How to resolve: </span>
            <span>{suggestion}</span>
          </div>
        </div>
      )}
    </div>
  );
}
