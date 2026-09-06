import React, { useState } from 'react';
import { TableProperties, RefreshCw, Layers, Database, ArrowRight, Eye } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import TableCard from '../components/schema/TableCard';
import DatabaseTable from '../components/schema/DatabaseTable';

export default function SchemaPage() {
  const { schema, tableData, fetchSchemaAndHealth, fetchTableRecords, loading } = useDatabase();
  const [selectedTableName, setSelectedTableName] = useState('students');
  const [viewMode, setViewMode] = useState('both'); // 'schema' | 'data' | 'both'

  const tables = schema?.tables || [];
  const selectedTableMeta = tables.find(t => t.tableName === selectedTableName) || tables[0];
  const selectedRows = tableData[selectedTableName] || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <TableProperties className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Database Schema Browser
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Introspected directly from <code className="text-blue-400 font-mono">capstone_db</code> metadata and information schema.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'both' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('schema')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'schema' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Schema Only
          </button>
          <button
            onClick={() => setViewMode('data')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              viewMode === 'data' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Records Only
          </button>
        </div>
      </div>

      {/* Tables Schema Cards Section */}
      {(viewMode === 'both' || viewMode === 'schema') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Database Entities ({tables.length} Tables)</span>
            </h3>
            <span className="text-xs text-slate-400">Click a card to inspect live records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tables.map((table) => (
              <TableCard
                key={table.tableName}
                table={table}
                isSelected={selectedTableName === table.tableName}
                onSelect={() => {
                  setSelectedTableName(table.tableName);
                  fetchTableRecords(table.tableName);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Live Data Records View */}
      {(viewMode === 'both' || viewMode === 'data') && selectedTableMeta && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Live Records: <span className="text-cyan-300">{selectedTableName}</span>
              </h3>
            </div>
            {/* Table Selector Tabs */}
            <div className="flex items-center gap-1.5">
              {tables.map((t) => (
                <button
                  key={t.tableName}
                  onClick={() => {
                    setSelectedTableName(t.tableName);
                    fetchTableRecords(t.tableName);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedTableName === t.tableName
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
                  }`}
                >
                  {t.tableName} ({tableData[t.tableName]?.length || t.rowCount})
                </button>
              ))}
            </div>
          </div>

          <DatabaseTable
            tableName={selectedTableName}
            columns={selectedTableMeta.columns}
            rows={selectedRows}
          />
        </div>
      )}
    </div>
  );
}
