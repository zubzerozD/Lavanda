const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scheduleSchema = new Schema({
    state: {
        type: String,
        required: true,
        enum: [
            'maintenance',
            'utilized'
        ]
    },
    washingMachine: {
        type: Schema.Types.ObjectId,
        ref: 'machine',
        required: true
    },
    dryingMachine: {
        type: Schema.Types.ObjectId,
        ref: 'machine'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('schedule', scheduleSchema);
