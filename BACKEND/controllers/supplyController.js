const Supply = require('../models/supply');

const createSupply = (req, res) => {
    const { name, price, quantity, description } = req.body
    const newSupply = new Supply({
        name,
        price,
        quantity,
        description,
    })
    newSupply.save((error, supply) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido crear el suministro" })
        }
        return res.status(201).send(supply)
    })
}

const getSupplys = (req, res) => { 
    Supply.find({}, (error, supply) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (supply.length === 0) {
            return res.status(404).send({ message: "No se encontraron suministros" })
        }
        return res.status(200).send(supply)
    })
}

const updateSupply = (req, res) => {
    const { id } = req.params
    Supply.findByIdAndUpdate(id, req.body, (error, supply) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo actualizar el suministro" })
        }
        if (!supply) {
            return res.status(404).send({ message: "No se encontro el suministro" })
        }
        return res.status(200).send({ message: "suministro modificado" })
    })
}

const deleteSupply = (req, res) => {
    const { id } = req.params
    Supply.findByIdAndDelete(id, (error, supply) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido eliminar el suministro" })
        }
        if (!supply) {
            return res.status(404).send({ message: "No se ha podido encontrar un suministro" })
        }
        return res.status(200).send({ message: "Se ha eliminado el suministro de forma correcta" })
    })
}

const getSupply = (req, res) => {
    const { id } = req.params
    Supply.findById(id, (error, supply) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido modificar el suministro" })
        }
        if (!supply) {
            return res.status(404).send({ message: "No se ha podido encontrar un suministro" })
        }
        return res.status(200).send(supply)
    })
}

module.exports = {
    createSupply,
    getSupplys,
    updateSupply,
    deleteSupply,
    getSupply
}