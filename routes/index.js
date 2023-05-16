var express = require('express');
var router = express.Router();
var db = require('../db/mongo')



router.get('/', async function(req, res, next) {
  var genres = await db.getDb('sagpic_lector','genres')
  var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  res.render('layouts/index', 
  {
    title: 'Sagpic',
    loggedIn:false,
    genresMenu:genres,
    featuredAutors:featuredAutors,

  },
  );
});

router.get('/g/', async function(req, res, next) {
  var genres = await db.getDb('sagpic_lector','genres')
  var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  res.render('layouts/genres', 
  {
    title: 'Sagpic - Buffet de novelas',
    loggedIn:true,
    genresMenu:genres,
    featuredAutors:featuredAutors,

  },
  );
});

router.get('/g/:genre', async function(req, res, next) {
  try {
    
    var genero = req.params.genre
    var genres = await db.getDb('sagpic_lector','genres')
  var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  var stories = await db.getDb('sagpic_lector','stories',{genre:genero})
  var chapters =Array(stories[0].chapters).length;
} catch (error) {
  console.log(error);
   return res.redirect('/')
}
  res.render('layouts/stories', 
  {
    title: 'Sagpic - ' + genero,
    loggedIn:true,
    genresMenu:genres,
    stories:stories,
    genero:genero,
    featuredAutors:featuredAutors,
    chapters:chapters,
  },
  );
});

router.get('/authors', async function(req, res, next) {
  let genero = req.params.author
  if(genero == undefined){
    genero = 'Autores'
  }
  var genres = await db.getDb('sagpic_lector','genres')
  var stories = await db.getDb('sagpic_lector','stories',{author:genero})
  var users = await db.getDb('sagpic_lector','users',{type:'author'})
  var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  
  res.render('layouts/authors', 
  {
    galery:true,
    title: 'Sagpic - '+  genero,
    author:genero,
    loggedIn:true,
    genresMenu:genres,
    featuredAutors:featuredAutors,
    genero:genero,
    user:users,
    stories:stories,
  },
  );
});

router.get('/author/:author', async function(req, res, next) {
  let author = req.params.author
  var genres = await db.getDb('sagpic_lector','genres')
  var stories = await db.getDb('sagpic_lector','stories',{author:author})
  var user = await db.getDb('sagpic_lector','users',{name:author})
  var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  let chapters =Array(stories[0].chapters).length;
  res.render('layouts/authors', 
  {
    title: 'Sagpic - '+  author,
    loggedIn:true,
    genresMenu:genres,
    featuredAutors:featuredAutors,
    stories:stories,
    author:author,
    chapters:chapters,
    user:user,

  },
  );
});

module.exports = router;