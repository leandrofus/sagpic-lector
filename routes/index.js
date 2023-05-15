var express = require('express');
var router = express.Router();
var db = require('../db/mongo')

router.get('/', async function(req, res, next) {
  console.log(req.session)
  var genres = await db.getDb('sagpic_lector','genres')
  res.render('layouts/index', 
  {
    title: 'Sagpic',
    loggedIn:true,
    genresMenu:genres,

  },
  );
});

module.exports = router;