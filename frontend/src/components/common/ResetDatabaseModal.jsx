import React from 'react';
import { RotateCcw, AlertTriangle, Check, X } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export default function ResetDatabaseModal({ isOpen, onClose }) {
  const { resetDemoDatabase, isResetting } = useDatabase();

  if (!isOpen) return null;

  const handleConfirmReset = async () => {
    await resetDemoDatabase();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <RotateCcw className="w-6 h-6 text-amber-400 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Reset Demo Database?</h3>
            <p className="text-sm text-slate-300 mt-1">
              This will restore <code className="text-blue-400 font-mono bg-navy-800 px-1 py-0.5 rounded">capstone_db</code> to its baseline seed state.
            </p>
          </div>
        </div>

        <div className="bg-navy-950/80 rounded-xl p-3.5 border border-navy-800 text-xs space-y-2 text-slate-300">
          <p className="font-semibold text-slate-200">The following records will be restored:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 font-mono">
            <li><span className="text-blue-300">courses:</span> CS101, CS102, CS103</li>
            <li><span className="text-cyan-300">students:</span> Ananya (CS101), Kavin (CS101), Arun (CS102)</li>
          </ul>
          <p className="text-[11px] text-amber-400/90 pt-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Any manually inserted, updated, or deleted rows will be cleared.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmReset}
            disabled={isResetting}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isResetting ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Restoring...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Confirm Reset</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
