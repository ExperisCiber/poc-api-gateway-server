var router = require('express').Router();

router.get('/', function (req, res) {
    var endpoints = 'Get Request Working';
    res.json(endpoints);
});

router.post('/', function (req, res) {
    var endpoints = 'Post Request working';
    res.json(endpoints);
});

module.exports = router;