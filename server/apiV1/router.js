var router = require('express').Router();

router.use('/content', require('./content/content'));

module.exports = router;