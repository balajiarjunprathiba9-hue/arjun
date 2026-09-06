import React from 'react';
import { Network, GitFork, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import ERDiagram from '../components/er/ERDiagram';

export default function RelationshipsPage() {
  const { schema, setSelectedTable } = useDatabase();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Entity-Relationship Diagram & Foreign Keys
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Visualizing table relationships, primary key anchors, and foreign key referential integrity constraints.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-navy-950 px-3 py-1.5 rounded-xl border border-navy-800 text-xs font-mono text-cyan-300">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <span>courses (1) ───[FK: course_id]───► students (N)</span>
        </div>
      </div>

      {/* React Flow ER Diagram Canvas */}
      <ERDiagram
        schema={schema}
        onSelectTable={(tbl) => setSelectedTable(tbl)}
      />

      {/* Relational Theory Quick Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Primary Key (PK)</span>
          </div>
          <h4 className="text-sm font-bold text-white">courses.course_id</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unique identifier for each course. Guarantees entity integrity and acts as the referenced anchor for student enrollments.
          </p>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Foreign Key (FK)</span>
          </div>
          <h4 className="text-sm font-bold text-white">students.course_id</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Child attribute that must correspond to a valid parent <code className="text-blue-300">course_id</code>. Rejects any attempt to insert an invalid course ID.
          </p>
        </div>

        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Referential Action (CASCADE)</span>
          </div>
          <h4 className="text-sm font-bold text-white">ON DELETE CASCADE</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            If a course is deleted from the parent table, MySQL automatically removes all students assigned to that course, preventing dangling orphaned rows.
          </p>
        </div>
      </div>
    </div>
  );
}
