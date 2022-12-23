const express = require('express');
const machineController = require('../controllers/machineController');
const api = express.Router();

api.post('/machine', machineController.createMachine);
api.get('/machines', machineController.getMachines);
api.put('/machine/update/:id', machineController.updateMachine);
api.delete('/machine/delete/:id', machineController.deleteMachine);
api.get('/machine/search/:id', machineController.getMachine);

module.exports = api