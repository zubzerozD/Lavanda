const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const api = express.Router();

api.post('/schedule/:id', scheduleController.createSchedule);
api.get('/schedules', scheduleController.getSchedules);
api.put('/schedule/update/:id', scheduleController.updateSchedule);
api.delete('/schedule/delete/:id', scheduleController.deleteSchedule);
api.get('/schedule/search/:id', scheduleController.getSchedule);

module.exports = api