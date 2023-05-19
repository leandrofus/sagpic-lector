var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init')().then((res)=>{
  return res
});


router.get('/authors', async function (req, res, _next) {
    let genero = req.params.author
    if (genero == undefined) {
      genero = 'Autores'
    }
    var users = await db.getDb('sagpic_lector', 'users', { type: 'author' })
    res.render('layouts/authors',
      {
        title: 'Sagpic - ' + genero,
        galery: true,
        author: genero,
        loggedIn: req.session.user,
        menu:await menuFill,
        genero: genero,
        user: users,
      },
    );
  });
  
  router.get('/author/:author', async function (req, res, _next) {
    let author = req.params.author
    var stories = await db.getDb('sagpic_lector', 'stories', { author:req.params.author })
    var authorData = await db.getDb('sagpic_lector', 'users', { _id: new ObjectId( req.params.author)})
    console.log(authorData);
    res.render('layouts/authors',
      {
        title: 'Sagpic - ' + authorData.authorName,
        loggedIn: req.session.user,
        menu:await menuFill,
        stories: stories,
        author: author,
        user: stories,
        userData:authorData

  
      },
    );
  });

module.exports = router