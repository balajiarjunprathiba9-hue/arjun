/**
 * Educational Error Service
 * Translates low-level MySQL database errors into beginner-friendly, visual learning lessons.
 */

function formatEducationalError(err, context = {}) {
  const code = err.code || err.errno || 'UNKNOWN_ERROR';
  const rawMessage = err.message || 'An unknown database error occurred.';

  // 1. Foreign Key Constraint Failure (Child row references non-existent parent row)
  if (code === 'ER_NO_REFERENCED_ROW_2' || code === '1452' || code === 1452 || rawMessage.includes('foreign key constraint fails')) {
    const parentTable = context.parentTable || 'courses';
    const childTable = context.childTable || 'students';
    const fkColumn = context.fkColumn || 'course_id';
    const invalidValue = context.value !== undefined ? context.value : '99';

    return {
      code: 'ER_NO_REFERENCED_ROW_2',
      title: 'Foreign Key Constraint Violation',
      severity: 'error',
      rawMessage,
      whatHappened: `MySQL rejected the operation because the foreign key '${fkColumn}' contains a value (${invalidValue}) that does not exist in the parent '${parentTable}' table.`,
      why: `The '${childTable}' table defines a foreign key rule: \`${childTable}.${fkColumn} → ${parentTable}.${fkColumn}\`. A foreign key requires that every child record points to an existing parent record to maintain data integrity.`,
      databaseConcept: 'Referential Integrity: The principle ensuring that relationships between tables remain consistent. A child table cannot reference a parent that does not exist.',
      visualExplanation: {
        type: 'fk_violation',
        parentTable: parentTable,
        childTable: childTable,
        fkColumn: fkColumn,
        attemptedValue: invalidValue,
        validValues: context.validParentIds || [1, 2, 3],
        diagram: [
          `[ ${parentTable.toUpperCase()} ]`,
          `  ├── 1 (CS101)`,
          `  ├── 2 (CS102)`,
          `  └── 3 (CS103)`,
          `          ↑`,
          `          │ [REQUIRED PARENT]`,
          `          │`,
          `[ ${childTable.toUpperCase()} ] -> ${fkColumn} = ${invalidValue} ❌ (NOT FOUND)`
        ].join('\n')
      },
      suggestion: `Select an existing ${parentTable} ID (such as 1, 2, or 3), or create a course with ID ${invalidValue} first before assigning a student to it.`
    };
  }

  // 2. Foreign Key Constraint Failure on Parent Deletion (Parent has dependent children)
  if (code === 'ER_ROW_IS_REFERENCED_2' || code === '1451' || code === 1451) {
    return {
      code: 'ER_ROW_IS_REFERENCED_2',
      title: 'Cannot Delete Parent Record (Foreign Key Protection)',
      severity: 'error',
      rawMessage,
      whatHappened: 'You attempted to delete or update a parent row that still has child records referencing it.',
      why: 'If MySQL deleted this parent row without CASCADE, the child rows would become orphaned records pointing to nothing.',
      databaseConcept: 'Cascade Rules & Referential Integrity: Foreign keys prevent orphaned records unless ON DELETE CASCADE is explicitly configured.',
      visualExplanation: {
        type: 'orphan_prevention',
        diagram: 'Parent Row ───[Protected]───> Child Rows (Students exist for this Course)'
      },
      suggestion: 'Delete or reassign the associated students first, or configure ON DELETE CASCADE.'
    };
  }

  // 3. Unique Constraint Violation
  if (code === 'ER_DUP_ENTRY' || code === '1062' || code === 1062 || rawMessage.includes('Duplicate entry')) {
    const match = rawMessage.match(/Duplicate entry '(.*?)' for key '(.*?)'/);
    const value = match ? match[1] : (context.value || 'specified value');
    const key = match ? match[2] : (context.key || 'UNIQUE column');

    return {
      code: 'ER_DUP_ENTRY',
      title: 'Unique Constraint Violation',
      severity: 'error',
      rawMessage,
      whatHappened: `The value '${value}' already exists in the table for unique field '${key}'.`,
      why: 'A column marked with UNIQUE or PRIMARY KEY requires every value in that column across all rows to be completely distinct.',
      databaseConcept: 'Entity Integrity & Unique Constraints: Used to prevent duplicate entities (such as duplicate emails or student IDs).',
      visualExplanation: {
        type: 'duplicate_entry',
        field: key,
        value: value,
        diagram: `Existing Row [email: ${value}] ◄─── Conflict ───► New Row [email: ${value}] ❌`
      },
      suggestion: `Provide a unique ${key} that is not already used by another record.`
    };
  }

  // 4. NOT NULL violation
  if (code === 'ER_BAD_NULL_ERROR' || code === '1048' || code === 'ER_NO_DEFAULT_FOR_FIELD' || code === '1364') {
    return {
      code: 'ER_BAD_NULL_ERROR',
      title: 'NOT NULL Constraint Violation',
      severity: 'error',
      rawMessage,
      whatHappened: 'A required field was left empty or supplied as NULL.',
      why: 'Columns configured with NOT NULL require a valid value for every single row inserted or updated.',
      databaseConcept: 'Domain Integrity: Enforcing that mandatory attributes are never missing.',
      visualExplanation: {
        type: 'null_violation',
        diagram: 'Column (NOT NULL) ◄─── Supplied: NULL / Empty ❌'
      },
      suggestion: 'Make sure all required fields (like name, email, or course_id) have valid values.'
    };
  }

  // 5. Unknown Table
  if (code === 'ER_NO_SUCH_TABLE' || code === '1146' || code === 1146) {
    return {
      code: 'ER_NO_SUCH_TABLE',
      title: 'Table Does Not Exist',
      severity: 'error',
      rawMessage,
      whatHappened: 'MySQL cannot find the specified table name in database `capstone_db`.',
      why: 'SQL queries must reference existing tables defined in the schema. Check for typos or casing.',
      databaseConcept: 'Schema Definition: Available tables in this database are `courses` and `students`.',
      visualExplanation: {
        type: 'missing_table',
        validTables: ['courses', 'students'],
        diagram: 'Requested: [Unknown Table] ❌ | Available: [courses], [students] ✓'
      },
      suggestion: 'Check the Schema tab to view existing table names (`courses`, `students`).'
    };
  }

  // 6. Unknown Column
  if (code === 'ER_BAD_FIELD_ERROR' || code === '1054' || code === 1054) {
    return {
      code: 'ER_BAD_FIELD_ERROR',
      title: 'Unknown Column in Query',
      severity: 'error',
      rawMessage,
      whatHappened: 'A column referenced in the SELECT, WHERE, or JOIN clause does not exist.',
      why: 'The column name does not match any attribute defined on the referenced table or alias.',
      databaseConcept: 'Attribute Mapping: Each table has a defined set of columns.',
      visualExplanation: {
        type: 'missing_column',
        diagram: 'Field Name ───[Not Found in Schema]───> ❌'
      },
      suggestion: 'Verify column names in the Schema module (`course_id`, `course_code`, `title`, `student_id`, `name`, `email`).'
    };
  }

  // 7. Syntax Error
  if (code === 'ER_PARSE_ERROR' || code === '1064' || code === 1064) {
    return {
      code: 'ER_PARSE_ERROR',
      title: 'SQL Syntax Error',
      severity: 'error',
      rawMessage,
      whatHappened: 'The SQL query could not be parsed by MySQL parser.',
      why: 'There is a typo, missing comma, unmatched quote, or incorrectly ordered clause in the SQL statement.',
      databaseConcept: 'SQL Grammar: Standard SQL statement order is SELECT ... FROM ... JOIN ... ON ... WHERE ... GROUP BY ... ORDER BY.',
      visualExplanation: {
        type: 'syntax_error',
        diagram: 'Query Text ───[Grammar Parser]───> Syntax Error at line near indicated token ❌'
      },
      suggestion: 'Check SQL keyword spelling, ensure quotes are closed, and verify commas separating column names.'
    };
  }

  // 8. Blocked Destructive Query
  if (code === 'QUERY_RESTRICTED') {
    return {
      code: 'QUERY_RESTRICTED',
      title: 'Destructive DDL Command Blocked',
      severity: 'warning',
      rawMessage,
      whatHappened: 'The SQL statement contains a destructive structural command (e.g., DROP, ALTER, TRUNCATE).',
      why: 'In this educational environment, destructive structural modifications are safeguarded to preserve the learning workspace.',
      databaseConcept: 'Database Security & Access Control: Production databases restrict DDL operations to database administrators (DBAs).',
      visualExplanation: {
        type: 'security_block',
        diagram: 'DDL Statement ───[Safety Firewall]───> Blocked 🛑'
      },
      suggestion: 'Use SELECT, INSERT, UPDATE, or DELETE statements, or click "Reset Demo Database" to reinitialize tables.'
    };
  }

  // Default Fallback
  return {
    code,
    title: 'Database Operation Error',
    severity: 'error',
    rawMessage,
    whatHappened: rawMessage,
    why: 'The database server reported an execution error.',
    databaseConcept: 'RDBMS Consistency & Integrity',
    visualExplanation: {
      type: 'general_error',
      diagram: `SQL Execution ───> Error: ${code}`
    },
    suggestion: 'Review your query and data values, or check the Schema tab.'
  };
}

module.exports = {
  formatEducationalError
};
