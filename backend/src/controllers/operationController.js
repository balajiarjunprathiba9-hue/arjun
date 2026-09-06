const { executeSql, getPool, getConnectionStatus, getSimulatedTableData } = require('../config/db');
const { formatEducationalError } = require('../services/educationalErrorService');

// Helper to snapshot students table
async function getStudentsSnapshot() {
  const pool = getPool();
  const status = getConnectionStatus();
  if (pool && status.connected) {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY student_id ASC');
    return rows;
  }
  return [...(getSimulatedTableData('students') || [])];
}

// Helper to snapshot courses table
async function getCoursesSnapshot() {
  const pool = getPool();
  const status = getConnectionStatus();
  if (pool && status.connected) {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY course_id ASC');
    return rows;
  }
  return [...(getSimulatedTableData('courses') || [])];
}

// 1. INSERT STUDENT
async function insertStudent(req, res) {
  const { name, email, course_id } = req.body;

  // Basic validation
  if (!name || !email || course_id === undefined || course_id === null) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_REQUIRED_FIELDS',
        title: 'Missing Required Fields',
        whatHappened: 'Name, email, and course selection are mandatory for inserting a student.',
        why: 'The students table schema defines NOT NULL constraints on name, email, and course_id.',
        databaseConcept: 'Domain Integrity & NOT NULL Constraints',
        suggestion: 'Please provide a valid student name, email, and select a course.'
      }
    });
  }

  const courseIdInt = parseInt(course_id, 10);
  const beforeState = await getStudentsSnapshot();
  const courses = await getCoursesSnapshot();
  const sql = `INSERT INTO students (name, email, course_id) VALUES ('${name}', '${email}', ${courseIdInt});`;

  try {
    const pool = getPool();
    const status = getConnectionStatus();

    let insertId = null;
    if (pool && status.connected) {
      const [result] = await pool.query(
        'INSERT INTO students (name, email, course_id) VALUES (?, ?, ?)',
        [name, email, courseIdInt]
      );
      insertId = result.insertId;
    } else {
      const result = await executeSql(
        'INSERT INTO students (name, email, course_id) VALUES (?, ?, ?)',
        [name, email, courseIdInt]
      );
      insertId = result.rows.insertId;
    }

    const afterState = await getStudentsSnapshot();
    const insertedRow = afterState.find(s => s.student_id === insertId) || {
      student_id: insertId,
      name,
      email,
      course_id: courseIdInt
    };

    const courseObj = courses.find(c => c.course_id === courseIdInt);

    return res.status(201).json({
      success: true,
      data: {
        operation: 'INSERT',
        table: 'students',
        sql,
        affectedRows: 1,
        insertedRow,
        before: beforeState,
        after: afterState,
        educationalFeedback: {
          title: 'Operation Successful: 1 Row Inserted',
          badge: 'Referential Integrity Satisfied',
          whatHappened: `Added '${name}' to the \`students\` table and linked to course ID ${courseIdInt} (${courseObj ? courseObj.course_code : 'Course'}).`,
          why: `The foreign key value \`course_id = ${courseIdInt}\` matches an existing parent record in the \`courses\` table, satisfying the referential integrity constraint \`fk_students_course\`.`,
          databaseConcept: 'Foreign Key & Referential Integrity: A valid foreign key links a child row to an existing parent row, preserving relational consistency.',
          diagram: `[courses] ID ${courseIdInt} (${courseObj ? courseObj.course_code : ''}) ◄───[Foreign Key Valid]─── [students] '${name}' ✓`
        }
      },
      message: 'Student inserted successfully'
    });
  } catch (err) {
    const formattedError = formatEducationalError(err, {
      parentTable: 'courses',
      childTable: 'students',
      fkColumn: 'course_id',
      value: courseIdInt,
      validParentIds: courses.map(c => c.course_id)
    });

    return res.status(400).json({
      success: false,
      data: {
        operation: 'INSERT',
        table: 'students',
        sql,
        attemptedData: { name, email, course_id: courseIdInt },
        before: beforeState
      },
      error: formattedError
    });
  }
}

// 2. UPDATE STUDENT
async function updateStudent(req, res) {
  const { student_id, name, email, course_id } = req.body;

  if (!student_id) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_ID', message: 'student_id is required for update.' }
    });
  }

  const id = parseInt(student_id, 10);
  const beforeState = await getStudentsSnapshot();
  const targetRowBefore = beforeState.find(s => s.student_id === id);

  if (!targetRowBefore) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ROW_NOT_FOUND',
        title: 'Student Not Found',
        whatHappened: `No student found with student_id = ${id}.`,
        suggestion: 'Verify the student ID before attempting an update.'
      }
    });
  }

  const newName = name !== undefined ? name : targetRowBefore.name;
  const newEmail = email !== undefined ? email : targetRowBefore.email;
  const newCourseId = course_id !== undefined ? parseInt(course_id, 10) : targetRowBefore.course_id;

  const sql = `UPDATE students SET name = '${newName}', email = '${newEmail}', course_id = ${newCourseId} WHERE student_id = ${id};`;

  try {
    const pool = getPool();
    const status = getConnectionStatus();

    if (pool && status.connected) {
      await pool.query(
        'UPDATE students SET name = ?, email = ?, course_id = ? WHERE student_id = ?',
        [newName, newEmail, newCourseId, id]
      );
    } else {
      await executeSql(
        'UPDATE students SET name = ?, email = ?, course_id = ? WHERE student_id = ?',
        [newName, id]
      );
    }

    const afterState = await getStudentsSnapshot();
    const targetRowAfter = afterState.find(s => s.student_id === id);

    return res.json({
      success: true,
      data: {
        operation: 'UPDATE',
        table: 'students',
        sql,
        affectedRows: 1,
        diff: {
          student_id: id,
          old: targetRowBefore,
          new: targetRowAfter
        },
        before: beforeState,
        after: afterState,
        educationalFeedback: {
          title: 'Operation Successful: 1 Row Updated',
          badge: 'Entity Modified',
          whatHappened: `Updated student #${id}: Name changed from '${targetRowBefore.name}' to '${newName}'.`,
          why: 'The UPDATE statement targeted the row uniquely identified by the Primary Key `student_id`.',
          databaseConcept: 'Primary Key Targeting: Using a unique identifier in the WHERE clause ensures only the intended record is modified.',
          diagram: `Row #${id} [Before: "${targetRowBefore.name}"] ──► [After: "${newName}"] ✓`
        }
      },
      message: 'Student updated successfully'
    });
  } catch (err) {
    const courses = await getCoursesSnapshot();
    const formattedError = formatEducationalError(err, {
      parentTable: 'courses',
      childTable: 'students',
      fkColumn: 'course_id',
      value: newCourseId,
      validParentIds: courses.map(c => c.course_id)
    });

    return res.status(400).json({
      success: false,
      data: { operation: 'UPDATE', sql, before: beforeState },
      error: formattedError
    });
  }
}

// 3. DELETE STUDENT
async function deleteStudent(req, res) {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_ID', message: 'student_id is required for delete.' }
    });
  }

  const id = parseInt(student_id, 10);
  const beforeState = await getStudentsSnapshot();
  const deletedRow = beforeState.find(s => s.student_id === id);

  if (!deletedRow) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ROW_NOT_FOUND',
        title: 'Student Not Found',
        whatHappened: `No student found with student_id = ${id}.`,
        suggestion: 'Verify student ID before attempting delete.'
      }
    });
  }

  const sql = `DELETE FROM students WHERE student_id = ${id};`;

  try {
    const pool = getPool();
    const status = getConnectionStatus();

    if (pool && status.connected) {
      await pool.query('DELETE FROM students WHERE student_id = ?', [id]);
    } else {
      await executeSql('DELETE FROM students WHERE student_id = ?', [id]);
    }

    const afterState = await getStudentsSnapshot();

    return res.json({
      success: true,
      data: {
        operation: 'DELETE',
        table: 'students',
        sql,
        affectedRows: 1,
        deletedRow,
        before: beforeState,
        after: afterState,
        educationalFeedback: {
          title: 'Operation Successful: 1 Row Deleted',
          badge: 'Referential Integrity Preserved',
          whatHappened: `Deleted student record #${id} ('${deletedRow.name}').`,
          why: 'Deleting a child record does not violate foreign key rules because no other table references `students`.',
          databaseConcept: 'Child Record Deletion: Child rows can be safely deleted without breaking foreign key referential integrity in parent tables.',
          diagram: `[students] Row #${id} ('${deletedRow.name}') ───► [REMOVED] 🗑️`
        }
      },
      message: 'Student deleted successfully'
    });
  } catch (err) {
    const formattedError = formatEducationalError(err);
    return res.status(400).json({
      success: false,
      data: { operation: 'DELETE', sql, before: beforeState },
      error: formattedError
    });
  }
}

module.exports = {
  insertStudent,
  updateStudent,
  deleteStudent
};
