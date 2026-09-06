import React, { useState } from 'react';
import axios from 'axios';
import { Terminal, Play, AlertCircle, History, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import SQLEditor from '../components/sql/SQLEditor';
import QueryFlow from '../components/sql/QueryFlow';
import QueryResult from '../components/sql/QueryResult';
import QueryExplanation from '../components/sql/QueryExplanation';
import LearningFeedback from '../components/learning/LearningFeedback';

const DEFAULT_DEMO_QUERY = `SELECT s.student_id, s.name,\n       c.course_code, c.title\nFROM students AS s\nINNER JOIN courses AS c\n  ON s.course_id = c.course_id\nWHERE c.course_code = 'CS101';`;

export default function SqlLabPage() {
  const { addActivity, addQueryToHistory, queryHistory, fetchTableRecords } = useDatabase();
  const [query, setQuery] = useState(DEFAULT_DEMO_QUERY);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [errorFeedback, setErrorFeedback] = useState(null);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsRunning(true);
    setErrorFeedback(null);

    try {
      const res = await axios.post('/api/query', { query });
      if (res.data?.success) {
        const queryData = res.data.data;
        setLastResult(queryData);

        addActivity(
          queryData.classification || 'QUERY',
          'SQL Query Executed',
          `Returned ${queryData.rowCount} row(s) in ${queryData.executionTimeMs}ms.`,
          'success'
        );

        addQueryToHistory({
          query,
          success: true,
          rowCount: queryData.rowCount,
          executionTimeMs: queryData.executionTimeMs
        });

        // If mutation query, refresh affected tables
        if (queryData.classification?.startsWith('MUTATION')) {
          fetchTableRecords('students');
          fetchTableRecords('courses');
        }
      }
    } catch (err) {
      console.error('Query execution error:', err);
      const errorData = err.response?.data?.error || {
        code: 'EXECUTION_ERROR',
        title: 'SQL Execution Error',
        whatHappened: err.message,
        suggestion: 'Check SQL syntax and verify table and column names.'
      };

      setErrorFeedback({
        success: false,
        error: errorData,
        sql: query
      });

      addActivity(
        'QUERY_ERROR',
        'Query Error',
        errorData.title || errorData.message || 'Execution failed',
        'error'
      );

      addQueryToHistory({
        query,
        success: false,
        rowCount: 0,
        executionTimeMs: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              SQL Execution & Visualization Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Write SQL, observe parsed relational steps, inspect joined datasets, and receive beginner-friendly explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuery(DEFAULT_DEMO_QUERY)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono transition-colors"
          >
            Load CS101 Capstone Query
          </button>
        </div>
      </div>

      {/* Monaco SQL Editor */}
      <SQLEditor
        query={query}
        onChange={setQuery}
        onRun={handleRunQuery}
        isRunning={isRunning}
        onClear={() => setQuery('')}
      />

      {/* Error / Warning Feedback Banner */}
      {errorFeedback && (
        <LearningFeedback
          feedback={errorFeedback}
          onClear={() => setErrorFeedback(null)}
        />
      )}

      {/* Visual Execution Flow Pipeline */}
      {lastResult && lastResult.flowSteps && (
        <QueryFlow flowSteps={lastResult.flowSteps} />
      )}

      {/* Results & Educational Explanations Grid */}
      {lastResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QueryResult result={lastResult} />
          <QueryExplanation explanation={lastResult.educationalSummary} />
        </div>
      )}

      {/* Query History Panel */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">Query Session History</h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">{queryHistory.length} recorded</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {queryHistory.map((q) => (
            <div
              key={q.id}
              onClick={() => setQuery(q.query)}
              className="p-2.5 bg-navy-950/70 hover:bg-navy-800/80 rounded-xl border border-navy-800/80 font-mono text-xs cursor-pointer flex items-center justify-between gap-3 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  q.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {q.success ? 'OK' : 'ERR'}
                </span>
                <span className="text-slate-300 truncate group-hover:text-blue-300 transition-colors">
                  {q.query}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 font-mono">{q.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
