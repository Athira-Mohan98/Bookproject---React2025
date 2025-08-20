// import express
const express = require('express')
const usercontroller = require('../controllers/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const bookController = require('../controllers/bookController')
const multerMiddleware = require('../middlewares/multerMiddleware')
const jobController = require('../controllers/jobController')
//create an instance 
const route = new express.Router()

//API CALL FOR REGISTER

route.post('/api/register',usercontroller.register)
route.post('/api/login',usercontroller.login)
route.post('/api/google-login',usercontroller.googleAuth)
route.post('/api/addBook',jwtMiddleware,multerMiddleware.array('UploadedImages',3),bookController.addBook)

route.get('/api/homeBooks',bookController.getHomeBooks)
route.get('/api/allbooks',jwtMiddleware,bookController.getAllBooks)
route.get('/api/getAbook/:id',jwtMiddleware,bookController.getAbook)
route.get('/api/admin-allbooks',jwtMiddleware,bookController.getAllBookAdminController)
route.put('/api/admin-approvedBook',jwtMiddleware,bookController.approveBooksadminController)
route.get('/api/admin-allUsers',jwtMiddleware,usercontroller.getAllUsersAdminController)
route.post('/api/admin-addJobs',jwtMiddleware,jobController.addJobs)
route.get('/api/admin-allJobs',jwtMiddleware,jobController.getAlljobs)
route.delete('/api/admin-deletejobs/:id',jobController.deletejobs)

route.put('/api/updateAdmin',jwtMiddleware,multerMiddleware.single('profile'),usercontroller.updateAdminDetails)
route.get('/api/admin-Details',jwtMiddleware,usercontroller.getAdminDetails) //to get details that admin changed
route.put('/api/makepayment',jwtMiddleware,bookController.makePayment)



//export the route
module.exports = route