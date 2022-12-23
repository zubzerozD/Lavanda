const Membership = require('../models/membership');
const Schedule = require('../models/schedule');

const getMemberships = (req, res) => {
    Membership.find({}).populate({ path: 'category status' }).exec((error, memberships) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (Memberships.length === 0) {
            return res.status(404).send({ message: "No se encontraron membresias" })
        }
        return res.status(200).send(memberships)
    })
}

const updateMembership = (req, res) => {
    const { id } = req.params
    Membership.findByIdAndUpdate(id, req.body, (error, membership) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo actualizar la membresia" })
        }
        if (!membership) {
            return res.status(404).send({ message: "No se encontro la membresia" })
        }
        return res.status(200).send({ message: "membresia modificado" })
    })
}

const deleteMembership = (req, res) => {
    const { id } = req.params
    Membership.findByIdAndDelete(id, (error, membership) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido eliminar la membresia" })
        }
        if (!membership) {
            return res.status(404).send({ message: "No se ha podido encontrar la membresia" })
        }
        return res.status(200).send({ message: "Se ha eliminado la membresia de forma correcta" })
    })
}

const getMonthlyDebt = (req, res) => {
    const { uId } = req.params

    const getSchedules = (uId, callback) => {
        Schedule.find({user : uId}).sort({ startTime : -1 }).exec((error, schedules) => {
            schedules.reverse();
            callback(error, schedules) 
        })

    }

    getSchedules(uId, (err, schedules)=>{
        if (err) {
            return res.status(400).send({ message: "No se ha podido verificar la deuda" })
        }
        if (!schedules) {
            return res.status(404).send({ message: "No se encontro agendamientos" })
        }

        let infoMonthly = ({ washingHours : 0, washingDryingHours : 0, overdueHours : 0, debt : 0 })
        let month = schedules[0].startTime.getMonth()
        let dsplyInfo = ""
        let i = 0; 

        do{ let sch = schedules[i];
            i++;
            if(month != sch.startTime.getMonth()){ 
                dsplyInfo += JSON.stringify("Mes " + month + " : ", null, 4)
                let dN = new Date(Date.now())

                if(month != dN.getMonth() && sch.endTime < dN){ 
                    let extraCharge = 100 * (dN.getDate() + ((dN.getMonth() - (month + 1)) * 30))

                    dsplyInfo += JSON.stringify("(Cargo extra por atraso: " + extraCharge + ") ", null, 4)
                    infoMonthly.debt += extraCharge
                }
                
                month = sch.startTime.getMonth()
                dsplyInfo += JSON.stringify(infoMonthly, null, 4) 
                infoMonthly = ({ washingHours : 0, washingDryingHours : 0, overdueHours : 0, debt : 0 })
            }


            let rHours = ((sch.endTime.getMinutes() / 60) + sch.endTime.getHours()) - ((sch.startTime.getMinutes() / 60) + sch.startTime.getHours()) 
            let mDebt = rHours * (sch.dryingMachine != null ? 8000 : 6000)
            infoMonthly.washingHours += (sch.dryingMachine != null ? 0 : rHours)
            infoMonthly.washingDryingHours += (sch.dryingMachine != null ? rHours : 0)

            if(infoMonthly.washingDryingHours + infoMonthly.washingHours > 12){ 
                rHours = (rHours - Math.max(0, (12 - ((infoMonthly.washingDryingHours + infoMonthly.washingHours) - rHours))))
                mDebt += rHours * 1000 
                infoMonthly.overdueHours = rHours
            }

            infoMonthly.debt +=  mDebt 

            if(i >= schedules.length){ 
                dsplyInfo += JSON.stringify("Mes " + month + " : ", null, 4) 

                let dN = new Date(Date.now())

                if(month != dN.getMonth() && sch.endTime < dN){
                    let extraCharge = 100 * (dN.getDay() + (dN.getMonth() - (month + 1)) * 30) 
                    
                    dsplyInfo += JSON.stringify("(Cargo extra por atraso: " + extraCharge + ") ", null, 4)
                    infoMonthly.debt += extraCharge
                }

                dsplyInfo += JSON.stringify(infoMonthly, null, 4) 
            }
        }while(i < schedules.length)

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send(dsplyInfo)
    })
    
}

const getMembership = (req, res) => {
    const { id } = req.params
    Membership.findById(id, (error, membership) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido realizar la busqueda" })
        }
        if (!membership) {
            return res.status(404).send({ message: "No se ha podido encontrar la membresia" })
        }
        return res.status(200).send(membership)
    })
}

module.exports = {
    getMonthlyDebt,
    getMemberships,
    updateMembership,
    deleteMembership,
    getMembership
}
