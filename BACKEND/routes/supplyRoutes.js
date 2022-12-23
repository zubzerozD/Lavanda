const express = require('express');
const supplyController = require('../controllers/supplyController');
const api = express.Router();

api.post('/supply', supplyController.createSupply);
api.get('/supplys', supplyController.getSupplys);
api.put('/supply/update/:id', supplyController.updateSupply);
api.delete('/supply/delete/:id', supplyController.deleteSupply);
api.get('/supply/search/:id', supplyController.getSupply);

module.exports = api