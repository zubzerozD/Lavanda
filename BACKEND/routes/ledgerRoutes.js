const express = require('express');
const api = express.Router();
const ledgerController = require('../controllers/ledgerController');

api.post('/ledger',ledgerController.createLedger)
api.get('/ledgers', ledgerController.getLedgers);
api.get('/ledger/search/:id', ledgerController.getLedger);
api.put('/ledger/update/:id', ledgerController.updateLedger);
api.delete('/ledger/delete/:id', ledgerController.deleteLedger);

module.exports = api;