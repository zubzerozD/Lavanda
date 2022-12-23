const Ledger = require('../models/ledger');

const createLedger = (req, res) => {
	const { balance, totalDebt } = req.body
	const newLedger = new Ledger({
		balance,
		totalDebt
	})
    console.log(balance)
	newLedger.save((error, ledger) =>{
		if(error){
			return res.status(400).send({ message: "No se ha podido crear el libro contable"})
		}
		return res.status(201).send(ledger)
	})
}
const getLedgers = (req, res) => {
	Ledger.find({}, (error,ledger) => {
		if(error){
			return res.status(400).send({message : "No se ha podido encontrar el libro contable"})
		}
		if(ledger.length == 0){
			return res.status(404).send({ message : "No existe libro contable"})
		}
		return res.status(200).send(ledger)
	})
}
const updateLedger = (req, res) => {
	const { id } = req.params
	Ledger.findByIdAndUpdate(id, req.body, (error, ledger) =>{
		if(error){
			return res.status(400).send({ message: "No se pudo actualizar el libro contable"})
		}
		if (!ledger) {
			return res.status(404).send({ message: "No se encontró libro contable"})
		}
		return res.status(200).send({ message: "Libro contable actualizado"})
	})
}
const deleteLedger = (req, res) =>{
	const { id } = req.params
	Ledger.findByIdAndDelete(id, (error, ledger) => {
		if(error){
			return res.status(400).send({ message: "No se ha podido eliminar el libro contable"})
		}
		if(!ledger){
			return res.status(404).send({ message: "No se encontró libro contable"})
		}
		return res.status(200).send({ message: "Se ha eliminado el libro contable de forma correcta"})
	})
}
const getLedger = (req, res) => {
	const { id } = req.params
	Ledger.findById(id, (error, ledger) => {
		if(error){
			return res.status(400).send({ message: "No se ha podido modificar el libro contable"})
		}
		if(!ledger){
			return res.status(404).send({ message: "No existe el libro contable"})
		}
		return res.status(200).send(ledger)
	})
}
module.exports = {
	createLedger,
	getLedgers,
	updateLedger,
	deleteLedger,
	getLedger
}