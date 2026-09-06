import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DeleteForm({ students = [], onDelete, isSubmitting }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [confirmPrompt, setConfirmPrompt] = useState(false);

  useEffect(() => {
    if (students.length > 0) {
      // Find Riya or Riya Sharma or the last inserted row
      const riya = students.find(s => s.name.toLowerCase().includes('riya'));
      const target = riya || students[students.length - 1];
      setSelectedStudentId(String(target.student_id));
    }
  }, [students]);

  const selectedStudent = students.find(s => String(s.student_id) === String(selectedStudentId));

  const handleDelete = (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onDelete(parseInt(selectedStudentId, 10));
    setConfirmPrompt(false);
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1.5">
        <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
          Select Student to Remove <span className="text-rose-400">*</span>
        </label>
        <select
          value={selectedStudentId}
          onChange={(e) => {
            setSelectedStudentId(e.target.value);
            setConfirmPrompt(false);
          }}
          className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
        >
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              #{s.student_id}: {s.name} ({s.email}) — Course #{s.course_id}
            </option>
          ))}
        </select>
      </div>

      {/* Target Record Card */}
      {selectedStudent && (
        <div className="p-3.5 bg-navy-950/90 rounded-xl border border-rose-500/30 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-rose-400 font-bold uppercase text-[10px]">Candidate For Deletion:</span>
            <span>ID #{selectedStudent.student_id}</span>
          </div>
          <div className="text-slate-200 font-bold text-sm">
            {selectedStudent.name}
          </div>
          <div className="text-slate-400 text-[11px]">
            {selectedStudent.email} • Enrolled in Course #{selectedStudent.course_id}
          </div>
        </div>
      )}

      {/* Confirmation Warning Box */}
      {confirmPrompt ? (
        <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5 text-rose-300">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Confirm Deletion</p>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Are you sure you want to permanently delete <strong>{selectedStudent?.name}</strong> from database?
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirmPrompt(false)}
              className="px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30"
            >
              {isSubmitting ? 'Deleting...' : 'Yes, Delete Record'}
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmPrompt(true)}
            disabled={!selectedStudentId || isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>DELETE STUDENT</span>
          </button>
        </div>
      )}
    </div>
  );
}
