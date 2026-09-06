import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Sparkles, Code2, BookOpen } from 'lucide-react';

const PRESET_QUERIES = [
  {
    name: 'CS101 Students (Capstone Demo)',
    description: 'INNER JOIN students and courses filtered for CS101',
    sql: `SELECT s.student_id, s.name,\n       c.course_code, c.title\nFROM students AS s\nINNER JOIN courses AS c\n  ON s.course_id = c.course_id\nWHERE c.course_code = 'CS101';`
  },
  {
    name: 'All Students with Enrolled Courses',
    description: 'INNER JOIN connecting all students to courses',
    sql: `SELECT s.student_id, s.name, s.email,\n       c.course_code, c.title\nFROM students AS s\nINNER JOIN courses AS c\n  ON s.course_id = c.course_id\nORDER BY s.student_id ASC;`
  },
  {
    name: 'Courses Catalog',
    description: 'Inspect all courses',
    sql: `SELECT course_id, course_code, title\nFROM courses\nORDER BY course_id ASC;`
  },
  {
    name: 'CS102 Students (Operating Systems)',
    description: 'Filter students in CS102',
    sql: `SELECT s.student_id, s.name, c.course_code, c.title\nFROM students AS s\nJOIN courses AS c ON s.course_id = c.course_id\nWHERE c.course_code = 'CS102';`
  }
];

export default function SQLEditor({ query, onChange, onRun, isRunning, onClear }) {
  const handleFormat = () => {
    // Basic formatting clean-up
    const formatted = query
      .replace(/\s+/g, ' ')
      .replace(/\b(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|JOIN|ON|GROUP BY|ORDER BY|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM)\b/gi, match => `\n${match.toUpperCase()}`)
      .trim();
    onChange(formatted);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <div className="bg-navy-900 border border-navy-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Preset Quick Select Bar */}
      <div className="p-3 bg-navy-850/80 border-b border-navy-700/80 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium shrink-0">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Educational Presets:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {PRESET_QUERIES.map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange(preset.sql)}
              className="text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-lg bg-navy-950/80 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-navy-700/80 hover:border-blue-500/40 transition-all shrink-0"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Monaco Code Editor Area */}
      <div className="h-48 relative" onKeyDown={handleKeyDown}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={query}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            suggestOnTriggerCharacters: true
          }}
        />
      </div>

      {/* Editor Controls Bar */}
      <div className="p-3 bg-navy-950/90 border-t border-navy-700/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-300">Ctrl</span> + <span className="px-1.5 py-0.5 rounded bg-navy-800 border border-navy-700 text-slate-300">Enter</span> to run
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleFormat}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Format SQL</span>
          </button>

          <button
            onClick={onClear}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-rose-300 border border-navy-700 text-xs font-medium transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            type="button"
            className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
