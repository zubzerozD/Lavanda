const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const machineSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    machineType: {
        type: String,
        required: true,
        //ref:'schedule',
        enum: [
            'washingMachine',
            'dryingMachine'
        ]
    },
    serial: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    status: {
        type: String,
        required: true,
        enum: [
            'Activa',
            'Inactiva'
        ]
    },
    schedule: [{
        type: Schema.Types.ObjectId,
        ref: 'schedule'
    }]
})

module.exports = mongoose.model('machine', machineSchema);