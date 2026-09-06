const mysql = require('mysql2/promise');
require('dotenv').config();

// Initial Seed Data (Used for seed/reset and in-memory simulation mode)
const INITIAL_COURSES = [
  { course_id: 1, course_code: 'CS101', title: 'Database Systems' },
  { course_id: 2, course_code: 'CS102', title: 'Operating Systems' },
  { course_id: 3, course_code: 'CS103', title: 'Computer Networks' }
];

const INITIAL_STUDENTS = [
  { student_id: 1, name: 'Ananya', email: 'ananya@simats.edu', course_id: 1 },
  { student_id: 2, name: 'Kavin',  email: 'kavin@simats.edu',  course_id: 1 },
  { student_id: 3, name: 'Arun',   email: 'arun@simats.edu',   course_id: 2 }
];

// In-Memory Simulated State
let simCourses = JSON.parse(JSON.stringify(INITIAL_COURSES));
let simStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
let nextCourseId = 4;
let nextStudentId = 4;

let pool = null;
let connectionStatus = {
  connected: false,
  mode: 'simulated', // 'mysql' | 'simulated'
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'capstone_db',
  user: process.env.DB_USER || 'root',
  lastChecked: null,
  error: null
};

// Attempt to initialize MySQL pool if credentials are provided
async function initializePool() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'capstone_db';

  connectionStatus.lastChecked = new Date().toISOString();

  // If password is not set or user wants to test connection, we attempt cleanly
  try {
    const testPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    });

    const conn = await testPool.getConnection();
    await conn.ping();
    conn.release();

    pool = testPool;
    connectionStatus.connected = true;
    connectionStatus.mode = 'mysql';
    connectionStatus.error = null;
    console.log(`[DB] Connected successfully to MySQL database "${database}" on ${host}:${port}`);
    return true;
  } catch (err) {
    pool = null;
    connectionStatus.connected = false;
    connectionStatus.mode = 'simulated';
    connectionStatus.error = err.message;
    console.log(`[DB] MySQL server not connected (${err.message}). Running in robust educational simulation mode with capstone_db seed data.`);
    return false;
  }
}

// Get current status
function getConnectionStatus() {
  return { ...connectionStatus };
}

// Reset database to initial seed state
async function resetDatabase() {
  if (pool && connectionStatus.connected) {
    try {
      await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
      await pool.query('TRUNCATE TABLE students;');
      await pool.query('TRUNCATE TABLE courses;');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1;');

      for (const c of INITIAL_COURSES) {
        await pool.query('INSERT INTO courses (course_id, course_code, title) VALUES (?, ?, ?)', [c.course_id, c.course_code, c.title]);
      }
      for (const s of INITIAL_STUDENTS) {
        await pool.query('INSERT INTO students (student_id, name, email, course_id) VALUES (?, ?, ?, ?)', [s.student_id, s.name, s.email, s.course_id]);
      }
      return { success: true, mode: 'mysql', message: 'Demo database capstone_db restored to original state in MySQL.' };
    } catch (err) {
      console.error('[DB Reset Error]', err);
      throw err;
    }
  } else {
    // In-memory reset
    simCourses = JSON.parse(JSON.stringify(INITIAL_COURSES));
    simStudents = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    nextCourseId = 4;
    nextStudentId = 4;
    return { success: true, mode: 'simulated', message: 'Demo database capstone_db restored to original seed state.' };
  }
}

// Execute arbitrary safe query
async function executeSql(sqlString, params = []) {
  if (pool && connectionStatus.connected) {
    const [rows, fields] = await pool.query(sqlString, params);
    return { rows, fields, mode: 'mysql' };
  }

  // Simulated SQL execution engine for offline resilience
  return executeSimulatedSql(sqlString, params);
}

// In-memory query simulation for full offline resilience
function executeSimulatedSql(sqlString, params = []) {
  const cleanSql = sqlString.trim().replace(/;+$/, '');
  const lower = cleanSql.toLowerCase();

  // 1. SELECT query handling
  if (lower.startsWith('select')) {
    // Check for JOIN students & courses
    const hasJoin = lower.includes('join') && lower.includes('courses') && lower.includes('students');
    const isCs101Filter = /cs101/i.test(cleanSql);

    if (hasJoin) {
      let combined = simStudents.map(s => {
        const c = simCourses.find(item => item.course_id === s.course_id) || {};
        return {
          student_id: s.student_id,
          name: s.name,
          email: s.email,
          course_id: s.course_id,
          course_code: c.course_code || 'UNKNOWN',
          title: c.title || 'Unknown Course'
        };
      });

      if (isCs101Filter) {
        combined = combined.filter(r => r.course_code.toUpperCase() === 'CS101');
      }

      // If user specified specific fields in demo query:
      // SELECT s.student_id, s.name, c.course_code, c.title
      if (lower.includes('s.student_id') && lower.includes('s.name') && lower.includes('c.course_code')) {
        combined = combined.map(r => ({
          student_id: r.student_id,
          name: r.name,
          course_code: r.course_code,
          title: r.title
        }));
      }

      return { rows: combined, fields: [], mode: 'simulated' };
    }

    if (lower.includes('from students') || lower.includes('from `students`')) {
      let res = [...simStudents];
      if (/where\s+student_id\s*=\s*(\d+)/i.test(cleanSql)) {
        const id = parseInt(cleanSql.match(/where\s+student_id\s*=\s*(\d+)/i)[1], 10);
        res = res.filter(s => s.student_id === id);
      }
      return { rows: res, fields: [], mode: 'simulated' };
    }

    if (lower.includes('from courses') || lower.includes('from `courses`')) {
      let res = [...simCourses];
      if (/where\s+course_id\s*=\s*(\d+)/i.test(cleanSql)) {
        const id = parseInt(cleanSql.match(/where\s+course_id\s*=\s*(\d+)/i)[1], 10);
        res = res.filter(c => c.course_id === id);
      }
      return { rows: res, fields: [], mode: 'simulated' };
    }

    return { rows: [], fields: [], mode: 'simulated' };
  }

  // 2. INSERT handling
  if (lower.startsWith('insert into students')) {
    let name = params[0], email = params[1], course_id = params[2];
    if (!name && cleanSql.includes('values')) {
      const match = cleanSql.match(/values\s*\(\s*(?:['"](.*?)['"]|(\d+))\s*,\s*(?:['"](.*?)['"]|(\d+))\s*,\s*(\d+)\s*\)/i);
      if (match) {
        name = match[1] || match[2];
        email = match[3] || match[4];
        course_id = parseInt(match[5], 10);
      }
    }

    course_id = parseInt(course_id, 10);

    // Check foreign key constraint
    const parentCourse = simCourses.find(c => c.course_id === course_id);
    if (!parentCourse) {
      const err = new Error(`Cannot add or update a child row: a foreign key constraint fails (\`capstone_db\`.\`students\`, CONSTRAINT \`fk_students_course\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\` (\`course_id\`) ON DELETE CASCADE)`);
      err.code = 'ER_NO_REFERENCED_ROW_2';
      err.errno = 1452;
      err.context = { parentTable: 'courses', childTable: 'students', fkColumn: 'course_id', value: course_id, validParentIds: simCourses.map(c => c.course_id) };
      throw err;
    }

    // Check unique email
    const duplicateEmail = simStudents.find(s => s.email.toLowerCase() === (email || '').toLowerCase());
    if (duplicateEmail) {
      const err = new Error(`Duplicate entry '${email}' for key 'students.email'`);
      err.code = 'ER_DUP_ENTRY';
      err.errno = 1062;
      err.context = { key: 'email', value: email };
      throw err;
    }

    const newRow = {
      student_id: nextStudentId++,
      name: name || 'Student',
      email: email || `student${nextStudentId}@simats.edu`,
      course_id
    };
    simStudents.push(newRow);
    return { rows: { insertId: newRow.student_id, affectedRows: 1 }, mode: 'simulated' };
  }

  // 3. UPDATE handling
  if (lower.startsWith('update students')) {
    let student_id = params[1] || null;
    let name = params[0] || null;

    if (!student_id) {
      const idMatch = cleanSql.match(/where\s+student_id\s*=\s*(\d+)/i);
      if (idMatch) student_id = parseInt(idMatch[1], 10);
    }
    if (!name) {
      const nameMatch = cleanSql.match(/set\s+name\s*=\s*['"](.*?)['"]/i);
      if (nameMatch) name = nameMatch[1];
    }

    const target = simStudents.find(s => s.student_id === parseInt(student_id, 10));
    if (target && name) {
      target.name = name;
      return { rows: { affectedRows: 1, changedRows: 1 }, mode: 'simulated' };
    }
    return { rows: { affectedRows: 0, changedRows: 0 }, mode: 'simulated' };
  }

  // 4. DELETE handling
  if (lower.startsWith('delete from students')) {
    let student_id = params[0] || null;
    if (!student_id) {
      const idMatch = cleanSql.match(/where\s+student_id\s*=\s*(\d+)/i);
      if (idMatch) student_id = parseInt(idMatch[1], 10);
    }

    const initialLen = simStudents.length;
    simStudents = simStudents.filter(s => s.student_id !== parseInt(student_id, 10));
    const affected = initialLen - simStudents.length;
    return { rows: { affectedRows: affected }, mode: 'simulated' };
  }

  return { rows: [], fields: [], mode: 'simulated' };
}

// Get simulated schema structure
function getSimulatedSchema() {
  return {
    database: 'capstone_db',
    tables: [
      {
        tableName: 'courses',
        type: 'BASE TABLE',
        rowCount: simCourses.length,
        description: 'Parent entity representing academic course offerings',
        columns: [
          {
            name: 'course_id',
            type: 'int',
            dataType: 'int',
            isPrimaryKey: true,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: true,
            defaultValue: null,
            columnComment: 'Primary Key identifier for course'
          },
          {
            name: 'course_code',
            type: 'varchar(20)',
            dataType: 'varchar',
            isPrimaryKey: false,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: false,
            defaultValue: null,
            columnComment: 'Unique academic department code (e.g. CS101)'
          },
          {
            name: 'title',
            type: 'varchar(100)',
            dataType: 'varchar',
            isPrimaryKey: false,
            isForeignKey: false,
            isNullable: false,
            isUnique: false,
            isAutoIncrement: false,
            defaultValue: null,
            columnComment: 'Descriptive title of the course'
          }
        ]
      },
      {
        tableName: 'students',
        type: 'BASE TABLE',
        rowCount: simStudents.length,
        description: 'Child entity representing enrolled students linked to courses',
        columns: [
          {
            name: 'student_id',
            type: 'int',
            dataType: 'int',
            isPrimaryKey: true,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: true,
            defaultValue: null,
            columnComment: 'Primary Key identifier for student'
          },
          {
            name: 'name',
            type: 'varchar(50)',
            dataType: 'varchar',
            isPrimaryKey: false,
            isForeignKey: false,
            isNullable: false,
            isUnique: false,
            isAutoIncrement: false,
            defaultValue: null,
            columnComment: 'Full student name'
          },
          {
            name: 'email',
            type: 'varchar(50)',
            dataType: 'varchar',
            isPrimaryKey: false,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: false,
            defaultValue: null,
            columnComment: 'Unique educational institutional email address'
          },
          {
            name: 'course_id',
            type: 'int',
            dataType: 'int',
            isPrimaryKey: false,
            isForeignKey: true,
            isNullable: false,
            isUnique: false,
            isAutoIncrement: false,
            defaultValue: null,
            columnComment: 'Foreign Key referencing courses(course_id)',
            foreignKey: {
              constraintName: 'fk_students_course',
              referencedTable: 'courses',
              referencedColumn: 'course_id',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE'
            }
          }
        ]
      }
    ],
    relationships: [
      {
        id: 'rel_students_courses',
        constraintName: 'fk_students_course',
        parentTable: 'courses',
        parentColumn: 'course_id',
        childTable: 'students',
        childColumn: 'course_id',
        cardinality: '1:N',
        type: 'One-to-Many',
        direction: 'courses.course_id → students.course_id',
        explanation: 'One course can have many enrolled students. Each student belongs to exactly one course.',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    ]
  };
}

function getSimulatedTableData(tableName) {
  if (tableName === 'courses') return [...simCourses];
  if (tableName === 'students') return [...simStudents];
  return null;
}

module.exports = {
  initializePool,
  getConnectionStatus,
  executeSql,
  resetDatabase,
  getSimulatedSchema,
  getSimulatedTableData,
  getPool: () => pool
};
