const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendmail = (req, res) => {

    const { opt } = req.params 
    let auxRes = () =>{}

    if(opt == null){ auxRes = (cod, msg) =>{ return res.status(cod).send({message : msg}) } 
    }else{  auxRes = (cod, msg) =>{ res({ cod, msg }) } }  

    const { title, message, to } = req.body
    const token = process.env.PW
    const mail = 'benjamin.machuca1901@alumnos.ubiobio.cl'
    if (!token) {
        return auxRes(400,  "No se ha entregado la contraseña de aplicación para el correo")
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: mail,
            pass: token
        }
    })
    let directory = [
        to
    ]
    const mailOptions = {
        from: `Administrador <${mail}>`,
        to: directory,
        subject: title,
        text: `${message}`,
        html: `
             <h1>${title}</h1>
             <p>${message}</p>
         `
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return auxRes(400, "Error al enviar el correo")
        }
        return auxRes(200, "Mensaje enviado")
    })

    transporter.verify().then(() => {
        console.log('Servidor de correos habilitado')
    }).catch(err => {
        console.log('Error al utilizar servidor de correos' + err)
    })
}

module.exports = sendmail
