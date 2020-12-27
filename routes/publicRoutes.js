const router = require('express').Router();
module.exports = router;

const publicController = require('../controller/publicController');

router.get('/', publicController.getHomePage);

router.post('/query', publicController.query);