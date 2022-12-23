const express = require('express');
const paymentrecordController = require('../controllers/paymentrecordController');
const api = express.Router();


api.post('/paymentrecord', paymentrecordController.createpaymentrecord);
api.get('/paymentrecord/:id', paymentrecordController.getpaymentrecord);
api.get('/paymentrecords', paymentrecordController.getpaymentrecords);
api.delete('/paymentrecord/delete/:id/', paymentrecordController.deletepaymentrecord);
api.get('/paymentrecord/user/:id', paymentrecordController.getpaymentrecordsuser);
module.exports = api
