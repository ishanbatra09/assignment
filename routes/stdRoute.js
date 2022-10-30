const express = require('express');
const router = express.Router();

//Importing Controllers
const stdController = require('../controller/stdCont');

//Importing the middleware for the token authentication
const checkToken = require('../middleware/checkAuth');
const checkUser = require('../middleware/checkUser');

//New Registration
router.post('/signup', stdController.signupController);

//Login
router.post('/login', stdController.login);

//Get the Student Details
router.get('/:uid',checkUser.student,checkToken,stdController.getUserDetails);

//Adding Teacher to Fav
router.put('/addToFavList/:uid',checkUser.student,checkToken,stdController.addToFavList)

//Removing Teacher from Fav
router.put('/remFrFavList/:uid',checkUser.student,checkToken,stdController.remFrFavList)

//Show the FavList
router.get('/getFavList/:uid',checkUser.student,checkToken,stdController.getFavList)

module.exports = router;