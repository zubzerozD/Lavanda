const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const membershipSchema = new Schema({
    state: {
        type: String,
        enum: [
            'paid',
            'unpaid'
        ],
        required: true
    },
    remainingHours: {
        type: Number,
        required: true
    },
    totalDebt: {
        type: Number,
        required: true
    }
})
//falta registrosDePago, 

module.exports = mongoose.model('membership', membershipSchema);
