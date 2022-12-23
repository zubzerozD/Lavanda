const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const supplySchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    }
})

module.exports = mongoose.model('supply', supplySchema);