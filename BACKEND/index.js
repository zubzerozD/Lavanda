const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const multer = require('multer');
//const {verefyToken} = require('./lib/verifyToken');
dotenv.config();

const supplyRoutes = require('./routes/supplyRoutes'); 
const machineRoutes = require('./routes/machineRoutes'); 
const userRoutes = require('./routes/userRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const mailerRoutes = require('./routes/mailerRoutes');
const paymentrecordRoutes = require('./routes/paymentrecordRoutes');
const ledgerRoutes =require('./routes/ledgerRoutes');


app.use(cors());
app.use(express.json());
app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use('/api', supplyRoutes);
app.use('/api', machineRoutes);
app.use('/api', userRoutes);
app.use('/api', membershipRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', mailerRoutes);
app.use('/api', paymentrecordRoutes);
app.use('/api', ledgerRoutes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to database");
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
