import React, { useState, useEffect } from 'react';
import { Edit3, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UpdateForm({ students = [], onUpdate, isSubmitting }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [name, setName] = useState('');

  // Pre-select student if available
  useEffect(() => {
    if (students.length > 0) {
      // Find Riya or the latest student
      const riya = students.find(s => s.name.toLowerCase().includes('riya'));
      const target = riya || students[students.length - 1];
      setSelectedStudentId(String(target.student_id));
      setName(target.name === 'Riya' ? 'Riya Sharma' : `${target.name} (Updated)`);
    }
  }, [students]);

  const selectedStudent = students.find(s => String(s.student_id) === String(selectedStudentId));

  const handleStudentChange = (id) => {
    setSelectedStudentId(id);
    const target = students.find(s => String(s.student_id) === String(id));
    if (target) {
      setName(target.name === 'Riya' ? 'Riya Sharma' : `${target.name} (Updated)`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    onUpdate({
      student_id: parseInt(selectedStudentId, 10),
      name
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select Student */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
            Select Student to Update <span className="text-rose-400">*</span>
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                #{s.student_id}: {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        {/* New Name */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
            New Student Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riya Sharma"
            className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Live Preview of Modification */}
      {selectedStudent && (
        <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">CURRENT:</span>
            <span className="text-slate-300 font-semibold">{selectedStudent.name}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400" />
          <div className="flex items-center gap-2">
            <span className="text-blue-400">NEW VALUE:</span>
            <span className="text-emerald-400 font-bold">{name || '(empty)'}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !selectedStudentId}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isSubmitting ? 'Updating...' : 'UPDATE STUDENT'}</span>
        </button>
      </div>
    </form>
  );
}
