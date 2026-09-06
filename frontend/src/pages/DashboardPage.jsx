import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TableProperties,
  Network,
  Users,
  BookOpen,
  Terminal,
  Layers,
  GraduationCap,
  ArrowRight,
  Database,
  Sparkles,
  Server
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityLog from '../components/dashboard/ActivityLog';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { schema, tableData, queryHistory, activityLogs, connectionStatus } = useDatabase();

  const coursesCount = tableData?.courses?.length || 3;
  const studentsCount = tableData?.students?.length || 3;
  const relationshipsCount = schema?.relationships?.length || 1;
  const queriesRunCount = queryHistory.length;

  const modules = [
    {
      step: '01',
      title: 'Database Schema',
      desc: 'Inspect tables, columns, data types, primary keys (PK), and foreign keys (FK).',
      path: '/schema',
      icon: TableProperties,
      color: 'blue'
    },
    {
      step: '02',
      title: 'ER Diagram',
      desc: 'Interactive visual entity-relationship canvas showing 1:N cardinality.',
      path: '/relationships',
      icon: Network,
      color: 'cyan'
    },
    {
      step: '03',
      title: 'SQL Lab',
      desc: 'Run queries in Monaco Editor and visualize execution pipelines step-by-step.',
      path: '/sql',
      icon: Terminal,
      color: 'emerald'
    },
    {
      step: '04',
      title: 'DB Operations',
      desc: 'Execute live INSERT, UPDATE, and DELETE with state diff comparisons.',
      path: '/operations',
      icon: Layers,
      color: 'amber'
    },
    {
      step: '05',
      title: 'Learning & Feedback',
      desc: 'Pedagogical feedback translating constraint errors into visual lessons.',
      path: '/learning',
      icon: GraduationCap,
      color: 'purple'
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-navy-900 to-navy-900 border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Educational DBMS Tool</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Database System Structure Visualizer
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Bridging <strong>Theory → Visualization → Interaction → Result → Learning Feedback</strong>. Understand relational schemas, primary/foreign keys, joins, operations, and referential integrity through visual exploration.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => navigate('/schema')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Learning Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/sql')}
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 font-semibold text-xs transition-colors"
            >
              Open SQL Lab
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          title="Tables"
          value={schema?.tables?.length || 2}
          subtitle="courses, students"
          icon={TableProperties}
          color="blue"
        />
        <StatsCard
          title="Relationships"
          value={relationshipsCount}
          subtitle="1:N (Foreign Key)"
          icon={Network}
          color="cyan"
        />
        <StatsCard
          title="Students"
          value={studentsCount}
          subtitle="Enrolled records"
          icon={Users}
          color="emerald"
        />
        <StatsCard
          title="Courses"
          value={coursesCount}
          subtitle="Offered subjects"
          icon={BookOpen}
          color="amber"
        />
        <StatsCard
          title="Queries Run"
          value={queriesRunCount}
          subtitle="In current session"
          icon={Terminal}
          color="purple"
        />
      </div>

      {/* Learning Modules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Learning Modules & Interactive Labs
          </h3>
          <span className="text-xs text-slate-400 font-medium">5 Core Components</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.path}
                onClick={() => navigate(m.path)}
                className="bg-navy-900 border border-navy-700/80 hover:border-blue-500/60 rounded-2xl p-4 shadow-lg cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-navy-800 text-slate-400 group-hover:text-blue-300 transition-colors">
                      {m.step}
                    </span>
                    <div className="p-2 rounded-xl bg-navy-800 group-hover:bg-blue-600/20 text-slate-300 group-hover:text-blue-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-3">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-850 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log & Recent Queries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityLog logs={activityLogs} />

        {/* Recent Queries Widget */}
        <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white tracking-tight">Recent Queries Executed</h4>
            </div>
            <button
              onClick={() => navigate('/sql')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Open SQL Lab →
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {queryHistory.slice(0, 5).map((q) => (
              <div
                key={q.id}
                onClick={() => navigate('/sql')}
                className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 font-mono text-xs hover:border-cyan-500/50 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${q.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {q.success ? '✓ SUCCESS' : '❌ ERROR'}
                  </span>
                  <span className="text-slate-500">{q.timestamp}</span>
                </div>
                <p className="text-slate-300 truncate font-mono text-[11px]">{q.query}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
