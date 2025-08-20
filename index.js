//import dotenv file 
//Loads .env file contents into process.env by default.
require('dotenv').config()
//1 import express
const express = require('express')
//5 import cors
const cors = require('cors')
//8 import router
const route = require('./router/route') 
//import db
const db = require('./config/db')
//import appMiddlewarw
// const appMiddleware = require('./middlewares/appMiddleware')
//2 Create a server app using express
const bookServer = express()

//6 implementing cors 
bookServer.use(cors())
//7 implementing middleware
bookServer.use(express.json()) // Returns middleware that only parses json
// bookServer.use(appMiddleware)
bookServer.use(route)

const path = require('path');
bookServer.use('/upload', express.static(path.join(__dirname, 'uploads')));
//3 Define port 
const PORT = process.env.PORT || 3000;

//4 Server listen
bookServer.listen(PORT,()=>{
    console.log("Book server Listening on the port ",PORT);
    
})