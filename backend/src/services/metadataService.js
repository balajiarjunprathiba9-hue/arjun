const { getPool, getConnectionStatus, getSimulatedSchema } = require('../config/db');

/**
 * Metadata Service
 * Inspects database metadata from MySQL information_schema or simulated schema.
 */

async function getSchemaMetadata() {
  const pool = getPool();
  const status = getConnectionStatus();

  if (!pool || !status.connected) {
    return getSimulatedSchema();
  }

  try {
    const dbName = status.database;

    // 1. Get Tables
    const [tables] = await pool.query(`
      SELECT 
        TABLE_NAME AS tableName,
        TABLE_TYPE AS tableType,
        TABLE_ROWS AS estimatedRows,
        TABLE_COMMENT AS comment
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME ASC
    `, [dbName]);

    // 2. Get Columns
    const [columns] = await pool.query(`
      SELECT 
        TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        COLUMN_TYPE AS columnType,
        DATA_TYPE AS dataType,
        IS_NULLABLE AS isNullable,
        COLUMN_KEY AS columnKey,
        EXTRA AS extra,
        COLUMN_DEFAULT AS defaultValue,
        COLUMN_COMMENT AS columnComment
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME ASC, ORDINAL_POSITION ASC
    `, [dbName]);

    // 3. Get Foreign Keys and Relationships
    const [foreignKeys] = await pool.query(`
      SELECT 
        kcu.CONSTRAINT_NAME AS constraintName,
        kcu.TABLE_NAME AS childTable,
        kcu.COLUMN_NAME AS childColumn,
        kcu.REFERENCED_TABLE_NAME AS parentTable,
        kcu.REFERENCED_COLUMN_NAME AS parentColumn,
        rc.UPDATE_RULE AS onUpdate,
        rc.DELETE_RULE AS onDelete
      FROM information_schema.KEY_COLUMN_USAGE kcu
      JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
        ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
        AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
      WHERE kcu.TABLE_SCHEMA = ?
        AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
    `, [dbName]);

    // 4. Actual Row Counts
    const formattedTables = [];
    for (const t of tables) {
      let count = 0;
      try {
        const [countRes] = await pool.query(`SELECT COUNT(*) AS total FROM \`${t.tableName}\``);
        count = countRes[0].total;
      } catch (e) {
        count = t.estimatedRows || 0;
      }

      const tableCols = columns
        .filter(c => c.tableName === t.tableName)
        .map(c => {
          const fk = foreignKeys.find(f => f.childTable === t.tableName && f.childColumn === c.columnName);
          return {
            name: c.columnName,
            type: c.columnType,
            dataType: c.dataType,
            isPrimaryKey: c.columnKey === 'PRI',
            isForeignKey: !!fk,
            isNullable: c.isNullable === 'YES',
            isUnique: c.columnKey === 'UNI' || c.columnKey === 'PRI',
            isAutoIncrement: (c.extra || '').toLowerCase().includes('auto_increment'),
            defaultValue: c.defaultValue,
            columnComment: c.columnComment || '',
            foreignKey: fk ? {
              constraintName: fk.constraintName,
              referencedTable: fk.parentTable,
              referencedColumn: fk.parentColumn,
              onDelete: fk.onDelete,
              onUpdate: fk.onUpdate
            } : null
          };
        });

      formattedTables.push({
        tableName: t.tableName,
        type: t.tableType,
        rowCount: count,
        description: t.comment || `${t.tableName} table`,
        columns: tableCols
      });
    }

    // Format Relationships
    const relationships = foreignKeys.map(fk => ({
      id: `rel_${fk.childTable}_${fk.parentTable}`,
      constraintName: fk.constraintName,
      parentTable: fk.parentTable,
      parentColumn: fk.parentColumn,
      childTable: fk.childTable,
      childColumn: fk.childColumn,
      cardinality: '1:N',
      type: 'One-to-Many',
      direction: `${fk.parentTable}.${fk.parentColumn} → ${fk.childTable}.${fk.childColumn}`,
      explanation: `One ${fk.parentTable.slice(0, -1)} can have multiple ${fk.childTable}. Each ${fk.childTable.slice(0, -1)} is linked by ${fk.childColumn}.`,
      onDelete: fk.onDelete,
      onUpdate: fk.onUpdate
    }));

    return {
      database: dbName,
      tables: formattedTables,
      relationships
    };
  } catch (err) {
    console.error('[Metadata Error, falling back to simulated schema]', err);
    return getSimulatedSchema();
  }
}

module.exports = {
  getSchemaMetadata
};
