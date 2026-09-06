const { executeSql } = require('../config/db');
const { explainQuery } = require('../services/sqlExplainerService');
const { formatEducationalError } = require('../services/educationalErrorService');

// Classify SQL statement
function classifyQuery(sql) {
  const clean = sql.trim().toLowerCase();
  
  // Restricted structural / administrative operations
  if (/\b(drop|alter|truncate|create\s+database|grant|revoke|flush|shutdown)\b/i.test(clean)) {
    return 'RESTRICTED';
  }

  // Mutations
  if (clean.startsWith('insert')) return 'MUTATION_INSERT';
  if (clean.startsWith('update')) return 'MUTATION_UPDATE';
  if (clean.startsWith('delete')) return 'MUTATION_DELETE';

  // Reads
  if (clean.startsWith('select')) return 'READ_SELECT';
  if (clean.startsWith('show')) return 'READ_SHOW';
  if (clean.startsWith('describe') || clean.startsWith('desc')) return 'READ_DESCRIBE';

  return 'OTHER';
}

async function executeQuery(req, res) {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_QUERY',
        message: 'Query string is required and cannot be empty.',
        suggestion: 'Enter a SQL query such as: SELECT * FROM students;'
      }
    });
  }

  const trimmedQuery = query.trim();
  const classification = classifyQuery(trimmedQuery);

  // Safety Check: Guard against destructive structural operations
  if (classification === 'RESTRICTED') {
    const errorObj = formatEducationalError({ code: 'QUERY_RESTRICTED', message: 'Destructive DDL query blocked.' });
    return res.status(403).json({
      success: false,
      error: errorObj
    });
  }

  const startTime = Date.now();

  try {
    const { rows, fields, mode } = await executeSql(trimmedQuery);
    const executionTimeMs = Date.now() - startTime;

    // Normalize rows array and columns
    let resultRows = [];
    let affectedRows = 0;
    let insertId = null;

    if (Array.isArray(rows)) {
      resultRows = rows;
    } else if (rows && typeof rows === 'object') {
      affectedRows = rows.affectedRows || 0;
      insertId = rows.insertId || null;
    }

    // Extract Column names
    let columnNames = [];
    if (resultRows.length > 0) {
      columnNames = Object.keys(resultRows[0]);
    } else if (fields && Array.isArray(fields)) {
      columnNames = fields.map(f => f.name);
    }

    // Generate Visual Query Flow and Educational Explanation
    const explanation = explainQuery(trimmedQuery, resultRows, affectedRows);

    return res.json({
      success: true,
      data: {
        query: trimmedQuery,
        classification,
        mode,
        executionTimeMs,
        columns: columnNames,
        rowCount: resultRows.length,
        affectedRows,
        insertId,
        rows: resultRows,
        flowSteps: explanation.flowSteps,
        educationalSummary: explanation.educationalSummary,
        tablesInvolved: explanation.tablesInvolved,
        relationshipUsed: explanation.educationalSummary.relationshipUsed
      },
      message: 'Query executed successfully'
    });
  } catch (err) {
    const executionTimeMs = Date.now() - startTime;
    const formattedError = formatEducationalError(err, err.context || {});

    return res.status(400).json({
      success: false,
      data: {
        query: trimmedQuery,
        executionTimeMs
      },
      error: formattedError
    });
  }
}

module.exports = {
  executeQuery
};
