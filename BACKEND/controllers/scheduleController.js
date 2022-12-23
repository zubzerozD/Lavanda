const Schedule = require('../models/schedule');
const Machine = require('../models/machine');
const User = require('../models/user');
const Membership = require('../models/membership');
const mailerController = require('../controllers/mailerController')

const createSchedule = (req, res) => {
    const { state, washingMachine, dryingMachine,user, startTime, endTime } = req.body;
    const { id } = req.params;
    const newSchedule = new Schedule({
        state,
        washingMachine,
        dryingMachine,
        user,
        startTime,
        endTime
    });
    

    if(newSchedule.endTime < newSchedule.startTime){ 
        return res.status(400).send({ message: "La fecha de termino debe ser menor a la de inicio" })  
    }
    if(newSchedule.endTime.getDay != newSchedule.startTime.getDay || (newSchedule.endTime - newSchedule.startTime) / 100000 > 504){ 
        return res.status(400).send({ message: "El periodo de agendamiento esta fuera de rango" })  
    }
    
    const startTimeMins = newSchedule.startTime.getHours() * 60 + newSchedule.startTime.getMinutes();
    const endTimeMins = newSchedule.endTime.getHours() * 60 + newSchedule.endTime.getMinutes();
    if((newSchedule.startTime.getDay() % 6 != 0 && (startTimeMins < 450 || endTimeMins > 1260)) || (startTimeMins < 480 || endTimeMins > 1320)){
        return res.status(400).send({ message: "El agendamiento no se encuentra en horarios de antencion" })  
    }

    Schedule.findOne({washingMachine: newSchedule.washingMachine, $or: [{ startTime: { $gte: newSchedule.startTime, $lte: newSchedule.endTime } }, { endTime: { $gte: newSchedule.startTime, $lte: newSchedule.endTime } }] }, (errSche, fSchedule) => {
        if(errSche){
            return res.status(400).send({ message: "Error al comprobar la agenda" })
        }

        let extraInfo = "";
        if(fSchedule){
            if(newSchedule.state == "maintenance"){ 
                //obtener el schedula antes para mandar el correo despues
                
                deleteSchedule( { params : { id: fSchedule._id, opt : true } }, ({cod, msg}) => {
                    if(cod != 200){
                        return res.status(cod).send({ message: msg }) 
                    }else{ 
                        User.findById(fSchedule.user, (usErr, user)=> {
                            if(usErr){
                                extraInfo +=  "Error al buscar usuario agendado -------" 
                            }
                            if(!user){
                                extraInfo +=  "No se econtro usuario agendado -------" 
                            }
                            const toSend = ("Su agendamiento \n" + fSchedule + "\n a sido eliminado\n")
                            mailerController({ params : { opt : true } ,body : { title : "Agendamiento eliminado por mantencion", message : toSend, to : user.email}}, ({codr, msgr}) => {
                                if(codr != 200){
                                    extraInfo += msgr 
                                } else{
                                    extraInfo += "Se ha informado al usuario por correo -------  " 
                                }
                                extraInfo += "Se ha eliminado un agendamiento previo para la mantencion -------  " 
                            })

                           
                        })

                    }
                })

            }else{
                return res.status(409).send({ message: "El horario ya esta en uso" }) 
            }
        }

        User.findByIdAndUpdate(id , { $push: { schedule: newSchedule._id } }, (usErr, user) => {
            if(usErr){
                return res.status(400).send({ message: extraInfo + "No se pudo actualizar el usuario" })
            }
            if(!user){
                return res.status(409).send({ message: extraInfo + "Usuario no encontrado" }) 
            }
            
            newSchedule.save( (schError, nSchedule) => {
                if (schError) {
                    User.updateOne({ $pull : { schedule : newSchedule._id }})
                    return res.status(400).send({ message: extraInfo + "Error al agendar" })                     
                }
                
                Machine.updateMany({ $or: [{ _id : newSchedule.washingMachine, machineType: "washingMachine"}, { _id : newSchedule.dryingMachine, machineType: "dryingMachine" }]}, { $push: { schedule: newSchedule._id } },(maErr, machines) => {
                    if(maErr){
                        //membership.updateOne({ $inc: [{remainingHours : rHours },  { debt: -payAmount }] })
                        User.updateOne({ $pull : { schedule : newSchedule._id }})
                        nSchedule.deleteOne()
                        return res.status(400).send({ message: extraInfo + "No se pudo actualizar la/s maquina/s" })
                    }

                    if(machines.count < 2 && (machines.count == 0 || newSchedule.dryingMachine != null)){ 
                        //membership.updateOne({ $inc: [{remainingHours : rHours },  { debt: -payAmount }] })
                        User.updateOne({ $pull : { schedule : newSchedule._id }})
                        nSchedule.deleteOne()
                        return res.status(404).send({ message: extraInfo + "maquina/s no encontrada/s" })     
                    }
                    
                    if(newSchedule.state == "maintenance"){
                        res.setHeader('Content-Type', 'application/json')
                        return res.status(200).send(JSON.stringify({ extraInfo }, null, 10)  +  JSON.stringify(nSchedule, null, 4))
                    }

                    const rHours = (endTimeMins - startTimeMins) / 60; 
                    Membership.findByIdAndUpdate(user.membership, { $inc: { remainingHours: -(rHours) } },(memErr, membership) => {
                        if(memErr){
                            nSchedule.deleteOne()
                            User.updateOne({ $pull : { schedule : newSchedule._id }})
                            machines.updateMany({ $pull: { schedule: newSchedule._id }} )
                            return res.status(400).send({ message: extraInfo +  "No se pudo actualizar la membresia" })
                        }
                        if(!membership){
                            nSchedule.deleteOne()
                            User.updateOne({ $pull : { schedule : newSchedule._id }})
                            machines.updateMany({ $pull: { schedule: newSchedule._id }} )
                            return res.status(409).send({ message: extraInfo +  "Membresia no encontrada" }) 
                        } 
    
                        const payAmount = rHours * (newSchedule.dryingMachine == null ? 6000 : 8000 ) + (membership.remainingHours < 0 ? (rHours - Math.max(0, membership.remainingHours + rHours)) * 1000 : 0);
                        
                        Membership.findByIdAndUpdate(user.membership, {$inc: { totalDebt: payAmount }})
                        //membership.updateOne( {$inc: { totalDebt: payAmount }}) 
                        if(membership.remainingHours < 0){ 
                            extraInfo += "Exede el uso de la lavanderia mensual por un total de: " + (-membership.remainingHours) + " horas y se realizara un cobro extra de 1000 por hora extra que se haya agendado ------ "
                        }
                        
                        extraInfo += "El monto a pagar por el agendamiento es de " + payAmount + "  ---------------"
                        
                        res.setHeader('Content-Type', 'application/json')
                        return res.status(200).send(JSON.stringify({ extraInfo }, null, 10)  +  JSON.stringify(nSchedule, null, 4))
                    })
                    
                }) 
            })
        })
    }) 
    
}

const getSchedules = (req, res) => { 
    Schedule.find({}).populate({ path: 'user', select: 'name' }).exec((error, schedules) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (schedules.length === 0) {
            return res.status(404).send({ message: "No se encontraron agendamientos" })
        }
        return res.status(200).send(schedules)
    })
}

const updateSchedule = (req, res) => {
    const { id } = req.params
    Schedule.findByIdAndUpdate(id, req.body, (error, schedule) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo actualizar el agendamiento" })
        }
        if (!schedule) {
            return res.status(404).send({ message: "No se encontro el agendamiento" })
        }
        return res.status(200).send({ message: "agendamiento modificado" })
    })
}

const deleteSchedule = (req, res) => {
    const { id, opt } = req.params 
    let auxRes = () =>{};

    if(opt == null){ auxRes = (cod, msg) =>{ return res.status(cod).send({message : msg}) } 
    }else{  auxRes = (cod, msg) =>{ res({ cod, msg }) } }  

    Schedule.findByIdAndDelete(id, (error, schedule) => {
        if (error) {
            return auxRes(400, "No se ha podido eliminar el agendamiento" )
        }
        if (!schedule) {
            return auxRes(404, "No se ha podido encontrar un agendamiento")
        }

        Machine.updateMany({ $or: [{ _id : schedule.washingMachine }, { _id : schedule.dryingMachine }]}, { $pull: { schedule: schedule._id } }, (error, machine) => { 
            if (error) {
                return auxRes(400, "No se pudo actualizar la/s maquina/s")
            }
            if (!machine) {
                return auxRes(404, "No se encontro la/s maquina/s" )
            }
            User.findByIdAndUpdate(schedule.user, { $pull: { schedule: schedule._id } }, (error, user) => { 
                if (error) {
                    return auxRes(400, "No se pudo actualizar el usuario")
                }
                if (!user) {
                    return auxRes(404, "No se encontro el usuario")
                }

                return auxRes(200, "Se ha eliminado el agendamiento de forma correcta")
            })
        })
    })
}

const getSchedule = (req, res) => {
    const { id } = req.params
    Schedule.findById(id).populate({ path: 'user', select: 'name' }).exec( (error, schedule) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido modificar el agendamiento" })
        }
        if (!schedule) {
            return res.status(404).send({ message: "No se ha podido encontrar el agendamiento" })
        }
        return res.status(200).send(schedule)
    })
}

module.exports = {
    createSchedule,
    getSchedules,
    updateSchedule,
    deleteSchedule,
    getSchedule
}
