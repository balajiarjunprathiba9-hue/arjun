import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    mode: 'simulated',
    database: 'capstone_db',
    host: 'localhost',
    port: 3306,
    error: null
  });
  const [tableData, setTableData] = useState({});
  const [selectedTable, setSelectedTable] = useState('courses');
  const [queryHistory, setQueryHistory] = useState([
    {
      id: 'init_1',
      query: "SELECT s.student_id, s.name, c.course_code FROM students s JOIN courses c ON s.course_id = c.course_id WHERE c.course_code = 'CS101';",
      success: true,
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      rowCount: 2,
      executionTimeMs: 4
    }
  ]);
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 'act_0',
      type: 'INIT',
      status: 'success',
      title: 'Database Initialized',
      message: 'Initial seed loaded: 3 courses, 3 students.',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch health and schema
  const fetchSchemaAndHealth = useCallback(async () => {
    try {
      setLoading(true);
      const [healthRes, schemaRes] = await Promise.all([
        axios.get('/api/health').catch(e => ({ data: { success: false, data: { mode: 'offline', connected: false } } })),
        axios.get('/api/schema')
      ]);

      if (healthRes.data?.data) {
        setConnectionStatus(prev => ({
          ...prev,
          ...healthRes.data.data
        }));
      }

      if (schemaRes.data?.success) {
        setSchema(schemaRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load schema/health:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch table data for inspection
  const fetchTableRecords = useCallback(async (tableName) => {
    if (!tableName) return;
    try {
      const res = await axios.get(`/api/tables/${tableName}`);
      if (res.data?.success) {
        setTableData(prev => ({
          ...prev,
          [tableName]: res.data.data.rows
        }));
      }
    } catch (err) {
      console.error(`Error fetching table data for ${tableName}:`, err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSchemaAndHealth();
    fetchTableRecords('courses');
    fetchTableRecords('students');
  }, [fetchSchemaAndHealth, fetchTableRecords]);

  // Log activity
  const addActivity = (type, title, message, status = 'success') => {
    setActivityLogs(prev => [
      {
        id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type,
        title,
        message,
        status,
        time: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  };

  // Add query to history
  const addQueryToHistory = (item) => {
    setQueryHistory(prev => [
      {
        id: 'q_' + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        ...item
      },
      ...prev.slice(0, 49)
    ]);
  };

  // Reset demo database
  const resetDemoDatabase = async () => {
    setIsResetting(true);
    try {
      const res = await axios.post('/api/reset');
      if (res.data?.success) {
        await fetchSchemaAndHealth();
        await fetchTableRecords('courses');
        await fetchTableRecords('students');
        
        addActivity('RESET', 'Demo Database Restored', 'Reset courses and students to original seed state.', 'info');
        
        setLatestFeedback({
          operation: 'RESET',
          success: true,
          title: 'Database Successfully Restored',
          whatHappened: 'The demo database `capstone_db` was re-seeded to its original baseline state.',
          why: 'Allows students to experiment freely with operations and safely return to a clean working state anytime.',
          databaseConcept: 'Database Seeding & Test Isolation: Providing predictable starting points for reproducible learning scenarios.',
          visualExplanation: {
            type: 'reset',
            diagram: 'Database State ──[Reset DDL/Seed]──> 3 Courses, 3 Students ✓'
          },
          suggestion: 'Explore the Schema, ER Diagram, or run sample SQL queries.'
        });

        return { success: true, message: res.data.message };
      }
    } catch (err) {
      console.error('Reset error:', err);
      addActivity('RESET_FAILED', 'Database Reset Failed', err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        schema,
        loading,
        connectionStatus,
        tableData,
        selectedTable,
        setSelectedTable,
        queryHistory,
        activityLogs,
        latestFeedback,
        setLatestFeedback,
        isResetting,
        fetchSchemaAndHealth,
        fetchTableRecords,
        addActivity,
        addQueryToHistory,
        resetDemoDatabase
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
