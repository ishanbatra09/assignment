const express = require('express');
const router = express.Router();

//Importing Controllers
const teachController = require('../controller/teachCont');

//Importing the middleware for the token authentication
const checkToken = require('../middleware/checkAuth');
const checkUser = require('../middleware/checkUser');

//New Registration
router.post('/signup', teachController.signupController);

//Login
router.post('/login', teachController.login);

//Get the Student Details
router.get('/:uid',checkUser.teacher,checkToken,teachController.getUserDetails);

module.exports = router;