const Machine = require('../models/machine');
const Schedule = require('../models/schedule');

const createMachine = (req, res) => {
    const { name, machineType, serial, status, schedule } = req.body
    const newMachine = new Machine({
        name,
        machineType,
        serial,
        status,
        schedule
    })
    newMachine.save((error, machine) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido crear la maquina"})
        }
        return res.status(201).send(machine)
    })
}
const getMachines = (req, res) => {//creo que hay que sacar las s de machines creo q no
    Machine.find({}).populate({ path: 'schedule ' }).exec((error, machines) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (machines.length === 0) {
            return res.status(404).send({ message: "No se encontraron maquinas" })
        }
        return res.status(200).send(machines)
    })
}
const updateMachine = (req, res) => {
    const { id } = req.params
    Machine.findByIdAndUpdate(id, req.body, (error, machine) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo actualizar las maquinas" })
        }
        if (!machine) {
            return res.status(404).send({ message: "No se encontro la maquina" })
        }
        return res.status(200).send({ message: "maquina modificada" })
    })
}
const deleteMachine = (req, res) => {
    const { id } = req.params
    Machine.findByIdAndDelete(id, (error, machine) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido eliminar la maquina" })
        }
        if (!machine) {
            return res.status(404).send({ message: "No se ha podido encontrar la maquina" })
        }
        Schedule.remove({ machine: machine._id })
        return res.status(200).send({ message: "Se ha eliminado la maquina de forma correcta" })
    })
}
const getMachine = (req, res) => {
    const { id } = req.params
    Machine.findById(id).populate({ path: ' schedule' }).exec((error, machine) => {
        if (error) {
            console.log(error)
            return res.status(400).send({ message: "Error al encontrar la maquina" })
        }
        if (!machine) {
            return res.status(404).send({ message: "No se ha podido encontrar la maquina" })
        }
        return res.status(200).send(machine)
    })
}
module.exports = {
    createMachine,
    getMachines,
    updateMachine,
    deleteMachine,
    getMachine
}