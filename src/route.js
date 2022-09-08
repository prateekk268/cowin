const express = require('express');
const route = express.Router()
const { getHospitals} = require('./controller/controller');

route.post('/getHospitals', getHospitals)




module.exports = route;