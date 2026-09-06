import React, { useState } from 'react';
import { UserPlus, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function InsertForm({ courses = [], onInsert, isSubmitting }) {
  const [name, setName] = useState('Riya');
  const [email, setEmail] = useState('riya@simats.edu');
  const [courseId, setCourseId] = useState('1'); // Default to CS101

  const handleSubmit = (e) => {
    e.preventDefault();
    onInsert({ name, email, course_id: courseId });
  };

  const handlePreloadRiya = () => {
    setName('Riya');
    setEmail('riya@simats.edu');
    setCourseId('1');
  };

  const handlePreloadFkError = () => {
    setName('Naveen');
    setEmail('naveen@simats.edu');
    setCourseId('99'); // Non-existent course ID
  };

  const handlePreloadDuplicateEmail = () => {
    setName('Duplicate Student');
    setEmail('ananya@simats.edu'); // Already exists
    setCourseId('1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* Quick Test Presets */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-navy-950/70 rounded-xl border border-navy-800">
        <span className="text-slate-400 font-medium">Quick Presets:</span>
        <button
          type="button"
          onClick={handlePreloadRiya}
          className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors font-mono"
        >
          ✓ Step 8: Preload "Riya" (CS101)
        </button>
        <button
          type="button"
          onClick={handlePreloadFkError}
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors font-mono"
        >
          ❌ Step 12: Trigger FK Error (course_id: 99)
        </button>
        <button
          type="button"
          onClick={handlePreloadDuplicateEmail}
          className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors font-mono"
        >
          ⚠️ Unique Violation (ananya@...)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
            Student Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riya"
            className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
            Student Email <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. riya@simats.edu"
            className="w-full bg-navy-950 border border-navy-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Course Select */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold uppercase text-[11px] tracking-wider flex items-center justify-between">
            <span>Enrolled Course (FK) <span className="text-rose-400">*</span></span>
            {courseId === '99' && (
              <span className="text-[10px] text-rose-400 font-bold">Invalid Parent ID</span>
            )}
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className={`w-full bg-navy-950 border rounded-lg px-3 py-2 font-mono focus:outline-none transition-colors ${
              courseId === '99'
                ? 'border-rose-500 text-rose-300 ring-1 ring-rose-500'
                : 'border-navy-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          >
            {courses.map((c) => (
              <option key={c.course_id} value={c.course_id}>
                ID {c.course_id}: {c.course_code} - {c.title}
              </option>
            ))}
            <option value="99">ID 99: [Non-existent Course ❌]</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'Inserting...' : 'INSERT STUDENT'}</span>
        </button>
      </div>
    </form>
  );
}
