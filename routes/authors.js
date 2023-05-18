var express = require('express');
var router = express.Router();
var db = require('../db/mongo');
const { ObjectId } = require('mongodb');
const menuFill = require('./init').init()


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
    let authorRegex = new RegExp(["^", author, "$"].join(""), "i");
    var stories = await db.getDb('sagpic_lector', 'stories', { author: { $regex: authorRegex } })
    var authorStories = await db.getDb('sagpic_lector', 'users', { author: { $regex: authorRegex } })
    res.render('layouts/authors',
      {
        title: 'Sagpic - ' + author,
        loggedIn: req.session.user,
        menu:await menuFill,
        stories: stories,
        author: author,
        user: authorStories,
  
      },
    );
  });

module.exports = router