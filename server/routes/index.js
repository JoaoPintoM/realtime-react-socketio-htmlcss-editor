var express = require('express');
var router = express.Router();
// var socket = app.get('socket');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/compile', function (req, res) {
  console.log(req.body);
  res.io.emit("css", "users");

  res.send(req.body);
})

module.exports = router;
