const { getSchemaMetadata } = require('../services/metadataService');
const { getConnectionStatus, resetDatabase } = require('../config/db');

async function getSchema(req, res) {
  try {
    const schema = await getSchemaMetadata();
    return res.json({
      success: true,
      data: schema,
      message: 'Schema metadata retrieved successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SCHEMA_ERROR',
        message: err.message
      }
    });
  }
}

async function getRelationships(req, res) {
  try {
    const schema = await getSchemaMetadata();
    return res.json({
      success: true,
      data: schema.relationships || [],
      message: 'Relationships retrieved successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'RELATIONSHIP_ERROR',
        message: err.message
      }
    });
  }
}

async function getHealth(req, res) {
  try {
    const status = getConnectionStatus();
    const schema = await getSchemaMetadata();
    const tableCount = schema.tables.length;
    const totalRecords = schema.tables.reduce((acc, t) => acc + (t.rowCount || 0), 0);

    return res.json({
      success: true,
      data: {
        status: 'UP',
        database: status.database,
        mode: status.mode,
        connected: status.connected,
        tableCount,
        totalRecords,
        tables: schema.tables.map(t => ({ name: t.tableName, rows: t.rowCount })),
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      },
      message: 'System is healthy'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: err.message
      }
    });
  }
}

async function handleReset(req, res) {
  try {
    const result = await resetDatabase();
    const schema = await getSchemaMetadata();
    return res.json({
      success: true,
      data: {
        resetResult: result,
        schema
      },
      message: 'Demo database restored to initial seed state.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'RESET_FAILED',
        message: err.message
      }
    });
  }
}

module.exports = {
  getSchema,
  getRelationships,
  getHealth,
  handleReset
};
