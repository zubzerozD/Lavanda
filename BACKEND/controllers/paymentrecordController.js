const Paymentrecord = require('../models/paymentrecord');
const User = require('../models/user');
const Ledger = require('../models/ledger')
const mailerController = require('../controllers/mailerController')

const createpaymentrecord = (req, res) => {
    const { Fecha_de_pago, user, monto_pagado, tipo_de_pago } = req.body;
    const newpaymentrecord = new Paymentrecord({
        Fecha_de_pago,
        user,
        monto_pagado,
        tipo_de_pago
    });
    User.findById(newpaymentrecord.user._id, (err, user) => {
        if (err) {
            return res.status(409).send({ message: "No existe el usuario" })
        }
        if (!user) { return res.status(409).send({ message: "No existe el usuario" }) }

        Ledger.updateOne({ $push: { payments: newpaymentrecord._id }, $inc: { balance: monto_pagado } }, (error, ledger) => {
            if (error) {
                return res.status(400).send({ message: "No se pudo realizar la busqueda" })
            }
            if (!ledger) {
                return res.status(409).send({ message: "No existe el libro" })
            }


            newpaymentrecord.save((error, paymentrecord) => {
                if (error) {
                    Ledger.updateOne({ $pull: { payments: newpaymentrecord._id }, $inc: { balance: -monto_pagado } })
                    return res.status(400).send({ message: "No se ha podido crear el registro de pago" })

                }

                let extraInfo = ""
                const toSend = ("Su pago: \n" + newpaymentrecord + "\n a sido correctamente procesado\n")
                mailerController({ params : { opt : true } ,body : { title : "Confirmacion de pago", message : toSend, to : user.email}}, ({codr, msgr}) => {
                    if(codr != 200){
                        extraInfo = msgr
                    } 
                })
                
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).send(JSON.stringify({ extraInfo }, null, 10) + " " + JSON.stringify(paymentrecord , null, 10))
            })
        })
    })
}
const getpaymentrecord = (req, res) => {
    const { id } = req.params
    Paymentrecord.findById(id).populate({ path: 'user', select: 'name' }).exec((error, paymentrecord) => {
        if (error) {
            console.log(error)
            return res.status(400).send({ message: "Error al encontrar el registro de pago" })
        }
        if (!paymentrecord) {
            return res.status(404).send({ message: "No se ha podido encontrar el registro de pago" })
        }
        return res.status(200).send(paymentrecord)
    })
}
const getpaymentrecords = (req, res) => {
    Paymentrecord.find({}).populate({ path: 'user', select: 'name' }).exec((error, paymentrecord) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (paymentrecord.length === 0) {
            return res.status(404).send({ message: "No se encontraron registros de pago" })
        }
        return res.status(200).send(paymentrecord)
    })
}
const deletepaymentrecord = async (req, res) => {
    const { id } = req.params;
    Paymentrecord.findOneAndDelete(id, (err, paymentrecord) => {
        if (err) {
            return res.status(400).send({ message: 'Error al eliminar el registro' });
        }
        if (!paymentrecord) {
            return res.status(404).send({ message: 'No se encontró el registro' });
        }
        return res.status(200).send(paymentrecord);
    })
}
const getpaymentrecordsuser = async (req, res) => {
    const { id } = req.params;
    Paymentrecord.find({ user: id }).populate({ path: 'user', select: 'name' }).exec((error, paymentrecord) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (paymentrecord.length === 0) {
            return res.status(404).send({ message: "No se encontraron registros de pago" })
        }
        return res.status(200).send(paymentrecord)
    })
}
module.exports = {
    createpaymentrecord,
    getpaymentrecord,
    getpaymentrecords,
    deletepaymentrecord,
    getpaymentrecordsuser
}

