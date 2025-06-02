const express = require('express')
const router = express.Router();
const getData = require('../controllers/authController.js')

router.get('/fetch', getData.getDatafromreq);
module.exports = router;
