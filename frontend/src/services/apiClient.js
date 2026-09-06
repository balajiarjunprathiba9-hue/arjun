import axios from 'axios';
import {
  getClientSchema,
  getClientTable,
  resetClientDb,
  executeClientQuery,
  executeClientInsert,
  executeClientUpdate,
  executeClientDelete
} from './clientDbEngine';

// Axios Interceptor to automatically fallback to clientDbEngine on static cloud hosts
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || !config.url || !config.url.startsWith('/api')) {
      return Promise.reject(error);
    }

    const url = config.url;
    const method = (config.method || 'get').toLowerCase();

    // 1. Health
    if (url === '/api/health') {
      return {
        data: {
          success: true,
          data: { status: 'UP', database: 'capstone_db', mode: 'simulated (cloud)', connected: true }
        }
      };
    }

    // 2. Schema
    if (url === '/api/schema') {
      return {
        data: {
          success: true,
          data: getClientSchema()
        }
      };
    }

    // 3. Table data
    const tableMatch = url.match(/\/api\/tables\/([a-zA-Z0-9_]+)/);
    if (tableMatch) {
      const tableName = tableMatch[1];
      const rows = getClientTable(tableName);
      return {
        data: {
          success: true,
          data: { tableName, rowCount: rows.length, rows }
        }
      };
    }

    // 4. Query
    if (url === '/api/query' && method === 'post') {
      try {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const result = executeClientQuery(body.query);
        return { data: { success: true, data: result } };
      } catch (err) {
        return Promise.reject({ response: { data: { success: false, error: err } } });
      }
    }

    // 5. Operations
    if (url === '/api/operations/insert' && method === 'post') {
      try {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const result = executeClientInsert(body);
        return { data: { success: true, data: result } };
      } catch (err) {
        return Promise.reject({ response: { data: { success: false, error: err } } });
      }
    }

    if (url === '/api/operations/update' && method === 'put') {
      try {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const result = executeClientUpdate(body);
        return { data: { success: true, data: result } };
      } catch (err) {
        return Promise.reject({ response: { data: { success: false, error: err } } });
      }
    }

    if (url === '/api/operations/delete' && method === 'delete') {
      try {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const result = executeClientDelete(body.student_id);
        return { data: { success: true, data: result } };
      } catch (err) {
        return Promise.reject({ response: { data: { success: false, error: err } } });
      }
    }

    // 6. Reset
    if (url === '/api/reset' && method === 'post') {
      const res = resetClientDb();
      return { data: { success: true, message: res.message } };
    }

    return Promise.reject(error);
  }
);
