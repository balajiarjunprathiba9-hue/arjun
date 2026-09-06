import React, { useState } from 'react';
import axios from 'axios';
import {
  GraduationCap,
  BookOpen,
  Key,
  Link,
  Table,
  Layers,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Terminal,
  Play
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import LearningFeedback from '../components/learning/LearningFeedback';

const CONCEPTS = [
  {
    id: 'table',
    title: 'What is a Table?',
    category: 'Structure',
    icon: Table,
    color: 'blue',
    summary: 'A relational collection of rows (records) and columns (attributes).',
    description: 'In relational databases, data is organized into two-dimensional tables. Each row represents an individual entity instance (e.g. one student), and each column represents a named attribute (e.g. name, email).',
    example: 'In capstone_db: `courses` holds subjects, while `students` holds learners.'
  },
  {
    id: 'pk',
    title: 'Primary Key (PK)',
    category: 'Integrity',
    icon: Key,
    color: 'amber',
    summary: 'An attribute that uniquely and unalterably identifies each row.',
    description: 'A Primary Key must contain unique values and cannot contain NULL. It prevents duplicate rows and acts as the unique anchor for relationships.',
    example: '`courses.course_id` (1, 2, 3) and `students.student_id` (1, 2, 3).'
  },
  {
    id: 'fk',
    title: 'Foreign Key (FK)',
    category: 'Relational',
    icon: Link,
    color: 'cyan',
    summary: 'A column in a child table referencing the Primary Key of a parent table.',
    description: 'Foreign Keys enforce referential integrity. The database guarantees that you cannot assign a student to a course that does not exist.',
    example: '`students.course_id` references `courses.course_id`.'
  },
  {
    id: 'ref_integrity',
    title: 'Referential Integrity',
    category: 'Integrity',
    icon: ShieldCheck,
    color: 'emerald',
    summary: 'The relational rule that prevents orphaned child records.',
    description: 'Enforced by RDBMS engines (like MySQL InnoDB). Ensures relationships between tables remain synchronized. Operations violating this rule (like inserting course_id=99) are rejected with error 1452.',
    example: 'Try inserting course_id = 99 in the Operations or Sandbox tab!'
  },
  {
    id: 'join',
    title: 'SQL INNER JOIN',
    category: 'Querying',
    icon: Terminal,
    color: 'purple',
    summary: 'Combines columns from two tables based on a related key condition.',
    description: 'Matches rows where `students.course_id = courses.course_id`. Only returns rows that find a match in both parent and child tables.',
    example: 'SELECT s.name, c.title FROM students s INNER JOIN courses c ON s.course_id = c.course_id;'
  },
  {
    id: 'cascade',
    title: 'ON DELETE CASCADE',
    category: 'Actions',
    icon: Layers,
    color: 'rose',
    summary: 'Automated cleanup of child rows when a parent row is removed.',
    description: 'When the parent course is deleted, MySQL automatically cascades the deletion down to all enrolled students so no orphan records remain.',
    example: 'FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE'
  }
];

export default function LearningPage() {
  const { latestFeedback, setLatestFeedback, addActivity } = useDatabase();
  const [selectedConcept, setSelectedConcept] = useState(CONCEPTS[2]); // Default to Foreign Key
  const [sandboxFeedback, setSandboxFeedback] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Direct Interactive Simulation triggers
  const triggerSimulation = async (type) => {
    setIsSimulating(true);
    setSandboxFeedback(null);

    try {
      if (type === 'fk_error') {
        // Attempt insert with course_id: 99
        await axios.post('/api/operations/insert', {
          name: 'Naveen Kumar',
          email: 'naveen@simats.edu',
          course_id: 99
        });
      } else if (type === 'duplicate_email') {
        // Attempt insert with duplicate email
        await axios.post('/api/operations/insert', {
          name: 'Duplicate Student',
          email: 'ananya@simats.edu',
          course_id: 1
        });
      } else if (type === 'join_success') {
        const res = await axios.post('/api/query', {
          query: `SELECT s.student_id, s.name, c.course_code, c.title FROM students s JOIN courses c ON s.course_id = c.course_id WHERE c.course_code = 'CS101';`
        });
        setSandboxFeedback({
          success: true,
          title: 'INNER JOIN Query Succeeded',
          whatHappened: 'The query joined students and courses using the foreign key relationship.',
          why: 'Every student record in CS101 matched an existing course row with course_id = 1.',
          databaseConcept: 'Relational Join: Bridging normalized tables on Primary/Foreign key boundaries without duplicating table schemas.',
          visualExplanation: {
            diagram: '[students] ───[course_id = 1]───► [courses: CS101] ───► 2 Matching Rows (Ananya, Kavin) ✓'
          },
          suggestion: 'Notice how data redundancy is avoided: student records do not duplicate course descriptions.'
        });
      }
    } catch (err) {
      const errObj = err.response?.data?.error || {
        code: 'SIMULATION_ERROR',
        title: 'Error Triggered',
        whatHappened: err.message
      };

      setSandboxFeedback({
        success: false,
        error: errObj,
        sql: err.response?.data?.data?.sql || null
      });

      addActivity('LEARN_SIM', 'Interactive Simulation', errObj.title, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Relational Theory & Educational Feedback
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Translating database engine mechanics into intuitive visual lessons. OBSERVE → INTERACT → EXPLAIN → REFLECT.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Interactive Constraint Error Simulator
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Pedagogical Sandbox</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Click any simulation below to trigger a real MySQL engine event and see how the visual learning feedback explains the underlying relational theory:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => triggerSimulation('fk_error')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400">ERROR 1452</span>
              <Play className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h5 className="text-xs font-bold text-white">Foreign Key Violation</h5>
            <p className="text-[11px] text-slate-400 mt-1">Insert student with non-existent course_id = 99.</p>
          </button>

          <button
            onClick={() => triggerSimulation('duplicate_email')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-purple-400">ERROR 1062</span>
              <Play className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h5 className="text-xs font-bold text-white">Unique Key Violation</h5>
            <p className="text-[11px] text-slate-400 mt-1">Attempt to insert an existing email address.</p>
          </button>

          <button
            onClick={() => triggerSimulation('join_success')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">SUCCESS</span>
              <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h5 className="text-xs font-bold text-white">INNER JOIN Success</h5>
            <p className="text-[11px] text-slate-400 mt-1">Join students and courses on course_id for CS101.</p>
          </button>
        </div>

        {/* Live Simulator Feedback */}
        {sandboxFeedback && (
          <div className="pt-2">
            <LearningFeedback
              feedback={sandboxFeedback}
              onClear={() => setSandboxFeedback(null)}
            />
          </div>
        )}
      </div>

      {/* Concept Guides Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Core Database Engineering Concepts
        </h3>

        {/* Concept Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CONCEPTS.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedConcept.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedConcept(c)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 scale-105'
                    : 'bg-navy-900 border-navy-700/80 hover:border-navy-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-navy-800 text-slate-400">
                      {c.category}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="font-bold text-xs text-white leading-tight">
                    {c.title}
                  </h4>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold mt-2 block">
                  {isSelected ? 'Active' : 'Read →'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Concept Deep-Dive Panel */}
        {selectedConcept && (
          <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-blue-400">
                  Concept Deep-Dive
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedConcept.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {selectedConcept.summary}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <selectedConcept.icon className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-navy-950/80 p-4 rounded-xl border border-navy-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{selectedConcept.description}</p>
              <div className="pt-2 border-t border-navy-850 flex items-center gap-2 font-mono text-[11px] text-cyan-300">
                <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-400 font-semibold">Capstone Context:</span>
                <code>{selectedConcept.example}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
