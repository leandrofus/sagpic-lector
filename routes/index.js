var express = require('express');
var router = express.Router();
var db = require('../db/mongo')



router.get('/', async function (_req, res, _next) {
  var genres = await db.getDb('sagpic_lector', 'genres')
  var featuredAutors = await db.getDb('sagpic_lector', 'users', { featured: true })
  res.render('layouts/index',
    {
      title: 'Sagpic',
      loggedIn: true,
      genresMenu: genres,
      featuredAutors: featuredAutors,

    },
  );
});

router.post('/register', async function (req, res, _next) {
  if (req.body.psw1 === req.body.psw2) {
    await db.postDb('sagpic_lector', 'users', req.body)
  } else {
    return res.send('las contraseñas no coinciden')
  }
  return res.send('ok')
});

router.post('/login', async function (req, res, _next) {
  console.log(req.body);
  var genres = await db.getDb('sagpic_lector', 'users', req.body)
  if (genres.length > 0) {
    return res.send('http://localhost:3000/profile/')

  } else {
    res.send('Credenciales no validas')
  }
});
router.get('/profile/', async function (_req, res, _next) {
  // var genres = await db.getDb('sagpic_lector','genres')
  // var featuredAutors = await db.getDb('sagpic_lector','users',{featured:true})
  let authorRegex = new RegExp(["^", 'micaela Flaherty', "$"].join(""), "i");
  var users = await db.getDb('sagpic_lector', 'users', { name: { $regex: authorRegex } })
  console.log(users);
  res.render('layouts/profile',
    {
      title: 'Sagpic - Buffet de novelas',

      loggedIn: true,
      // genresMenu:genres,
      // featuredAutors:featuredAutors,
      user: users,
    },
  );
});
router.get('/g/', async function (_req, res, _next) {
  var genres = await db.getDb('sagpic_lector', 'genres')
  var featuredAutors = await db.getDb('sagpic_lector', 'users', { featured: true })
  res.render('layouts/genres',
    {
      title: 'Sagpic - Buffet de novelas',
      loggedIn: true,
      genresMenu: genres,
      featuredAutors: featuredAutors,

    },
  );
});

router.get('/g/:genre', async function (req, res, _next) {
  try {

    var genero = req.params.genre
    var genres = await db.getDb('sagpic_lector', 'genres')
    var featuredAutors = await db.getDb('sagpic_lector', 'users', { featured: true })
    var stories = await db.getDb('sagpic_lector', 'stories', { genre: genero })
    if (stories.lenght > 0) {
      var chapters = Array(stories[0].chapters).length;

    }
  } catch (error) {
    console.log(error);
    return res.redirect('/')
  }
  res.render('layouts/stories',
    {
      title: 'Sagpic - ' + genero,
      loggedIn: true,
      genresMenu: genres,
      stories: stories,
      genero: genero,
      featuredAutors: featuredAutors,
      chapters: chapters,
    },
  );
});

router.get('/authors', async function (req, res, _next) {
  let genero = req.params.author
  if (genero == undefined) {
    genero = 'Autores'
  }
  var genres = await db.getDb('sagpic_lector', 'genres')
  var users = await db.getDb('sagpic_lector', 'users', { type: 'author' })
  var featuredAutors = await db.getDb('sagpic_lector', 'users', { featured: true })
  console.log(users);
  res.render('layouts/authors',
    {
      galery: true,
      title: 'Sagpic - ' + genero,
      author: genero,
      loggedIn: true,
      genresMenu: genres,
      featuredAutors: featuredAutors,
      genero: genero,
      user: users,
    },
  );
});

router.get('/author/:author', async function (req, res, _next) {
  let author = req.params.author
  var genres = await db.getDb('sagpic_lector', 'genres')
  let authorRegex = new RegExp(["^", author, "$"].join(""), "i");
  var stories = await db.getDb('sagpic_lector', 'stories', { author: { $regex: authorRegex } })
  var user = await db.getDb('sagpic_lector', 'users', { author: { $regex: authorRegex } })
  var featuredAutors = await db.getDb('sagpic_lector', 'users', { featured: true })
  if (stories.length > 0) {
    var chapters = Array(stories[0].chapters).length;
  } else {
    var chapters = null
  }
  console.log(stories);
  res.render('layouts/authors',
    {
      title: 'Sagpic - ' + author,
      loggedIn: true,
      genresMenu: genres,
      featuredAutors: featuredAutors,
      stories: stories,
      author: author,
      chapters: chapters,
      user: user,

    },
  );
});

module.exports = router;