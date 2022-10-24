const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/verifpassword');
const emailValidator = require('../middleware/verifEmail');

//Route concernant les Users
router.get('/:id', userCtrl.getOneUser);
router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
