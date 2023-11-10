
const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require("body-parser")
const apiRoutes = require('./Routes/usersRoutes')

// Applying middlewares 
app.use(bodyParser.json())

// Defining routes 
app.use("/", apiRoutes)

module.exports = app