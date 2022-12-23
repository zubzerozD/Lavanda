const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentrecord = new Schema({
    Fecha_de_pago: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    monto_pagado: {
        type: Number,
        required: true
    },
    tipo_de_pago: {
        type: String,
        required: true,
        enum: [
            'efectivo',
            'transferencia'

        ]
    },

})
module.exports = mongoose.model('paymentrecord', paymentrecord);