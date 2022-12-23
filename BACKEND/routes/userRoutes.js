const express = require('express');
const upload = require('../lib/Storage');
const api = express.Router();
const userController = require('../controllers/userController');

api.post('/user', upload.single('image'), userController.createUser);
api.get('/users', userController.getUsers);
api.get('/user/search/:id', userController.getUser);
api.put('/user/update/:id', userController.updateUser);
api.delete('/user/delete/:id', userController.deleteUser);
api.post('/user/login', userController.login);
api.post('/api/user/updateImg/:id', upload.single('image'), userController.updateImgUser);

module.exports = api;