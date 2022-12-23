const User = require('../models/user');
const Membership = require('../models/membership');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 10);
    const { name, rut, email,birthdate, address, telephone, role} = req.body

    const newMembership = new Membership({
        state : "unpaid",
        remainingHours : 12,
        totalDebt : 0
    })
    const membership = newMembership._id;
    const newUser = new User({ name, rut, email,birthdate, address, telephone, role, password, membership });

    newMembership.save((error, mMembership) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido crear la membresia" })
        }

        newUser.save((err, user) => {
            if (err) {
                mMembership.deleteOne()
                return res.status(400).send({ message: 'Error al crear el usuario' + err });
            }
            return res.status(201).send(user);
        })
    })
}

const login = async (req, res) => {
    const { rut, password } = req.body;
    User.findOne({ rut }, (err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al iniciar sesión' });
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontró el usuario' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(400).send({ message: 'Error al iniciar sesión' });
            }
            if (!result) {
                return res.status(404).send({ message: 'Contraseña incorrecta' });
            }
            return res.status(200).send(user);
        })
    })
}

const logout = async (req, res) => {
    res.clearCookie('token');
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send({ message: 'Error al cerrar sesión' });
        }
        return res.status(200).send({ message: 'Sesión cerrada' });
    })
}

const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(400).send({ message: 'Error al verificar el token' });
        }
        return res.status(200).send({ message: 'Token verificado' });
    })
}

const getUsers = async (req, res) => {
    User.find({}).populate({ path: 'membership'}).exec((err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al obtener los usuarios' });
        }
        return res.status(200).send(user);
    })
}

const getUser = (req, res) => {
    const { id } = req.params;
    User.findById(id).populate({ path: 'membership'}).exec((err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al obtener el usuario' });
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontró el usuario' });
        }
        return res.status(200).send(user);
    })
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    User.findOneAndUpdate(id, req.body, (err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al actualizar el usuario' });
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontró el usuario' });
        }
        return res.status(200).send(user);
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    User.findOneAndDelete(id, (err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al eliminar el usuario' });
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontró el usuario' });
        }
        return res.status(200).send(user);
    })
}

const updateImgUser = async (req, res) => {
    const { id } = req.params;
    User.findOneAndUpdate(id, { profileImg: req.file.path }, (err, user) => {
        if (err) {
            return res.status(400).send({ message: 'Error al actualizar la imagen de perfil' });
        }
        if (!user) {
            return res.status(404).send({ message: 'No se encontró el usuario' });
        }
        return res.status(200).send(user);
    })
}



module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    logout,
    verifyToken,
    updateImgUser
}
