const router = require('express').Router();

// central hub for for all routing functions.. careful on the use of relative paths/doublecheck
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);






module.exports = router;