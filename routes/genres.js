var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init')().then((res)=>{
  return res
});
router.get('/g/', async function (req, res, _next) {
    res.render('layouts/genres',
      {
        title: 'Sagpic - Buffet de novelas',
        loggedIn:req.session.user,
        menu:await menuFill,
      },
    );
  });
  
  router.get('/g/:genre', async function (req, res, _next) {
    try {
  
      var genero = req.params.genre
      var stories = await db.getDb('sagpic_lector', 'genres', { name: genero })
      var ids = []
      stories[0].books.forEach(e=>{
         ids.push(e)
      })
        var obj_ids = ids.map(function(id) { return new ObjectId(id); });
      var storyMeta = await db.getDb('sagpic_lector','stories',{_id:{$in: obj_ids}})
      
    } catch (error) {
        console.log(error);
        return res.redirect('/')
    }
    res.render('layouts/stories',
      {
        title: 'Sagpic - ' + genero,
        menu:await menuFill,
        stories: storyMeta,
        genero: genero,
        loggedIn: req.session.user,
      },
    );
  });

module.exports = router