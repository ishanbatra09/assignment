const express = require('express');
const router = express.Router();


//Importing Controllers
const mainController = require('../controller/main');

//Home
router.get('/', mainController.home);

//Most Like Teachers/teacher
router.get('/mostLikeTeach',mainController.mostLikeTeach);

module.exports = router;