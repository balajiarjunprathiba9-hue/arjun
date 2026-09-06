const express = require('express');
const router = express.Router();

const { getSchema, getRelationships, getHealth, handleReset } = require('../controllers/schemaController');
const { getAllTables, getTableData } = require('../controllers/tableController');
const { executeQuery } = require('../controllers/queryController');
const { insertStudent, updateStudent, deleteStudent } = require('../controllers/operationController');

// System & Health
router.get('/health', getHealth);
router.post('/reset', handleReset);

// Schema & Relationships (Metadata)
router.get('/schema', getSchema);
router.get('/relationships', getRelationships);

// Table Data Inspection
router.get('/tables', getAllTables);
router.get('/tables/:tableName', getTableData);

// SQL Execution Lab
router.post('/query', executeQuery);

// Interactive Operations (Mutations)
router.post('/operations/insert', insertStudent);
router.put('/operations/update', updateStudent);
router.delete('/operations/delete', deleteStudent);

module.exports = router;
