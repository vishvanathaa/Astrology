var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('indexN', { title: 'Node.js Express REST-Service with JSGrid' });
});

module.exports = router;
