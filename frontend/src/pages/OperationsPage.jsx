import React, { useState } from 'react';
import axios from 'axios';
import { Layers, UserPlus, Edit3, Trash2, Database, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import InsertForm from '../components/operations/InsertForm';
import UpdateForm from '../components/operations/UpdateForm';
import DeleteForm from '../components/operations/DeleteForm';
import BeforeAfterView from '../components/operations/BeforeAfterView';
import LearningFeedback from '../components/learning/LearningFeedback';
import DatabaseTable from '../components/schema/DatabaseTable';

export default function OperationsPage() {
  const {
    schema,
    tableData,
    fetchTableRecords,
    fetchSchemaAndHealth,
    addActivity,
    setLatestFeedback
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('insert'); // 'insert' | 'update' | 'delete'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationResult, setOperationResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const courses = tableData.courses || [];
  const students = tableData.students || [];
  const studentColumns = schema?.tables?.find(t => t.tableName === 'students')?.columns || [];

  // Handle INSERT
  const handleInsert = async (formData) => {
    setIsSubmitting(true);
    setFeedback(null);
    setOperationResult(null);

    try {
      const res = await axios.post('/api/operations/insert', formData);
      if (res.data?.success) {
        const opData = res.data.data;
        setOperationResult(opData);
        setFeedback(opData.educationalFeedback);
        setLatestFeedback(opData.educationalFeedback);

        await Promise.all([
          fetchTableRecords('students'),
          fetchSchemaAndHealth()
        ]);

        addActivity(
          'INSERT',
          'Student Inserted',
          `Inserted '${formData.name}' (Course #${formData.course_id})`,
          'success'
        );
      }
    } catch (err) {
      console.error('Insert error:', err);
      const errResponse = err.response?.data?.error || {
        code: 'INSERT_ERROR',
        title: 'Insert Operation Failed',
        whatHappened: err.message
      };

      setFeedback({
        success: false,
        error: errResponse,
        sql: err.response?.data?.data?.sql || `INSERT INTO students (name, email, course_id) VALUES ('${formData.name}', '${formData.email}', ${formData.course_id});`
      });

      addActivity(
        'INSERT_ERROR',
        'Insert Constraint Error',
        errResponse.title || errResponse.message || 'Operation failed',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle UPDATE
  const handleUpdate = async (updateData) => {
    setIsSubmitting(true);
    setFeedback(null);
    setOperationResult(null);

    try {
      const res = await axios.put('/api/operations/update', updateData);
      if (res.data?.success) {
        const opData = res.data.data;
        setOperationResult(opData);
        setFeedback(opData.educationalFeedback);
        setLatestFeedback(opData.educationalFeedback);

        await Promise.all([
          fetchTableRecords('students'),
          fetchSchemaAndHealth()
        ]);

        addActivity(
          'UPDATE',
          'Student Updated',
          `Updated student #${updateData.student_id} to '${updateData.name}'`,
          'success'
        );
      }
    } catch (err) {
      console.error('Update error:', err);
      const errResponse = err.response?.data?.error || {
        code: 'UPDATE_ERROR',
        title: 'Update Operation Failed',
        whatHappened: err.message
      };

      setFeedback({
        success: false,
        error: errResponse,
        sql: err.response?.data?.data?.sql
      });

      addActivity(
        'UPDATE_ERROR',
        'Update Error',
        errResponse.title || errResponse.message || 'Operation failed',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle DELETE
  const handleDelete = async (student_id) => {
    setIsSubmitting(true);
    setFeedback(null);
    setOperationResult(null);

    try {
      const res = await axios.delete('/api/operations/delete', {
        data: { student_id }
      });

      if (res.data?.success) {
        const opData = res.data.data;
        setOperationResult(opData);
        setFeedback(opData.educationalFeedback);
        setLatestFeedback(opData.educationalFeedback);

        await Promise.all([
          fetchTableRecords('students'),
          fetchSchemaAndHealth()
        ]);

        addActivity(
          'DELETE',
          'Student Deleted',
          `Deleted student #${student_id}`,
          'success'
        );
      }
    } catch (err) {
      console.error('Delete error:', err);
      const errResponse = err.response?.data?.error || {
        code: 'DELETE_ERROR',
        title: 'Delete Operation Failed',
        whatHappened: err.message
      };

      setFeedback({
        success: false,
        error: errResponse
      });

      addActivity(
        'DELETE_ERROR',
        'Delete Error',
        errResponse.title || errResponse.message || 'Operation failed',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Interactive Database Operations
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Execute real INSERT, UPDATE, and DELETE operations. Inspect live state transitions, SQL commands, and constraint reactions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-navy-950 p-1.5 rounded-xl border border-navy-800">
          <button
            onClick={() => {
              setActiveTab('insert');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'insert'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>INSERT</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('update');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'update'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>UPDATE</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('delete');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'delete'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DELETE</span>
          </button>
        </div>
      </div>

      {/* Operation Form Container */}
      <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {activeTab === 'insert' && 'Insert New Student (FK Reference Required)'}
            {activeTab === 'update' && 'Update Existing Student Record (Primary Key Target)'}
            {activeTab === 'delete' && 'Delete Student Record (Cascades / Referential Action)'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">Target Table: students</span>
        </div>

        {activeTab === 'insert' && (
          <InsertForm
            courses={courses}
            onInsert={handleInsert}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'update' && (
          <UpdateForm
            students={students}
            onUpdate={handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'delete' && (
          <DeleteForm
            students={students}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Educational Feedback / Error Lesson */}
      {feedback && (
        <LearningFeedback
          feedback={feedback}
          onClear={() => setFeedback(null)}
        />
      )}

      {/* Before / After State Transition View */}
      {operationResult && (
        <BeforeAfterView operationData={operationResult} />
      )}

      {/* Current Live Students Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Current Live Database: students Table ({students.length} rows)
          </h4>
          <span className="text-[11px] text-slate-500">Refreshed automatically after operations</span>
        </div>
        <DatabaseTable
          tableName="students"
          columns={studentColumns}
          rows={students}
          highlightedRowId={operationResult?.insertedRow?.student_id || operationResult?.diff?.student_id}
        />
      </div>
    </div>
  );
}
