const express = require('express');
const membershipController = require('../controllers/membershipController');
const api = express.Router();

api.get('/membership/monthlyDebt/:uId', membershipController.getMonthlyDebt);
api.get('/memberships', membershipController.getMemberships);
api.put('/membership/update/:id', membershipController.updateMembership);
api.delete('/membership/delete/:id', membershipController.deleteMembership);
api.get('/membership/search/:id', membershipController.getMembership);

module.exports = api
