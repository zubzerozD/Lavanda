//pay.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ledgerSchema = new Schema({

	balance: {
		type: Number,
		required: true
	},
	totalDebt: {
		type: Number,
		required: true
	},
	payments: [{
		type: Schema.ObjectId,
		ref: 'paymentrecord'
	}]
})

module.exports = mongoose.model('ledger', ledgerSchema);
