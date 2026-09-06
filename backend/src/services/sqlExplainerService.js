/**
 * SQL Explainer Service
 * Analyzes SQL statements and generates visual execution pipelines and
 * beginner-friendly plain English educational explanations.
 */

function explainQuery(sql, resultRows = [], affectedRows = 0) {
  const cleanSql = sql.trim().replace(/;+$/, '');
  const lowerSql = cleanSql.toLowerCase();

  const isSelect = lowerSql.startsWith('select') || lowerSql.startsWith('show') || lowerSql.startsWith('describe');
  const isInsert = lowerSql.startsWith('insert');
  const isUpdate = lowerSql.startsWith('update');
  const isDelete = lowerSql.startsWith('delete');

  // Detect tables
  const tables = [];
  if (/\b(students)\b/i.test(cleanSql)) tables.push('students');
  if (/\b(courses)\b/i.test(cleanSql)) tables.push('courses');

  // Detect JOIN
  const hasJoin = /\b(inner\s+join|left\s+join|right\s+join|join)\b/i.test(cleanSql);
  const joinMatch = cleanSql.match(/(?:inner\s+|left\s+|right\s+)?join\s+([a-zA-Z0-9_]+)(?:\s+(?:as\s+)?([a-zA-Z0-9_]+))?\s+on\s+([^;\n]+)/i);

  // Detect WHERE
  const hasWhere = /\bwhere\b/i.test(cleanSql);
  const whereMatch = cleanSql.match(/where\s+([^;\n]+?)(?:order\s+by|group\s+by|limit|$)/i);

  // Detect Columns in SELECT
  let selectedColumns = ['*'];
  if (isSelect) {
    const colMatch = cleanSql.match(/select\s+([\s\S]+?)\s+from/i);
    if (colMatch && colMatch[1]) {
      selectedColumns = colMatch[1].split(',').map(c => c.trim());
    }
  }

  // Build Execution Flow Steps
  const flowSteps = [];

  flowSteps.push({
    step: 1,
    name: 'SQL PARSE',
    icon: 'Terminal',
    type: 'parse',
    description: `Analyzed query syntax and classified as ${isSelect ? 'SELECT (READ)' : isInsert ? 'INSERT (MUTATION)' : isUpdate ? 'UPDATE (MUTATION)' : isDelete ? 'DELETE (MUTATION)' : 'SQL STATEMENT'}.`,
    details: cleanSql
  });

  if (isSelect) {
    // FROM base table
    const fromMatch = cleanSql.match(/from\s+([a-zA-Z0-9_]+)/i);
    const baseTable = fromMatch ? fromMatch[1] : (tables[0] || 'table');
    flowSteps.push({
      step: 2,
      name: `SCAN [${baseTable}]`,
      icon: 'Database',
      type: 'scan',
      description: `Scans source table '${baseTable}' to retrieve candidate rows.`,
      table: baseTable
    });

    // JOIN step
    if (hasJoin && joinMatch) {
      const joinedTable = joinMatch[1];
      const joinCondition = joinMatch[3].trim();
      flowSteps.push({
        step: 3,
        name: `JOIN [${baseTable}] ↔ [${joinedTable}]`,
        icon: 'Link',
        type: 'join',
        description: `Connected rows between '${baseTable}' and '${joinedTable}' where ${joinCondition}.`,
        table: joinedTable,
        condition: joinCondition
      });
    }

    // WHERE filter
    if (hasWhere && whereMatch) {
      const condition = whereMatch[1].trim();
      flowSteps.push({
        step: flowSteps.length + 1,
        name: `FILTER WHERE`,
        icon: 'Filter',
        type: 'filter',
        description: `Evaluated predicate: ${condition}. Kept only matching rows.`,
        condition: condition
      });
    }

    // SELECT projection
    flowSteps.push({
      step: flowSteps.length + 1,
      name: `PROJECT COLUMNS`,
      icon: 'Columns',
      type: 'projection',
      description: `Extracted requested columns (${selectedColumns.slice(0, 4).join(', ')}${selectedColumns.length > 4 ? '...' : ''}).`,
      columns: selectedColumns
    });

    // RESULT
    flowSteps.push({
      step: flowSteps.length + 1,
      name: `RESULT EMITTED`,
      icon: 'CheckCircle2',
      type: 'result',
      description: `Returned ${resultRows.length} matching row${resultRows.length === 1 ? '' : 's'} to client.`,
      rowCount: resultRows.length
    });
  } else if (isInsert) {
    flowSteps.push({
      step: 2,
      name: `VERIFY CONSTRAINTS`,
      icon: 'ShieldCheck',
      type: 'constraint_check',
      description: `Checked Primary Key uniqueness, NOT NULL rules, and Foreign Key reference.`,
      table: tables[0] || 'students'
    });
    flowSteps.push({
      step: 3,
      name: `INSERT ROW`,
      icon: 'PlusCircle',
      type: 'insert',
      description: `Persisted new record into '${tables[0] || 'students'}'.`,
      affectedRows: affectedRows || 1
    });
  } else if (isUpdate) {
    flowSteps.push({
      step: 2,
      name: `LOCATE TARGET ROW`,
      icon: 'Search',
      type: 'search',
      description: `Evaluated WHERE condition to find existing row in '${tables[0] || 'students'}'.`,
      table: tables[0] || 'students'
    });
    flowSteps.push({
      step: 3,
      name: `APPLY UPDATE`,
      icon: 'Edit3',
      type: 'update',
      description: `Updated column values and verified integrity constraints.`,
      affectedRows: affectedRows || 1
    });
  } else if (isDelete) {
    flowSteps.push({
      step: 2,
      name: `EVALUATE FOREIGN KEYS`,
      icon: 'ShieldAlert',
      type: 'fk_check',
      description: `Inspected child table dependencies to ensure referential integrity.`,
      table: tables[0] || 'students'
    });
    flowSteps.push({
      step: 3,
      name: `DELETE ROW`,
      icon: 'Trash2',
      type: 'delete',
      description: `Removed row from '${tables[0] || 'students'}'.`,
      affectedRows: affectedRows || 1
    });
  }

  // Plain-English Educational Explanation
  const explanationPoints = [];
  if (isSelect) {
    explanationPoints.push(`The query selected information from the database.`);
    if (tables.length > 1) {
      explanationPoints.push(`The \`${tables[0]}\` table was joined with \`${tables[1]}\`.`);
      explanationPoints.push(`The foreign key \`course_id\` connects students to their enrolled course.`);
    }
    if (hasWhere && whereMatch) {
      explanationPoints.push(`The WHERE condition filtered records to keep only rows matching: ${whereMatch[1].trim()}.`);
    }
    explanationPoints.push(`${resultRows.length} matching row${resultRows.length === 1 ? ' was' : 's were'} returned.`);
  } else if (isInsert) {
    explanationPoints.push(`A new record was inserted into the \`${tables[0] || 'students'}\` table.`);
    explanationPoints.push(`MySQL verified that all NOT NULL constraints and the foreign key relationship were satisfied.`);
  } else if (isUpdate) {
    explanationPoints.push(`An existing record was modified in the \`${tables[0] || 'students'}\` table.`);
    explanationPoints.push(`The updated attributes satisfied table constraints.`);
  } else if (isDelete) {
    explanationPoints.push(`A record was deleted from the \`${tables[0] || 'students'}\` table.`);
    explanationPoints.push(`Referential integrity was preserved according to the foreign key rules.`);
  }

  return {
    queryType: isSelect ? 'SELECT' : isInsert ? 'INSERT' : isUpdate ? 'UPDATE' : isDelete ? 'DELETE' : 'OTHER',
    tablesInvolved: tables,
    hasJoin,
    hasWhere,
    selectedColumns,
    flowSteps,
    educationalSummary: {
      title: 'Query Explanation: What Happened?',
      points: explanationPoints,
      tablesUsed: tables,
      operation: isSelect ? (hasJoin ? 'SELECT + INNER JOIN' + (hasWhere ? ' + WHERE' : '') : 'SELECT' + (hasWhere ? ' + WHERE' : '')) : isInsert ? 'INSERT' : isUpdate ? 'UPDATE' : 'DELETE',
      relationshipUsed: tables.includes('students') && tables.includes('courses') ? 'students.course_id → courses.course_id' : null,
      rowsReturned: isSelect ? resultRows.length : undefined,
      rowsAffected: !isSelect ? affectedRows : undefined
    }
  };
}

module.exports = {
  explainQuery
};
