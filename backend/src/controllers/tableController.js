const { executeSql, getPool, getConnectionStatus, getSimulatedTableData } = require('../config/db');
const { getSchemaMetadata } = require('../services/metadataService');

async function getAllTables(req, res) {
  try {
    const schema = await getSchemaMetadata();
    return res.json({
      success: true,
      data: schema.tables,
      message: 'Tables retrieved successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'TABLES_FETCH_ERROR', message: err.message }
    });
  }
}

async function getTableData(req, res) {
  const { tableName } = req.params;
  const validTables = ['courses', 'students'];

  if (!validTables.includes(tableName.toLowerCase())) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TABLE_NOT_FOUND',
        message: `Table '${tableName}' does not exist in capstone_db.`,
        validTables
      }
    });
  }

  try {
    const pool = getPool();
    const status = getConnectionStatus();

    let rows = [];
    if (pool && status.connected) {
      const [dbRows] = await pool.query(`SELECT * FROM \`${tableName}\` ORDER BY 1 ASC`);
      rows = dbRows;
    } else {
      rows = getSimulatedTableData(tableName.toLowerCase()) || [];
    }

    const schema = await getSchemaMetadata();
    const tableMeta = schema.tables.find(t => t.tableName.toLowerCase() === tableName.toLowerCase());

    return res.json({
      success: true,
      data: {
        tableName,
        columns: tableMeta ? tableMeta.columns : [],
        rowCount: rows.length,
        rows
      },
      message: `Retrieved ${rows.length} records from '${tableName}'`
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'TABLE_DATA_ERROR', message: err.message }
    });
  }
}

module.exports = {
  getAllTables,
  getTableData
};
