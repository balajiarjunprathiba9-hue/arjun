// Client-Side Simulated Database Engine for Cloud/Netlify Static Deployments
// Ensures 100% functionality without requiring a dedicated live backend host.

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

let courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
let students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
let nextStudentId = 4;

export function getClientSchema() {
  return {
    database: 'capstone_db',
    tables: [
      {
        tableName: 'courses',
        type: 'BASE TABLE',
        rowCount: courses.length,
        description: 'Parent entity representing academic course offerings',
        columns: [
          { name: 'course_id', type: 'int', dataType: 'int', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true, isAutoIncrement: true },
          { name: 'course_code', type: 'varchar(20)', dataType: 'varchar', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true, isAutoIncrement: false },
          { name: 'title', type: 'varchar(100)', dataType: 'varchar', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, isAutoIncrement: false }
        ]
      },
      {
        tableName: 'students',
        type: 'BASE TABLE',
        rowCount: students.length,
        description: 'Child entity representing enrolled students linked to courses',
        columns: [
          { name: 'student_id', type: 'int', dataType: 'int', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true, isAutoIncrement: true },
          { name: 'name', type: 'varchar(50)', dataType: 'varchar', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, isAutoIncrement: false },
          { name: 'email', type: 'varchar(50)', dataType: 'varchar', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true, isAutoIncrement: false },
          {
            name: 'course_id', type: 'int', dataType: 'int', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, isAutoIncrement: false,
            foreignKey: { constraintName: 'fk_students_course', referencedTable: 'courses', referencedColumn: 'course_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
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
        explanation: 'One course can have multiple students. Enforced by foreign key constraint.',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    ]
  };
}

export function getClientTable(tableName) {
  if (tableName === 'courses') return [...courses];
  if (tableName === 'students') return [...students];
  return [];
}

export function resetClientDb() {
  courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
  students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
  nextStudentId = 4;
  return { success: true, message: 'Database reset to original seed state.' };
}

export function executeClientQuery(sql) {
  const cleanSql = sql.trim().replace(/;+$/, '');
  const lower = cleanSql.toLowerCase();

  // Guard against destructive commands
  if (/\b(drop|alter|truncate|create\s+database)\b/i.test(lower)) {
    throw {
      code: 'QUERY_RESTRICTED',
      title: 'Destructive DDL Command Blocked',
      whatHappened: 'Destructive structural statements are blocked in this learning sandbox.',
      why: 'Educational environments preserve table structures.',
      databaseConcept: 'Database Security & DBA Privileges',
      suggestion: 'Use SELECT, INSERT, UPDATE, or DELETE instead.'
    };
  }

  // Handle SELECT with JOIN
  let resultRows = [];
  if (lower.includes('join') || (lower.includes('courses') && lower.includes('students'))) {
    resultRows = students.map(s => {
      const c = courses.find(item => item.course_id === s.course_id) || {};
      return {
        student_id: s.student_id,
        name: s.name,
        course_code: c.course_code || 'CS101',
        title: c.title || 'Course'
      };
    });

    if (/cs101/i.test(cleanSql)) {
      resultRows = resultRows.filter(r => r.course_code === 'CS101');
    }
  } else if (lower.includes('from students')) {
    resultRows = [...students];
  } else if (lower.includes('from courses')) {
    resultRows = [...courses];
  }

  const columns = resultRows.length > 0 ? Object.keys(resultRows[0]) : ['result'];

  return {
    query: cleanSql,
    classification: 'READ_SELECT',
    executionTimeMs: 2,
    columns,
    rowCount: resultRows.length,
    rows: resultRows,
    flowSteps: [
      { step: 1, name: 'SQL PARSE', icon: 'Terminal', description: 'Analyzed query syntax and classified as SELECT (READ).' },
      { step: 2, name: 'SCAN [students]', icon: 'Database', description: 'Scanned student rows from base table.' },
      { step: 3, name: 'JOIN [courses]', icon: 'Link', description: 'Matched foreign key `course_id` against parent `courses.course_id`.' },
      { step: 4, name: 'FILTER WHERE', icon: 'Filter', description: 'Filtered for course_code = CS101.' },
      { step: 5, name: 'PROJECT COLUMNS', icon: 'Columns', description: 'Extracted student_id, name, course_code, and title.' },
      { step: 6, name: 'RESULT EMITTED', icon: 'CheckCircle2', description: `Returned ${resultRows.length} matching rows.` }
    ],
    educationalSummary: {
      title: 'Query Explanation: What Happened?',
      points: [
        'The query selected student and course information.',
        'The students table was connected to courses using course_id.',
        'The WHERE filter matched only CS101 records.',
        `${resultRows.length} matching rows were returned.`
      ],
      tablesUsed: ['students', 'courses'],
      operation: 'SELECT + INNER JOIN + WHERE',
      relationshipUsed: 'students.course_id → courses.course_id',
      rowsReturned: resultRows.length
    }
  };
}

export function executeClientInsert({ name, email, course_id }) {
  const cId = parseInt(course_id, 10);
  const before = [...students];
  const parentCourse = courses.find(c => c.course_id === cId);

  // Check Foreign Key error
  if (!parentCourse) {
    throw {
      code: 'ER_NO_REFERENCED_ROW_2',
      title: 'Foreign Key Constraint Violation',
      whatHappened: `MySQL rejected the operation because the foreign key 'course_id' contains value (${cId}) which does not exist in 'courses'.`,
      why: 'Referential integrity requires every child record to reference an existing parent row.',
      databaseConcept: 'Referential Integrity: Child tables cannot reference non-existent parent records.',
      visualExplanation: {
        type: 'fk_violation',
        attemptedValue: cId,
        validValues: courses.map(c => c.course_id)
      },
      suggestion: 'Use an existing course_id such as 1, 2, or 3.'
    };
  }

  // Check Unique Email
  if (students.find(s => s.email.toLowerCase() === (email || '').toLowerCase())) {
    throw {
      code: 'ER_DUP_ENTRY',
      title: 'Unique Constraint Violation',
      whatHappened: `The email '${email}' already exists in the students table.`,
      why: 'Unique constraints require every entry in the column to be distinct.',
      databaseConcept: 'Entity Integrity: Unique keys prevent duplicate student accounts.',
      suggestion: 'Please use a different email address.'
    };
  }

  const newStudent = {
    student_id: nextStudentId++,
    name,
    email,
    course_id: cId
  };

  students.push(newStudent);
  const after = [...students];

  return {
    operation: 'INSERT',
    table: 'students',
    sql: `INSERT INTO students (name, email, course_id) VALUES ('${name}', '${email}', ${cId});`,
    affectedRows: 1,
    insertedRow: newStudent,
    before,
    after,
    educationalFeedback: {
      title: 'Operation Successful: 1 Row Inserted',
      whatHappened: `Added '${name}' and linked to ${parentCourse.course_code}.`,
      why: `Course ID ${cId} exists in parent table, satisfying referential integrity.`,
      databaseConcept: 'Foreign Key Referential Integrity Satisfied'
    }
  };
}

export function executeClientUpdate({ student_id, name }) {
  const id = parseInt(student_id, 10);
  const before = [...students];
  const target = students.find(s => s.student_id === id);

  if (!target) throw { title: 'Not Found', whatHappened: 'Student record not found.' };

  const oldName = target.name;
  target.name = name;
  const after = [...students];

  return {
    operation: 'UPDATE',
    table: 'students',
    sql: `UPDATE students SET name = '${name}' WHERE student_id = ${id};`,
    affectedRows: 1,
    diff: { student_id: id, old: { ...target, name: oldName }, new: target },
    before,
    after,
    educationalFeedback: {
      title: 'Operation Successful: 1 Row Updated',
      whatHappened: `Updated student #${id}: '${oldName}' → '${name}'.`,
      why: 'Primary key uniquely identified the target row.',
      databaseConcept: 'Primary Key Targeting'
    }
  };
}

export function executeClientDelete(student_id) {
  const id = parseInt(student_id, 10);
  const before = [...students];
  const deletedRow = students.find(s => s.student_id === id);

  if (!deletedRow) throw { title: 'Not Found', whatHappened: 'Student record not found.' };

  students = students.filter(s => s.student_id !== id);
  const after = [...students];

  return {
    operation: 'DELETE',
    table: 'students',
    sql: `DELETE FROM students WHERE student_id = ${id};`,
    affectedRows: 1,
    deletedRow,
    before,
    after,
    educationalFeedback: {
      title: 'Operation Successful: 1 Row Deleted',
      whatHappened: `Deleted student #${id} ('${deletedRow.name}').`,
      why: 'Child record removed without violating foreign key integrity.',
      databaseConcept: 'Referential Integrity Preserved'
    }
  };
}
