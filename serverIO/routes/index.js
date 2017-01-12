var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/compile', function (req, res) {
  console.log(req.body);
  res.io.emit("css", req.body);
  res.send(req.body);
})

router.post('/api/html', function (req, res) {
  console.log(req.body);
  res.io.emit("html", req.body);
  res.send(req.body);
})


module.exports = router;
