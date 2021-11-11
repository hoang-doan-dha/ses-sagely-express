var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  console.log(req.session);
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

module.exports = router;
