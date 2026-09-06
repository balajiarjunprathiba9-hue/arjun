import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Database,
  RotateCcw,
  RefreshCw,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import ResetDatabaseModal from './ResetDatabaseModal';

const moduleTitles = {
  '/dashboard': { title: 'System Dashboard', subtitle: 'Overview & Metrics' },
  '/schema': { title: 'Schema Visualization', subtitle: 'Tables, Columns & Constraints' },
  '/relationships': { title: 'ER Diagram & Relationships', subtitle: 'Cardinality & Foreign Key Graphs' },
  '/sql': { title: 'SQL Execution Lab', subtitle: 'Query Flow & Execution Pipelines' },
  '/operations': { title: 'Interactive Operations', subtitle: 'INSERT, UPDATE & DELETE Diffs' },
  '/learning': { title: 'Educational Feedback', subtitle: 'Theory, Integrity Rules & Explanations' },
};

export default function Topbar() {
  const location = useLocation();
  const { connectionStatus, fetchSchemaAndHealth, fetchTableRecords, loading } = useDatabase();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentModule = moduleTitles[location.pathname] || {
    title: 'DB Visualizer',
    subtitle: 'Database Learning Environment'
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchSchemaAndHealth(),
      fetchTableRecords('courses'),
      fetchTableRecords('students')
    ]);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <>
      <header className="h-16 bg-navy-900/90 backdrop-blur border-b border-navy-700/80 px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Module Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              {currentModule.title}
            </h2>
            <p className="text-xs text-slate-400 font-normal">
              {currentModule.subtitle}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Database Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-xs font-mono text-slate-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>DB:</span>
            <span className="text-blue-400 font-semibold">{connectionStatus.database || 'capstone_db'}</span>
          </div>

          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              connectionStatus.connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
            title={
              connectionStatus.connected
                ? `Connected to MySQL at ${connectionStatus.host}:${connectionStatus.port}`
                : 'Running in simulated sandbox engine with full capstone schema & data'
            }
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  connectionStatus.connected ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionStatus.connected ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
              />
            </span>
            <span>{connectionStatus.connected ? 'MySQL Live' : 'Sandbox Active'}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            title="Refresh Database Metadata"
            className="p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white hover:bg-navy-700 border border-navy-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Reset Demo Database Button */}
          <button
            onClick={() => setIsResetOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </header>

      {/* Confirmation Modal */}
      <ResetDatabaseModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </>
  );
}
